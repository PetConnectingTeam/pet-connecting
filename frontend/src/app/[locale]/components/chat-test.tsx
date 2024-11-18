import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Avatar,
} from "@mui/material";
import { Send as SendIcon, Close as CloseIcon } from "@mui/icons-material";

const ChatTest = ({ userId, onClose }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:5001", {
      query: { user_id: userId },
      transports: ["websocket"], // Usar WebSocket para la comunicación directa
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("status", (data) => {
      console.log("Server status:", data.msg);
    });

    newSocket.on("receive_message", (data) => {
      console.log("Received message:", data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: data.sender_id,
          content: data.content,
          timestamp: data.timestamp,
        },
      ]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const handleSendMessage = (e) => {
    console.log("!", socket);

    e.preventDefault();

    if (socket && message.trim() && receiverId) {
      socket.emit("send_message", {
        sender_id: userId,
        receiver_id: receiverId,
        content: message,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "You",
          content: message,
          timestamp: new Date().toISOString(),
        },
      ]);

      setMessage("");
    }
  };

  return (
    <Card sx={{ width: 400, position: "fixed", bottom: 70, right: 0 }}>
      <CardHeader
        avatar={<Avatar>{userId[0]}</Avatar>}
        title={`Chat with User ${receiverId}`}
        action={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
      />
      <CardContent sx={{ maxHeight: 300, overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Typography
              variant="body2"
              color={msg.sender === "You" ? "blue" : "black"}
            >
              <strong>{msg.sender}:</strong> {msg.content} <br />
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </Typography>
          </Box>
        ))}
      </CardContent>
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{ display: "flex", padding: 1 }}
      >
        <TextField
          fullWidth
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          label="Receiver ID"
          size="small"
          sx={{ marginRight: 1 }}
        />
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          label="Message"
          size="small"
          sx={{ marginRight: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ minWidth: 50 }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Card>
  );
};

export default ChatTest;
