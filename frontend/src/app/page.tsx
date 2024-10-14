import React from "react";
import PetProfile from "./components/PetProfile";

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
    <div className="App">
      <UserProfile {...userData} />
      <PetProfile {...petData} />
    </div>
  );
}

export default App;
