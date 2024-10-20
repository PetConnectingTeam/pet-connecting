import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Stack,
  IconButton,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

interface TweetBoxProps {
  profilePicture: string;
}

const TweetBox: React.FC<TweetBoxProps> = ({ profilePicture }): JSX.Element => {
  const [tweetContent, setTweetContent] = useState("");

  const handleTweetSubmit = () => {
    setTweetContent("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar src={profilePicture} />
        <TextField
          variant="outlined"
          placeholder="What’s new with your pet?"
          multiline
          fullWidth
          value={tweetContent}
          onChange={(e) => setTweetContent(e.target.value)}
          inputProps={{ maxLength: 280 }}
          sx={{ backgroundColor: "white" }}
        />
      </Box>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        alignItems="center"
      >
        <IconButton>
          <AddPhotoAlternateOutlinedIcon />
        </IconButton>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#ff4d4f",
            color: "white",
            "&:hover": {
              backgroundColor: "#ff7875",
            },
          }}
          onClick={handleTweetSubmit}
          disabled={tweetContent.length === 0}
        >
          Share
        </Button>
      </Stack>
    </Box>
  );
};

export default TweetBox;