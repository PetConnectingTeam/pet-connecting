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
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import ChatBox from "./chat-box";

interface User {
  id: string;
  name: string;
  profile_image_base64?: string;
  image_mimetype?: string;
}

interface chatContent {
  content: string;
  receiver_id: string;
  sender_id: string;
  timestamp: string;
}

const getImageSrc = (user: User): string => {
  return user.profile_image_base64 && user.image_mimetype
    ? `data:${user.image_mimetype};base64,${user.profile_image_base64}`
    : "/default-avatar.png";
};

const ChatComp = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<
    { sender: string; content: string; timestamp: string }[]
  >([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/users", {
          headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
        });
        setUsers(
          response.data.filter(
            (u: User) => u.id.toString() !== Cookies.get("user_id")
          )
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = async (user: User) => {
    setSelectedUser(user);

    try {
      // Fetch chat messages
      const response = await axios.get(
        `http://127.0.0.1:5001/user/${user.id}/chat`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      const chatContent: chatContent[] = response.data;

      setMessages(
        chatContent.map((c) => ({
          sender: c.sender_id,
          content: c.content,
          timestamp: c.timestamp,
        }))
      );

      // Fetch UserId of the applicant
      const applicationsResponse = await axios.get(
        `http://127.0.0.1:5001/service/${user.id}/applications`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      const userId = applicationsResponse.data[0]?.UserId;

      // Fetch PublisherId
      const servicesResponse = await axios.get(
        `http://127.0.0.1:5001/services?ServiceId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      const publisherId = servicesResponse.data.PublisherId;

      console.log("UserId:", userId, "PublisherId:", publisherId);
      // Use userId and publisherId as needed in your chat logic
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };

  return (
    <Box
      sx={{
        width: 300,
        bgcolor: "rgba(255, 255, 255, 0.8)",
        p: 3,
        position: "fixed",
        right: 0,
        top: "65px",
        height: "calc(100vh - 65px)",
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ color: "#000000" }}
        gutterBottom
      >
        Chat
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id} disablePadding>
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

                setMessages(
                  chatContent.map((c) => ({
                    sender: c.sender_id,
                    content: c.content,
                    timestamp: c.timestamp,
                  }))
                );
              }}
            >
              <ListItemAvatar>
                <Avatar src={getImageSrc(user)} alt={user.name} />
              </ListItemAvatar>
              <ListItemText sx={{ color: "#000000" }} primary={user.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {selectedUser && (
        <ChatBox
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          messages={messages}
          setMessages={setMessages}
        />
      )}
    </Box>
  );
};

export default ChatComp;
