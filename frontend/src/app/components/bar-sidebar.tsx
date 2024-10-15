import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Box,
} from "@mui/material";
import {
  Home,
  Message,
  People,
  RssFeed,
  Collections,
  Event,
  PhotoLibrary,
  HelpOutline,
  ExitToApp,
} from "@mui/icons-material";
import Link from "next/link"; // Import the Next.js Link component

const drawerWidth = 240;

const groups = [
  { name: "Pet Lovers", avatar: "/placeholder.svg?height=40&width=40" },
  { name: "PetCareConnect", avatar: "/placeholder.svg?height=40&width=40" },
  { name: "Travel with Pets", avatar: "/placeholder.svg?height=40&width=40" },
  { name: "Pet Memes", avatar: "/placeholder.svg?height=40&width=40" },
];

export default function Sidebar() {
  return (
    <Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          marginTop: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f0f0f0",
            height: `calc(100% - 60px)`,
            marginTop: 8,
          },
        }}
        variant="permanent"
      >
        <List>
          <ListItem>
            <Link
              href="/home"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </Link>
          </ListItem>

          <ListItem>
            <Link
              href="/profile"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <Avatar
                    src="/placeholder.svg?height=40&width=40"
                    sx={{ width: 24, height: 24 }}
                  />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
        <Divider />
        <Typography
          variant="subtitle2"
          sx={{ px: 2, py: 1, fontWeight: "bold" }}
        >
          Favorites
        </Typography>
        <List>
          {[
            { text: "Messages", icon: <Message />, link: "/messages" },
            { text: "Friends", icon: <People />, link: "/friends" },
            { text: "Feed", icon: <RssFeed />, link: "/feed" },
            { text: "Stories", icon: <Collections />, link: "/stories" },
            { text: "Events", icon: <Event />, link: "/events" },
            { text: "Memories", icon: <PhotoLibrary />, link: "/memories" },
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <Link
                href={item.link}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography
          variant="subtitle2"
          sx={{ px: 2, py: 1, fontWeight: "bold" }}
        >
          Groups
        </Typography>
        <List>
          {groups.map((group) => (
            <ListItem key={group.name} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Avatar src={group.avatar} sx={{ width: 24, height: 24 }} />
                </ListItemIcon>
                <ListItemText primary={group.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem>
            <Link
              href="/help"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <HelpOutline />
                </ListItemIcon>
                <ListItemText primary="Help & Support" />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
