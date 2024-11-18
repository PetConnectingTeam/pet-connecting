// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Avatar,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   ListItemButton,
// } from "@mui/material";
// import axios from "axios";
// import Cookies from "js-cookie";
// import ChatBox from "./chat-box";
// import { io, Socket } from "socket.io-client";
// import Chat from "../[locale]/components/chat-test";

// interface User {
//   id: string;
//   name: string;
//   profile_image_base64?: string;
//   image_mimetype?: string;
// }

// const getImageSrc = (user: User): string => {
//   return user.profile_image_base64 && user.image_mimetype
//     ? `data:${user.image_mimetype};base64,${user.profile_image_base64}`
//     : "/default-avatar.png";
// };

// const ChatSidebar = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const currentUserId = Cookies.get("user_id");
//   const [messages, setMessages] = useState<
//     { sender: string; content: string; timestamp: string }[]
//   >([]);

//   useEffect(() => {
//     console.log("!!!");

//     // Crea y configura el socket al usuario actual
//     const newSocket = io("http://localhost:5001", {
//       query: { user_id: currentUserId },
//       transports: ["websocket"], // Usar WebSocket para la comunicación directa
//     });

//     // Guardar el socket en el estado
//     setSocket(newSocket);

//     // Listeners para los eventos
//     newSocket.on("connect", () => {
//       console.log("Connected to server as user:", currentUserId);
//     });

//     newSocket.on("status", (data) => {
//       console.log("Status update from server:", data.msg);
//     });

//     // Escucha de mensajes entrantes
//     newSocket.on("receive_message", (data) => {
//       console.log("Received message:", data);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         {
//           sender: data.sender_id,
//           content: data.content,
//           timestamp: data.timestamp,
//         },
//       ]);
//     });

//     // Listener para la desconexión
//     // newSocket.on("disconnect", () => {
//     //   console.warn("Disconnected from server");
//     // });

//     // Limpieza: desconectar el socket cuando el componente se desmonte o cambie el usuario
//     return () => {
//       newSocket.disconnect();
//     };
//   }, [currentUserId]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:5001/users", {
//           headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
//         });
//         setUsers(
//           response.data.filter((u: User) => u.id !== Cookies.get("user_id"))
//         );
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   return (
//     <Box
//       sx={{
//         width: 300,
//         bgcolor: "#f0f0f0",
//         p: 3,
//         position: "fixed",
//         right: 0,
//         top: "65px",
//         height: "calc(100vh - 65px)",
//         overflowY: "auto",
//       }}
//     >
//       <Typography variant="h6" fontWeight="bold" gutterBottom>
//         Chat
//       </Typography>
//       <List>
//         {users.map((user) => (
//           <ListItem key={user.id} disablePadding>
//             <ListItemButton onClick={() => setSelectedUser(user)}>
//               <ListItemAvatar>
//                 <Avatar src={getImageSrc(user)} alt={user.name} />
//               </ListItemAvatar>
//               <ListItemText primary={user.name} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//       {selectedUser && (
//         <ChatBox
//           user={selectedUser}
//           onClose={() => setSelectedUser(null)}
//           socket={socket}
//           messages={messages}
//           setMessages={setMessages}
//         />
//       )}
//       {/* <Chat userId={currentUserId} onClose={() => {}} /> */}
//     </Box>
//   );
// };

// export default ChatSidebar;
