import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Avatar,
} from '@mui/material';
import { Camera } from '@mui/icons-material';

interface UserProfileProps {
  userId: number;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [petPhotos, setPetPhotos] = useState<string[]>([]);
  const [newBio, setNewBio] = useState("");
  const [newPetPhotos, setNewPetPhotos] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setBio(data.bio);
          setEmail(data.email);
          setProfilePhoto(data.profilePhoto);
          setPetPhotos(data.petPhotos);
          setNewBio(data.bio);
        } else {
          console.error("Failed to fetch user profile data");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleAddPetPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('petPhoto', file);

      try {
        const response = await fetch(`/api/user/${userId}/add-pet-photo`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const newPhotoUrl = URL.createObjectURL(file);
          setNewPetPhotos([...newPetPhotos, newPhotoUrl]);
        } else {
          console.error("Failed to upload new pet photo");
        }
      } catch (error) {
        console.error("Error uploading pet photo:", error);
      }
    }
  };

  const handleSaveChanges = async () => {
    const updatedProfile = {
      bio: newBio,
    };

    try {
      const response = await fetch(`/api/user/${userId}/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        setBio(newBio);
        setEditMode(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeletePetPhoto = async (photo: string) => {
    try {
      const response = await fetch(`/api/user/${userId}/delete-pet-photo`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl: photo }),
      });

      if (response.ok) {
        setNewPetPhotos(newPetPhotos.filter(p => p !== photo));
      } else {
        console.error("Failed to delete pet photo");
      }
    } catch (error) {
      console.error("Error deleting pet photo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">User Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6 text-center">
                <Avatar
                  src={profilePhoto}
                  alt={username}
                  sx={{ width: 120, height: 120, margin: '0 auto' }}
                />
                <h2 className="text-2xl font-semibold mt-4">{username}</h2>
                <p className="text-muted-foreground">{email}</p>
                <Button
                  className="mt-4"
                  onClick={() => (editMode ? handleSaveChanges() : setEditMode(true))}
                >
                  {editMode ? "Save Changes" : "Edit Profile"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader title="Bio" />
              <CardContent>
                {editMode ? (
                  <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    placeholder="Your bio"
                    className="w-full"
                  />
                ) : (
                  <p>{bio}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Pet Photos" />
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {newPetPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Pet ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      {editMode && (
                        <Button
                          className="absolute top-0 right-0 bg-red-600 text-white"
                          onClick={() => handleDeletePetPhoto(photo)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <label className="w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAddPetPhoto}
                        style={{ display: 'none' }}
                      />
                      <Camera />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Reviews" />
              <CardContent>
                {/* Placeholder for reviews section */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}