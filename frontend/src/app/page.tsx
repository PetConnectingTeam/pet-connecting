import React from "react";
import UserProfile from "./components/UserProfile";
import PetProfile from "./components/PetProfile";
import Menu from "./components/MenuBar"; // Importing the Menu component
import TopBar from "./components/TopBar"; // Importing the TopBar component correctly
import { Margin } from "@mui/icons-material";

function App() {
  const userData = {
    username: "John Doe",
    bio: "Pet lover and experienced dog sitter.",
    email: "john.doe@example.com",
    profilePhoto: "https://via.placeholder.com/150",
    petPhotos: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
    reviews: [
      { rating: 5, comment: "Great service, very reliable!" },
      { rating: 4, comment: "My dog loved the sitter!" },
    ],
  };

  const petData = {
    petName: "Buddy",
    petType: "Dog",
    petAge: 3,
    petDescription: "A friendly and energetic dog who loves to play fetch!",
    petImage: "https://source.unsplash.com/100x100/?dog",
  };

  return (
   
    <div className="App" style={{ display: "flex" }}>
      
      <div style={{ flexGrow: 8 }}>
        <TopBar /> {/* TopBar added here */}
        <div style={{ padding: "20px" }}>
          {/* Render UserProfile */}
          <UserProfile {...userData} />

          {/* Render PetProfile */}
          <PetProfile {...petData} />
          {/* Adding the MenuBar component */}
          <Menu />
          
        </div>
      </div>
    </div>
  );
}

export default App;
