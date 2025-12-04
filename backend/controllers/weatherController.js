import axios from "axios";

export const getWeather = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const url = `${process.env.WEATHER_URL}?q=${city}&appid=${process.env.WEATHER_KEY}&units=metric`;

    const response = await axios.get(url);

    return res.json({
      temp: response.data.main.temp,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
    });

  } catch (err) {
    console.error(err.response?.data || err);

    return res.status(500).json({
      error: "Failed to fetch weather. Check API key or city name.",
    });
  }
};
