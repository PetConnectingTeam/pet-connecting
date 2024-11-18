import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  TextField,
} from "@mui/material";
import { Close as CloseIcon, Send as SendIcon } from "@mui/icons-material";
import Cookies from "js-cookie";
import axios from "axios";
import ChatTest from "./chat-test";

interface User {
  id: string;
  name: string;
  profile_image_base64?: string; // Add this field for base64 images
  image_mimetype?: string; // Add this field for image type
}

// Helper function to construct image source from base64 and mimetype
const getImageSrc = (user: User): string => {
  if (user.profile_image_base64 && user.image_mimetype) {
    return `data:${user.image_mimetype};base64,${user.profile_image_base64}`;
  }
  // Return a default avatar image if no profile image is available
  return "/default-avatar.png"; // Make sure to have a default avatar image in your public folder
};

const ChatBox = ({ user, onClose }: { user: User; onClose: () => void }) => {
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Sending message to ${user.name}: ${message}`);
    setMessage("");
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
        <Typography variant="body2" color="text.secondary" align="center">
          No messages yet
        </Typography>
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
          onChange={(e) => setMessage(e.target.value)}
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

const Sidebar = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const currentUserId = Cookies.get("user_id");

  useEffect(() => {
    const userId = Cookies.get("user_id");
    if (userId) {
      setLoggedInUserId(userId);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/users", {
          headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        const data = await response.data;
        console.log("Fetched users:", data);

        if (loggedInUserId) {
          const filteredUsers = data.filter(
            (user: User) => String(user.id) !== String(loggedInUserId)
          );
          console.log(
            "Filtered users (excluding logged-in user):",
            filteredUsers
          );
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (loggedInUserId) {
      fetchUsers();
    }
  }, [loggedInUserId]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <>
      <Box
        sx={{
          width: 300,
          backgroundColor: "#f0f0f0",
          p: 3,
          position: "fixed",
          right: 0,
          top: "65px",
          height: "calc(100vh - 65px)",
          overflowY: "auto",
          paddingBottom: 3,
        }}
      >
        <Box mb={3}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            color="#000000"
          >
            Pet Owner Chats
          </Typography>
          <List>
            {users.map((user) => (
              <ListItem key={user.id} disablePadding>
                <ListItemButton onClick={() => handleUserClick(user)}>
                  <ListItemAvatar>
                    <Avatar src={getImageSrc(user)} alt={user.name} />
                  </ListItemAvatar>
                  <ListItemText sx={{ color: "#000000" }} primary={user.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {selectedUser && (
        <ChatTest
          userId={currentUserId}
          onClose={() => setSelectedUser(null)}
        />
        // <ChatBox user={selectedUser} onClose={handleCloseChat} />
      )}
    </>
  );
};

export default Sidebar;
