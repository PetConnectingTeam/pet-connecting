import React from "react";
import PetProfile from "./components/PetProfile";

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
    <div className="App">
      <PetProfile {...petData} />
    </div>
  );
}

export default App;
