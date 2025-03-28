import React from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import { Box, Grid, Typography, Button, Avatar } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const reviews = [
  {
    name: "Emily Selman",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    review:
      "This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of snacks for the many long and hungry flights.",
  },
  {
    name: "Hector Gibbons",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    review:
      "Before getting the Ruck Snack, I struggled my whole life with pulverized snacks, endless crumbs, and other heartbreaking snack catastrophes. Now, I can stow my snacks with confidence and style!",
  },
  {
    name: "Mark Edwards",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    review:
      "I love how versatile this bag is. It can hold anything ranging from cookies that come in trays to cookies that come in tins.",
  },
];

const ratings = [
  { stars: 5, percentage: 63 },
  { stars: 4, percentage: 10 },
  { stars: 3, percentage: 6 },
  { stars: 2, percentage: 12 },
  { stars: 1, percentage: 9 },
];

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
    ...theme.applyStyles("dark", {
      backgroundColor: "#308fe8",
    }),
  },
}));

export default function CustomerReviews() {
  const [value, setValue] = React.useState(2);
  return (
    <Box className=" p-6 rounded-lg shadow-md">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {/* Title */}
          <Typography variant="h5" fontWeight="bold">
            Reviews Summary
          </Typography>

          {/* Star Rating Overview */}
          <Box display="flex" alignItems="center" gap={1} my={2}>
            <Rating name="read-only" value={value} readOnly />
            <Typography color="textSecondary">Based on 1624 reviews</Typography>
          </Box>

          {/* Rating Distribution */}
          {ratings.map((item) => (
            <Box key={item.stars} display="flex" alignItems="center" my={1}>
              <Typography
                sx={{ width: 20, textAlign: "center", color: "#616161" }}>
                {item.stars}
              </Typography>
              <Rating name="customized-10" defaultValue={1} max={1} readOnly />
              <BorderLinearProgress value={item.percentage} />
              <Typography sx={{ minWidth: 35, color: "#616161" }}>
                {item.percentage}%
              </Typography>
            </Box>
          ))}

          {/* Share Your Thoughts Section */}
          <Box mt={4}>
            <Typography fontWeight="bold">Share your thoughts</Typography>
            <Typography color="textSecondary">
              If you've used this product, share your thoughts with other
              customers
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>
              Write a review
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 6, maxHeight: "72vh", overflow: "auto", pr: 2 }}>
            {reviews.map((review, index) => (
              <Box
                key={index}
                sx={{ borderBottom: "1px solid #e0e0e0", pb: 4, mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={review.avatar}
                    alt={review.name}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box>
                    <Typography fontWeight="bold">{review.name}</Typography>
                    <Rating name="read-only" value={review.rating} readOnly />
                  </Box>
                </Box>
                <Typography
                  sx={{ color: "#616161", fontStyle: "italic", mt: 2 }}>
                  {review.review}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
