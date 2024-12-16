"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Paper,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import { Close as CloseIcon, Send as SendIcon } from "@mui/icons-material";

const ChatContainer = styled(Card)(({ theme }) => ({
  maxWidth: "800px",
  margin: "2rem auto",
  padding: "1rem",
  height: "600px",
  display: "flex",
  flexDirection: "column",
  background: "linear-gradient(145deg, #f0f0f0 0%, #ffffff 100%)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  borderRadius: "20px",
}));

const MessagesArea = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "1rem",
  scrollBehavior: "smooth",
});

const MessageBubble = styled(Paper)(({ isUser }) => ({
  maxWidth: "70%",
  padding: "0.8rem 1rem",
  margin: "0.5rem",
  borderRadius: isUser ? "20px 20px 0 20px" : "20px 20px 20px 0",
  backgroundColor: isUser ? "#2196f3" : "#f5f5f5",
  color: isUser ? "#fff" : "#333",
  alignSelf: isUser ? "flex-end" : "flex-start",
  position: "relative",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const InputArea = styled(Box)({
  display: "flex",
  gap: "1rem",
  padding: "1rem",
  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
});

const StyledTextField = styled(TextField)({
  flex: 1,
  "& .MuiOutlinedInput-root": {
    borderRadius: "25px",
  },
});

const SendButton = styled(IconButton)({
  backgroundColor: "#2196f3",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#1976d2",
  },
});

const MessageContainer = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: "1rem",
  flexDirection: "column",
});

const VeterinarianChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", isUser: false },
    {
      id: 2,
      text: "I'm having issues with my recent order #12345",
      isUser: true,
    },
    {
      id: 3,
      text: "I'm sorry to hear that. Could you please provide more details about the issue?",
      isUser: false,
    },
    { id: 4, text: "The product I received is damaged", isUser: true },
    {
      id: 5,
      text: "I apologize for the inconvenience. I'll help you process a replacement right away. Could you please provide some photos of the damaged product?",
      isUser: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, isUser: true },
      ]);
      setNewMessage("");

      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "Thank you for the information. Our team will process your request shortly.",
            isUser: false,
          },
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container disableGutters>
      <ChatContainer aria-label="Chat interface">
        <Typography variant="h6" gutterBottom sx={{ padding: "0.5rem 1rem" }}>
          Veterinarian Chat
        </Typography>
        <MessagesArea>
          {messages.map((message) => (
            <MessageContainer
              key={message.id}
              sx={{ alignItems: message.isUser ? "flex-end" : "flex-start" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  marginBottom: 0.5,
                }}
              >
                {!message.isUser && (
                  <Avatar sx={{ backgroundColor: "#2196f3" }}>
                    <SendIcon />
                  </Avatar>
                )}
                {message.isUser && (
                  <Avatar sx={{ backgroundColor: "#4caf50" }}>
                    <SendIcon />
                  </Avatar>
                )}
              </Box>
              <MessageBubble isUser={message.isUser} elevation={1}>
                <Typography variant="body1">{message.text}</Typography>
              </MessageBubble>
            </MessageContainer>
          ))}
          <div ref={messagesEndRef} />
        </MessagesArea>
        <InputArea>
          <StyledTextField
            fullWidth
            placeholder="Type your message..."
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={3}
            aria-label="Message input"
          />
          <SendButton onClick={handleSend} aria-label="Send message">
            <SendIcon />
          </SendButton>
        </InputArea>
      </ChatContainer>
    </Container>
  );
};

export default VeterinarianChat;
