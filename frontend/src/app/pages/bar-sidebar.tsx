import React from 'react';
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
} from '@mui/material';
import {
  Home,
  Person,
  Message,
  People,
  RssFeed,
  Collections,
  Event,
  PhotoLibrary,
  HelpOutline,
  ExitToApp,
} from '@mui/icons-material';

const drawerWidth = 240;

const groups = [
  { name: 'Pet Lovers', avatar: '/placeholder.svg?height=40&width=40' },
  { name: 'PetCareConnect', avatar: '/placeholder.svg?height=40&width=40' },
  { name: 'Travel with Pets', avatar: '/placeholder.svg?height=40&width=40' },
  { name: 'Pet Memes', avatar: '/placeholder.svg?height=40&width=40' },
];

export default function Component() {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f0f0f0',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Avatar src="/placeholder.svg?height=40&width=40" sx={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
        Favorites
      </Typography>
      <List>
        {['Messages', 'Friends', 'Feed', 'Stories', 'Events', 'Memories'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index === 0 ? <Message /> :
                 index === 1 ? <People /> :
                 index === 2 ? <RssFeed /> :
                 index === 3 ? <Collections /> :
                 index === 4 ? <Event /> :
                 <PhotoLibrary />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
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
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <HelpOutline />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
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
  );
}