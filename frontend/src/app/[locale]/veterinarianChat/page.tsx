"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Button,
  Badge,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Paper,
  ListItemButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { FiSend, FiMenu, FiMoreVertical } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  profile_image_base64?: string;
  image_mimetype?: string;
  role_id: string;
}

interface chatContent {
  content: string;
  receiver_id: string;
  sender_id: string;
  timestamp: string;
}

const getImageSrc = (user: User): string => {
  return user?.profile_image_base64 && user.image_mimetype
    ? `data:${user.image_mimetype};base64,${user.profile_image_base64}`
    : "/default-avatar.png";
};

const StyledChatContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  overflow: "hidden",
  backgroundColor: "#FFFFFF",
}));

const StyledSidebar = styled(Paper)(({ theme }) => ({
  width: 320,
  borderRight: "0.5px solid rgba(0, 0, 0, 0.2)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
}));

const StyledContactList = styled(List)({
  overflowY: "auto",
  flex: 1,
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "3px",
  },
});

const StyledChatArea = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const StyledMessageList = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "16px",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "3px",
  },
});

const StyledMessage = styled(Box)(({ sent }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: sent ? "flex-end" : "flex-start",
  marginBottom: "12px",
  maxWidth: "70%",
  marginLeft: sent ? "auto" : 0,
  marginRight: sent ? 0 : "auto",
}));

const MessageContent = styled(Paper)(({ sent }) => ({
  background: sent ? "#2196f3" : "#f5f5f5",
  color: sent ? "#fff" : "#333",
  padding: "12px 16px",
  borderRadius: "12px",
  wordBreak: "break-word",
}));

const VeterinarianChat = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messagesHistory, setMessagesHistory] = useState<
    { sender: string | undefined; content: string; timestamp: string }[]
  >([]);
  const selfUser = {
    id: Cookies.get("user_id"),
    name: Cookies.get("user_name"),
    roleId: Cookies.get("role_id"),
  };
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  useEffect(() => {
    const newSocket = io("http://localhost:5001", {
      query: { user_id: selfUser.id },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server as user:", selfUser.id);
    });

    newSocket.on("status", (data) => {
      console.log("Status update from server:", data.msg);
    });

    newSocket.on("receive_message", (data) => {
      console.log("Received message:", data);
      setMessagesHistory((prevMessages) => [
        ...prevMessages,
        {
          sender: data.sender_id.toString(),
          content: data.content,
          timestamp: data.timestamp,
        },
      ]);
    });
    return () => {
      newSocket.disconnect();
    };
  }, [selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/users", {
          headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
        });
        if (selfUser.roleId === "vet") {
          setUsers(
            response.data.filter(
              (u: User) =>
                u.id.toString() !== Cookies.get("user_id") &&
                u.role_id === "premium"
            )
          );
        } else {
          setUsers(
            response.data.filter(
              (u: User) =>
                u.id.toString() !== Cookies.get("user_id") &&
                u.role_id === "vet"
            )
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
    setSelectedUser(users[0]);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesHistory]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (socket && message.trim()) {
      socket.emit("send_message", {
        sender_id: selfUser.id ? selfUser.id.toString() : "1",
        receiver_id: selectedUser?.id.toString(),
        content: message,
      });

      setMessagesHistory([
        ...messagesHistory,
        {
          sender: selfUser.id,
          content: message,
          timestamp: new Date().toLocaleTimeString(),
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

  const sidebar = (
    <StyledSidebar elevation={0}>
      <Box
        p={2}
        borderBottom={1}
        borderColor="divider"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" fontWeight="600">
          Messages
        </Typography>
        <IconButton onClick={() => router.push("/home")} size="small">
          <IoHome />
        </IconButton>
      </Box>
      <StyledContactList>
        {users.map((user) => (
          <ListItem
            key={user.id}
            disablePadding
            sx={{
              paddingY: 1.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
            onClick={() => isMobile && setMobileOpen(false)}
          >
            <ListItemButton
              onClick={async () => {
                setSelectedUser(user);
                const response = axios.get(
                  `http://127.0.0.1:5001/user/${user.id}/chat`,
                  {
                    headers: {
                      Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                  }
                );
                const chatContent: chatContent[] = (await response).data;

                setMessagesHistory(
                  chatContent.map((c) => ({
                    sender: c.sender_id,
                    content: c.content,
                    timestamp: c.timestamp,
                  }))
                );
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  color="primary"
                >
                  <Avatar src={getImageSrc(user)} alt={user.name} />
                </Badge>
              </ListItemAvatar>

              <ListItemText
                primary={user.name}
                secondary={
                  <Box
                    component="span"
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="body2"
                      noWrap
                      component="span"
                      sx={{ flex: 1 }}
                    >
                      {}
                    </Typography>
                  </Box>
                }
                primaryTypographyProps={{ fontWeight: "500" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </StyledContactList>
    </StyledSidebar>
  );

  return (
    <StyledChatContainer>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          {sidebar}
        </Drawer>
      ) : (
        sidebar
      )}
      <StyledChatArea>
        <Paper elevation={1} sx={{ borderRadius: 0 }}>
          <Box
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              {isMobile && (
                <IconButton
                  edge="start"
                  onClick={() => setMobileOpen(true)}
                  sx={{ mr: 2 }}
                >
                  <FiMenu />
                </IconButton>
              )}
              <Avatar
                src={getImageSrc(selectedUser ? selectedUser : users[0])}
                sx={{ mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  {selectedUser ? selectedUser.name : users[0]?.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {"Online"}
                </Typography>
              </Box>
            </Box>
            <IconButton>
              <FiMoreVertical />
            </IconButton>
          </Box>
        </Paper>
        <StyledMessageList>
          {messagesHistory.map((msg) => (
            <StyledMessage key={msg.timestamp} sent={msg.sender == selfUser.id}>
              <MessageContent sent={msg.sender == selfUser.id}>
                <Typography>{msg.content}</Typography>
              </MessageContent>
              <Typography
                variant="caption"
                sx={{ mt: 0.5, opacity: 0.7, color: "#000" }}
              >
                {msg.timestamp}
              </Typography>
            </StyledMessage>
          ))}
          <div ref={messagesEndRef} />
        </StyledMessageList>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 0 }}>
          <Grid container spacing={2}>
            <Grid item xs>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                variant="outlined"
                size="small"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSend}
                disabled={!message.trim()}
                sx={{ height: "100%", borderRadius: 2 }}
              >
                <FiSend />
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </StyledChatArea>
    </StyledChatContainer>
  );
};

export default VeterinarianChat;
