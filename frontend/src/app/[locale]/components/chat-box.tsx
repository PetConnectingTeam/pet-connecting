import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Card,
  Paper,
  Fade,
} from "@mui/material";
import { Close as CloseIcon, Send as SendIcon } from "@mui/icons-material";
import { io, Socket } from "socket.io-client";
import { styled } from "@mui/system";
import Cookies from "js-cookie";

const ChatContainer = styled(Card)(({ theme }) => ({
  width: "95%",
  maxWidth: "400px",
  margin: "20px auto",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  height: "500px",
  marginTop: "20px",
  marginBottom: "50px",
  display: "flex",
  flexDirection: "column",
  position: "fixed",
  bottom: 16,
  left: "50%",
  transform: "translateX(-50%)",
  right: "auto",
}));

const MessageContainer = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "20px",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#e0e0e0",
    borderRadius: "3px",
  },
});

const Message = styled(Paper)(({ isUser }: { isUser: boolean }) => ({
  padding: "10px 16px",
  borderRadius: isUser ? "16px 16px 0 16px" : "16px 16px 16px 0",
  backgroundColor: isUser ? "#2196f3" : "#f5f5f5",
  color: isUser ? "#fff" : "#333",
  maxWidth: "80%",
  marginBottom: "12px",
  marginLeft: isUser ? "auto" : "0",
  marginRight: isUser ? "0" : "auto",
  position: "relative",
  transition: "all 0.3s ease",
}));

const InputContainer = styled(Box)({
  padding: "16px",
  borderTop: "1px solid #eee",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

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
    const newSocket = io("http://localhost:5001", {
      query: { user_id: currentUserId },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server as user:", currentUserId);
    });

    newSocket.on("status", (data) => {
      console.log("Status update from server:", data.msg);
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

    // newSocket.on("disconnect", () => {
    //   console.warn("Disconnected from server");
    // });

    return () => {
      newSocket.disconnect();
    };
  }, [receiverId]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (socket && message.trim()) {
      socket.emit("send_message", {
        sender_id: currentUserId,
        receiver_id: receiverId,
        content: message,
      });

      setMessages([
        ...messages,
        {
          content: message,
          sender: "You",
          timestamp: new Date().toISOString(),
        },
      ]);
      setMessage("");
    }
  };

  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear().toString().slice(2)} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <ChatContainer role="region" aria-label="Chat interface">
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          borderBottom: "1px solid #eee",
          pb: 1,
          ml: 2,
          mt: 2,
          mr: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {user.name}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Typography>

      <MessageContainer>
        {messages.map((message, index) => (
          <Fade in={true} key={index} timeout={500}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              {message.sender === "You" ? (
                <Message isUser={true}>
                  <Typography variant="body1">{message.content}</Typography>
                  <Typography variant="caption">
                    {formatTimestamp(message.timestamp)}
                  </Typography>
                </Message>
              ) : (
                <>
                  <Avatar
                    sx={{ mr: 1, ml: 1, bgcolor: "#2196f3" }}
                    src={getImageSrc(user)}
                  ></Avatar>
                  <Message isUser={false}>
                    <Typography variant="body1">{message.content}</Typography>
                    <Typography variant="caption">
                      {formatTimestamp(message.timestamp)}
                    </Typography>
                  </Message>
                </>
              )}
            </Box>
          </Fade>
        ))}
        <div ref={messagesEndRef} />
      </MessageContainer>
      <InputContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          aria-label="Message input"
          multiline
          maxRows={3}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!message.trim()}
          aria-label="Send message"
          sx={{
            backgroundColor: "#2196f3",
            color: "white",
            "&:hover": {
              backgroundColor: "#1976d2",
            },
            "&.Mui-disabled": {
              backgroundColor: "#e0e0e0",
              color: "#9e9e9e",
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatBox;
