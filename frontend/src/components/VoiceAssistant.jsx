import React, { useState, useRef, useEffect } from "react";

export default function VoiceAssistant() {
  const [chat, setChat] = useState([]);
  const [step, setStep] = useState(0);

  const canListen = useRef(false);
  const recognition = useRef(null);

  const booking = useRef({
    customerName: "",
    numberOfGuests: "",
    city: "",
    restaurantName: "",
    bookingDate: "",
    bookingTime: "",
    seatingPreference: "",
    weatherInfo: null,
  });

  const questions = [
    "What is your name?",
    "How many guests?",
    "Which city are you booking from?",
    "Which restaurant would you like to book?",
    "What date would you like to book?",
    "At what time?",
    "Do you prefer indoor or outdoor seating?",
    "Thank you. Fetching weather and saving your booking now.",
  ];

  // ---------- SMART DATE PARSER ----------
  const parseNaturalDate = (text) => {
    text = text.toLowerCase().trim();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    if (text.includes("today")) return today.toISOString().slice(0, 10);
    if (text.includes("tomorrow") || text.includes("kal"))
      return tomorrow.toISOString().slice(0, 10);
    if (text.includes("day after") || text.includes("parso"))
      return dayAfter.toISOString().slice(0, 10);

    const numPattern = text.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/);
    if (numPattern) {
      let [_, d, m, y] = numPattern;
      if (y.length === 2) y = "20" + y;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    const months = {
      jan: "01",
      january: "01",
      feb: "02",
      february: "02",
      mar: "03",
      march: "03",
      apr: "04",
      april: "04",
      may: "05",
      jun: "06",
      june: "06",
      jul: "07",
      july: "07",
      aug: "08",
      august: "08",
      sep: "09",
      sept: "09",
      september: "09",
      oct: "10",
      october: "10",
      nov: "11",
      november: "11",
      dec: "12",
      december: "12",
    };

    const words = text.split(" ");
    for (let i = 0; i < words.length - 1; i++) {
      const day = words[i].replace(/\D/g, "");
      const month = words[i + 1].toLowerCase();
      if (day && months[month]) {
        const year = new Date().getFullYear();
        return `${year}-${months[month]}-${day.padStart(2, "0")}`;
      }
    }

    return null;
  };

  // ---------- EXTRACT HELPERS ----------
  const extractGuests = (text) => {
    const num = text.replace(/[^0-9]/g, "");
    return num || null;
  };

  const extractDate = (text) => parseNaturalDate(text);

  const extractSeating = (text) => {
    if (/indoor/i.test(text)) return "indoor";
    if (/outdoor/i.test(text)) return "outdoor";
    return null;
  };

  // ---------- WEATHER FETCH VIA BACKEND ----------
  const getWeather = async (city) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/weather/${city}`
      );

      const data = await response.json();

      if (data.error) {
        console.warn("Weather Error:", data.error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Weather fetch failed:", err);
      return null;
    }
  };

  // ---------- INIT SPEECH RECOGNITION ----------
  useEffect(() => {
    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.lang = "en-IN";
    recognition.current.interimResults = false;
    recognition.current.continuous = false;

    recognition.current.onresult = handleSpeechResult;
    recognition.current.onend = () => {
      if (canListen.current) recognition.current.start();
    };
  }, [step]);

  // ---------- CHAT HELPERS ----------
  const bot = (msg) =>
    setChat((prev) => [...prev, { sender: "bot", message: msg }]);

  const user = (msg) =>
    setChat((prev) => [...prev, { sender: "user", message: msg }]);

  // ---------- SPEAK ----------
  const speak = (msg) => {
    bot(msg);
    const utter = new SpeechSynthesisUtterance(msg);

    utter.onend = () => {
      if (step < 7) {
        setTimeout(() => {
          canListen.current = true;
          recognition.current.start();
        }, 300);
      }
    };

    window.speechSynthesis.speak(utter);
  };

  // ---------- HANDLE SPEECH ----------
  const handleSpeechResult = (event) => {
    if (!canListen.current) return;
    canListen.current = false;

    const raw = event.results[0][0].transcript.trim();
    user(raw);

    let extracted = null;

    if (step === 0) extracted = raw;
    if (step === 1) extracted = extractGuests(raw);
    if (step === 2) extracted = raw;
    if (step === 3) extracted = raw;
    if (step === 4) extracted = extractDate(raw);
    if (step === 5) extracted = raw;
    if (step === 6) extracted = extractSeating(raw);

    if (!extracted) {
      speak("Sorry, I didn’t understand. Please repeat.");
      return setTimeout(() => speak(questions[step]), 400);
    }

    // Save extracted answer
    const keys = [
      "customerName",
      "numberOfGuests",
      "city",
      "restaurantName",
      "bookingDate",
      "bookingTime",
      "seatingPreference",
    ];

    booking.current[keys[step]] = extracted;

    // Next step
    const next = step + 1;
    setStep(next);
    recognition.current.stop();

    if (next === 7) {
      speak(questions[7]);
      saveBooking();
      return;
    }

    setTimeout(() => speak(questions[next]), 400);
  };

  // ---------- SAVE BOOKING ----------
  const saveBooking = async () => {
    const weather = await getWeather(booking.current.city);
    booking.current.weatherInfo = weather;

    if (weather) {
      bot(
        `Weather in ${booking.current.city}: ${weather.temp}°C, ${weather.description}`
      );
    } else {
      bot(`Could not fetch weather for ${booking.current.city}.`);
    }

    await fetch("http://localhost:9000/api/bookings/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking.current),
    });

    bot("Your booking has been saved successfully! 🎉");
  };

  // ---------- START ----------
  const startConversation = () => {
    canListen.current = false;
    setChat([]);
    setStep(0);
    speak(questions[0]);
  };

  return (
    <div>
      <button onClick={startConversation}>Start Booking</button>

      <div className="chat-box">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={msg.sender === "bot" ? "bot-msg" : "user-msg"}
          >
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}
