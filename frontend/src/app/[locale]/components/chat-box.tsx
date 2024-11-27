import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { Close as CloseIcon, Send as SendIcon } from "@mui/icons-material";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  profile_image_base64?: string;
  image_mimetype?: string;
}

const getImageSrc = (user: User): string => {
  return user.profile_image_base64 && user.image_mimetype
    ? `data:${user.image_mimetype};base64,${user.profile_image_base64}`
    : "/default-avatar.png";
};

const ChatBox = ({
  user,
  onClose,
  setMessages,
  messages,
}: {
  user: User;
  onClose: () => void;
  setMessages: React.Dispatch<
    React.SetStateAction<
      { sender: string; content: string; timestamp: string }[]
    >
  >;
  messages: { sender: string; content: string; timestamp: string }[];
}) => {
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const currentUserId = Cookies.get("user_id");
  const [receiverId, setReceiverId] = useState(user.id.toString());

  useEffect(() => {
    // Crea y configura el socket al usuario actual
    const newSocket = io("http://localhost:5001", {
      query: { user_id: currentUserId },
      transports: ["websocket"], // Usar WebSocket para la comunicación directa
    });

    // Guardar el socket en el estado
    setSocket(newSocket);

    // Listeners para los eventos
    newSocket.on("connect", () => {
      console.log("Connected to server as user:", currentUserId);
    });

    newSocket.on("status", (data) => {
      console.log("Status update from server:", data.msg);
    });

    // Escucha de mensajes entrantes
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

    // newSocket.on("disconnect", () => {
    //   console.warn("Disconnected from server");
    // });

    return () => {
      newSocket.disconnect();
    };
  }, [receiverId]);

  const handleSendMessage = (e: React.FormEvent) => {
    console.log("!", socket);
    e.preventDefault();

    console.log("Sender:", currentUserId, Cookies.get("email"));
    console.log("Receiver:", receiverId, user.name);

    if (socket && message.trim()) {
      socket.emit("send_message", {
        sender_id: currentUserId,
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
    <Card
      sx={{
        position: "fixed",
        bottom: 16,
        right: 316,
        width: 300,
        height: 400,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        avatar={<Avatar src={getImageSrc(user)} alt={user.name} />}
        title={user.name}
        action={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
      />
      <CardContent sx={{ flexGrow: 1, overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <Typography
            key={index}
            color={msg.sender === "You" ? "blue" : "black"}
          >
            {msg.timestamp}-{msg.sender}: {msg.content}
          </Typography>
        ))}
      </CardContent>
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{ p: 2, borderTop: 1, borderColor: "divider" }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <IconButton type="submit" edge="end">
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Card>
  );
};

export default ChatBox;
