# ♟️ Glassmorphic Python-React Chess Game

A modern, real-time multiplayer chess application featuring a sleek glassmorphism UI. The game uses a decoupled architecture where a React frontend communicates instantly with a robust Python FastAPI backend via WebSockets.

---

## 🚀 Tech Stack

**Frontend:**
* React.js (UI Framework)
* `react-chessboard` (Interactive board component)
* Custom CSS (Glassmorphism design & dark theme)

**Backend:**
* Python (Core language)
* FastAPI (Web framework and WebSocket server)
* `python-chess` (Handles official game logic, move validation, and checkmate detection)

---

## 📁 Project Structure

```text
chess-app/
├── client/                     # React Frontend
│   ├── public/                 
│   │   └── index.html          # Base HTML file
│   ├── src/
│   │   ├── components/
│   │   │   └── ChessBoard.jsx  # Board UI & WebSocket client
│   │   ├── App.css             # Glassmorphism & Dark Theme
│   │   ├── App.jsx             # Main App Component
│   │   └── index.jsx           # React Entry Point
│   ├── package.json            # Node dependencies
│   └── package-lock.json       
└── server/                     # Python Backend
    ├── main.py                 # FastAPI WebSocket server & Logic
    └── requirements.txt        # Python dependencies
🛠️ Prerequisites
Before you begin, ensure you have the following installed on your machine:

Node.js & npm: (Required to run the React frontend)

Python 3.8+: (Required to run the FastAPI backend)

⚙️ Installation & Setup
You will need to install the dependencies for both the frontend and backend separately.

1. Setup the Python Backend
Open a terminal and navigate to the server directory:

Bash
cd server
pip install -r requirements.txt
(If you don't have a requirements.txt file, manually run: pip install fastapi uvicorn python-chess websockets)

2. Setup the React Frontend
Open a separate terminal and navigate to the client directory:

Bash
cd client
npm install
🎮 How to Run the Game
To play the game, you must run both servers simultaneously in two separate terminal windows.

Terminal 1: Start the Backend (Python)
Navigate to the server folder and start the uvicorn server:

Bash
cd server
uvicorn main:app --reload --port 8000
Wait until you see Application startup complete. in the terminal.

Terminal 2: Start the Frontend (React)
Navigate to the client folder and start the React development server:

Bash
cd client
npm start
This will automatically open your browser to http://localhost:3000.

🧩 Troubleshooting Common Issues
1. The screen is completely white when I run npm start

Ensure your index.html file is located exactly at client/public/index.html.

Ensure your package.json is completely valid JSON and contains react-scripts.

2. The chessboard loads, but it is static and I cannot move pieces

Check the status text: If it says "Connecting...", the frontend cannot find the Python backend.

Are both servers running? Ensure your Python terminal didn't crash or close.

The Windows WebSockets fix: Windows sometimes blocks localhost for WebSockets. Open client/src/components/ChessBoard.jsx and ensure line 12 is using 127.0.0.1:

JavaScript
// It should look EXACTLY like this:
ws.current = new WebSocket("ws://127.0.0.1:8000/ws");
🔮 Future Roadmap

Add player matchmaking and lobby generation.
Add a custom Python-based AI opponent (Stockfish integration).
Implement a visual move history sidebar (PGN notation).
Display captured pieces for both Black and White.
Add a chat box for live multiplayer sessions.


Made by Kinza Zahra
