from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import chess
import json

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global game state and connected clients
board = chess.Board()
connected_clients = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    
    # Send the current board state immediately upon connection
    await websocket.send_text(json.dumps({"fen": board.fen(), "turn": "white" if board.turn else "black"}))
    
    try:
        while True:
            # Wait for a move from the client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if "move" in message:
                move_uci = message["move"] # e.g., 'e2e4'
                try:
                    move = chess.Move.from_uci(move_uci)
                    if move in board.legal_moves:
                        board.push(move)
                        
                        # Broadcast the new state to ALL players
                        state = {
                            "fen": board.fen(),
                            "turn": "white" if board.turn else "black",
                            "is_checkmate": board.is_checkmate()
                        }
                        for client in connected_clients:
                            await client.send_text(json.dumps(state))
                    else:
                        # Reject illegal move
                        await websocket.send_text(json.dumps({"error": "Illegal move", "fen": board.fen()}))
                except ValueError:
                    await websocket.send_text(json.dumps({"error": "Invalid move format"}))
                    
            elif message.get("action") == "reset":
                board.reset()
                state = {"fen": board.fen(), "turn": "white"}
                for client in connected_clients:
                    await client.send_text(json.dumps(state))

    except WebSocketDisconnect:
        connected_clients.remove(websocket)