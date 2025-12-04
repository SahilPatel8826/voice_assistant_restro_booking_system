# voice_assistant_restro_booking_system
📌 Overview

The Voice Assistant Project is an interactive MERN-stack application designed to take voice input from users, understand their requests, and perform automated tasks. It includes a React-based frontend for capturing user speech and a Node.js + Express backend for processing commands like booking tables, checking weather, and performing custom actions.

The system acts like a mini personal assistant that greets the user, listens for commands, interprets them, and triggers backend APIs.

🎙️ What the Voice Assistant Can Do

-Greet the user with a spoken welcome message

-Listen to the user's voice instructions

-Convert speech to text inside the frontend

-Process commands like:

-Restaurant booking

-Weather reports

-Fetching stored data from the backend

-Show results on the UI and console

-Respond with a voice output

-This allows users to interact with your system hands-free.

🧩 Tech Stack
Frontend

-React.js (Vite or CRA)

-JavaScript (ES6+)

-Web SpeechRecognition API

-Fetch API for backend communication

Backend

-Node.js

-Express.js

-MongoDB + Mongoose

-REST API design
# 🚀 Setup Instructions

Follow the steps below to run the **Voice Assistant MERN Project** on your local system.

---

## 🧰 1. Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or above)  
- **MongoDB** (Local or MongoDB Atlas)  
- **Git**
- A modern browser (Chrome recommended — required for SpeechRecognition API)

---

## 📥 2. Clone the Repository

```bash


git clone <your-repository-url>

⚙️ BACKEND SETUP
📌 Step 1 — Navigate to Backend Folder
cd backend

📌 Step 2 — Install Backend Dependencies
npm install

Functioning:

Installs all required Node.js libraries listed in package.json, including:

express

mongoose

cors

These packages are required to run the backend API.

📌 Step 3 — Create Backend .env File

Create a file named .env inside the backend folder:

MONGO_URI=your_mongo_connection_string
PORT=9000

📌 Step 4 — Start Backend Server
npm run dev


Backend will run at:

http://localhost:9000



FRONTEND SETUP
1️⃣ Navigate to frontend
cd ../frontend
2️⃣ Install frontend dependencies
npm install
3️⃣ Create frontend .env
VITE_BACKEND_URL=http://localhost:9000
4️⃣ Start frontend development server
npm run dev
The frontend runs at:

http://localhost:5173

