import React, { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import "../App.css";

const ChessGame = () => {
  const [fen, setFen] = useState("start");
  const [status, setStatus] = useState("Connecting...");
  const ws = useRef(null);

  useEffect(() => {
    // Connect to the Python FastAPI WebSocket
    ws.current = new WebSocket("ws://localhost:8000/ws");

    ws.current.onopen = () => {
      setStatus("Connected! White's Turn");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.fen) setFen(data.fen);
      
      if (data.is_checkmate) {
        setStatus("Checkmate!");
      } else if (data.turn) {
        setStatus(`${data.turn === 'white' ? "White" : "Black"}'s Turn`);
      }
      
      if (data.error) {
        console.error(data.error);
        // If illegal move, reset board to last valid FEN received
        setFen(data.fen);
      }
    };

    return () => {
      ws.current.close();
    };
  }, []);

  function onDrop(sourceSquare, targetSquare) {
    // Determine if it's a potential promotion (pawn reaching 1st or 8th rank)
    const isPromotion = (sourceSquare[1] === '7' && targetSquare[1] === '8') || 
                        (sourceSquare[1] === '2' && targetSquare[1] === '1');
    
    // Format move as UCI (Universal Chess Interface), e.g., 'e2e4' or 'e7e8q'
    let move = `${sourceSquare}${targetSquare}`;
    if (isPromotion) move += 'q'; // Auto-promote to queen for simplicity

    // Send move to Python server
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ move }));
    }
    return true; 
  }

  const resetGame = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: "reset" }));
    }
  };

  return (
    <div className="glass-container">
      <div className="status-bar">{status}</div>
      <div className="board-wrapper">
        <Chessboard 
          position={fen} 
          onPieceDrop={onDrop} 
          customDarkSquareStyle={{ backgroundColor: "#3d4a7d" }}
          customLightSquareStyle={{ backgroundColor: "#919abf" }}
          animationDuration={300}
        />
      </div>
      <button className="reset-btn" onClick={resetGame}>
        Reset Board
      </button>
    </div>
  );
};

export default ChessGame;