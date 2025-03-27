import { Box, Typography, Button, LinearProgress, Avatar } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";

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

export default function CustomerReviews() {
  return (
    <Box className=" p-6 rounded-lg shadow-md">
      <Typography variant="h6" fontWeight="bold">
        Customer Reviews
      </Typography>

      {/* Star Rating Overview */}
      <Box className="flex items-center gap-1 my-2">
        {Array(4)
          .fill()
          .map((_, i) => (
            <Star key={i} className="text-yellow-500" />
          ))}
        <StarBorder className="text-yellow-500" />
        <Typography className="text-gray-600 ml-2">
          Based on 1624 reviews
        </Typography>
      </Box>

      {/* Rating Distribution */}
      {ratings.map((item) => (
        <Box key={item.stars} className="flex items-center gap-2 my-1">
          <Typography className="w-4 text-gray-600">{item.stars}</Typography>
          <Star className="text-yellow-500" fontSize="small" />
          <LinearProgress
            variant="determinate"
            value={item.percentage}
            className="w-full"
          />
          <Typography className="text-gray-600">{item.percentage}%</Typography>
        </Box>
      ))}

      {/* Share Your Thoughts */}
      <Box className="mt-4">
        <Typography fontWeight="bold">Share your thoughts</Typography>
        <Typography className="text-gray-600">
          If you've used this product, share your thoughts with other customers
        </Typography>
        <Button variant="outlined" className="mt-2">
          Write a review
        </Button>
      </Box>

      {/* Customer Reviews List */}
      <Box className="mt-6 max-h-72 overflow-auto pr-2">
        {reviews.map((review, index) => (
          <Box key={index} className="border-b pb-4 mb-4">
            <Box className="flex items-center gap-3">
              <Avatar src={review.avatar} alt={review.name} />
              <Box>
                <Typography fontWeight="bold">{review.name}</Typography>
                <Box className="flex">
                  {Array(review.rating)
                    .fill()
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="text-yellow-500"
                        fontSize="small"
                      />
                    ))}
                  {Array(5 - review.rating)
                    .fill()
                    .map((_, i) => (
                      <StarBorder
                        key={i}
                        className="text-yellow-500"
                        fontSize="small"
                      />
                    ))}
                </Box>
              </Box>
            </Box>
            <Typography className="text-gray-600 italic mt-2">
              {review.review}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
