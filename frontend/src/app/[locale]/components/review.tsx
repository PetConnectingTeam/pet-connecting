'use client'

import { Box, Rating, Typography, TextField, Avatar, IconButton } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import CloseIcon from '@mui/icons-material/Close'
import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import axios from "axios"

interface UserProfile {
  email: string
  id: number
  image_mimetype: string | null
  name: string
  profile_image_base64: string | null
}

const labels: { [index: number]: string } = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
}
//
const getLabelText = (value: number) => {
  return `${value} Star${value !== 6 ? 's' : ''}, ${labels[value]}`
}

export default function ReviewRating() {
  const [value, setValue] = useState<number | null>(2.5)
  const [hover, setHover] = useState(-1)
  const [review, setReview] = useState('')
  const [name, setName] = useState<string | null>(null)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get("accessToken")
      const userId = Cookies.get("user_id")

      if (!userId || !token) {
        console.error("User ID or Auth Token is not available in cookies")
        return
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/users?id=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const userData = response.data[0]
        if (response.status === 200 && userData.profile_image_base64) {
          const base64Image = `data:${userData.image_mimeType};base64,${userData.profile_image_base64}`
          setName(userData.name)
          setProfileImageUrl(base64Image)
        }
      } catch (error) {
        console.error("Error fetching user image:", error)
      }
    }

    fetchUserInfo()
  }, [])

  return (
    <Box sx={{
      maxWidth: 'md',
      mx: 'auto',
      bgcolor: 'background.paper',
      p: 4,
      borderRadius: 2,
      boxShadow: 1
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <IconButton>
          <CloseIcon />
        </IconButton>
        
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={profileImageUrl || "https://placehold.co/50x50"}
          alt="Profile picture"
          sx={{ width: 48, height: 48, mr: 2 }}
        />
        <Box>
          <Typography fontWeight={500}>{name}</Typography>
          
        </Box>
      </Box>

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 4
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2.5
        }}>
          <Rating
            name="hover-feedback"
            value={value}
            precision={0.5}
            getLabelText={getLabelText}
            onChange={(_, newValue) => setValue(newValue)}
            onChangeActive={(_, newHover) => setHover(newHover)}
            emptyIcon={<StarIcon sx={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          {value !== null && (
            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
          )}
        </Box>
      </Box>

      
    </Box>
  )
}