import React from "react";
import UserProfile from "./components/UserProfile";
import PetProfile from "./components/PetProfile";
import Menu from "./components/MenuBar"; 
import TopBar from "./components/TopBar"; 


function App() {
  const userData = {
    userId: 123,
    username: "John Doe",
    bio: "Amante de las mascotas y cuidador de perros experimentado.",
    email: "john.doe@example.com",
    profilePhoto: "https://via.placeholder.com/150",
    petPhotos: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
    reviews: [
      { rating: 5, comment: "¡Excelente servicio, muy confiable!" },
      { rating: 4, comment: "¡Mi perro adoró al cuidador!" },
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
