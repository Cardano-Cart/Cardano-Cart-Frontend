"use client";
import { useState, useEffect, useCallback } from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import {
  Box,
  Grid,
  Typography,
  Button,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useRouter, usePathname } from "next/navigation";

// API base URL
const API_BASE_URL =
  "https://charming-ninnetta-knust-028ea081.koyeb.app/api/v1";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles?.("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
    ...theme.applyStyles?.("dark", {
      backgroundColor: "#308fe8",
    }),
  },
}));

export default function CustomerReviews({
  productId,
  accessToken,
  userId = 0,
}) {
  // States
  const router = useRouter();
  const pathname = usePathname();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [ratingSummary, setRatingSummary] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);

  // Review form states
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      console.log(`Fetching reviews for product ID: ${productId || "default"}`);

      // Use the external API endpoint
      const response = await fetch(
        `${API_BASE_URL}/${productId || "default"}/reviews`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch reviews: ${response.status} ${response.statusText}`
        );
      }

      // The response is now an array of reviews directly
      const reviewsData = await response.json();
      setReviews(reviewsData);

      // Calculate average rating from the reviews
      const avgRating =
        reviewsData.length > 0
          ? reviewsData.reduce((sum, review) => sum + review.rating, 0) /
            reviewsData.length
          : 0;
      setAverageRating(avgRating);

      // Calculate rating summary
      const summary = calculateRatingSummary(reviewsData);
      setRatingSummary(summary);
      setTotalReviews(reviewsData.length);

      // Clear any previous errors
      setError("");
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(`Failed to load reviews: ${err.message}`);

      // Fallback to sample data for demo purposes
      const sampleData = generateSampleData();
      setReviews(sampleData.reviews);
      setAverageRating(sampleData.averageRating);
      setRatingSummary(sampleData.ratingSummary);
      setTotalReviews(sampleData.totalReviews);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Fetch reviews when component mounts
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Add a function to calculate rating summary from reviews
  const calculateRatingSummary = (reviewsData) => {
    const totalReviews = reviewsData.length;
    if (totalReviews === 0) return [];

    const counts = [0, 0, 0, 0, 0]; // Index 0 = 1 star, index 4 = 5 stars

    reviewsData.forEach((review) => {
      const rating = Math.min(Math.max(1, review.rating), 5); // Ensure rating is between 1-5
      counts[rating - 1]++;
    });

    return counts
      .map((count, index) => {
        const stars = index + 1;
        const percentage =
          totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        return { stars, percentage, count };
      })
      .reverse(); // Return in descending order (5 stars first)
  };

  // Get authentication headers using the access token
  const getAuthHeaders = () => {
    if (!accessToken) {
      return {};
    }

    return {
      Authorization: `Bearer ${accessToken}`,
    };
  };
  // Function to refresh reviews after submission

  // Handle review form submission
  const handleSubmitReview = async () => {
    if (!newReview.comment) {
      setSnackbar({
        open: true,
        message: "Please fill in your review",
        severity: "error",
      });
      return;
    }

    // Check if access token is available
    if (!accessToken) {
      setSnackbar({
        open: true,
        message: "Authentication required. Please log in to submit a review.",
        severity: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Generate timestamp for both created_at and updated_at
      const timestamp = new Date().toISOString();

      // Create the FormData instance
      const formData = new FormData();
      formData.append("user_id", userId);

      formData.append("rating", newReview.rating);
      formData.append("comment", newReview.comment);
      formData.append("created_at", timestamp);
      formData.append("updated_at", timestamp);

      console.log("Submitting review with FormData:", formData);

      // Use the external API endpoint with authentication
      const response = await fetch(
        `${API_BASE_URL}/${productId || "default"}/reviews/`,
        {
          method: "POST",
          headers: {
            // Note: FormData automatically sets the correct 'Content-Type' header
            ...getAuthHeaders(),
          },
          body: formData,
        }
      );

      // Log the response status for debugging
      console.log("Response status:", formData);

      // Check if the response is in JSON format
      let responseBody;
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        try {
          responseBody = await response.json();
          console.log("Response body:", responseBody);
        } catch (e) {
          console.error("Error parsing response as JSON:", e);
        }
      } else {
        // If the response isn't JSON, log the raw text for debugging
        const responseText = await response.text();
        console.log("Non-JSON response:", responseText);
      }

      // Handle response based on status
      if (!response.ok) {
        throw new Error(
          `Failed to submit review: ${formData} ${response.statusText}${
            responseBody?.detail ? ` - ${responseBody.detail}` : ""
          }`
        );
      }

      // If response is JSON and submission is successful
      const result = responseBody || { ...newReview, user: userId };

      // Update reviews with the new one from the server
      setReviews([result, ...reviews]);

      // Recalculate average rating and summary
      const newAvgRating =
        (averageRating * totalReviews + result.rating) / (totalReviews + 1);
      setAverageRating(newAvgRating);

      const newSummary = calculateRatingSummary([...reviews, result]);
      setRatingSummary(newSummary);
      setTotalReviews(totalReviews + 1);

      // Close dialog and show success message
      setOpenReviewDialog(false);
      setNewReview({ rating: 5, comment: "" });
      setSnackbar({
        open: true,
        message: "Review submitted successfully!",
        severity: "success",
      });

      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to submit review. Please try again.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Generate sample data for demo purposes
  const generateSampleData = () => {
    const sampleReviews = [
      {
        user: 2,
        rating: 5,
        comment:
          "This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of snacks for the many long and hungry flights.",
        created_at: "2023-05-15T14:48:00.000Z",
        updated_at: "2023-05-15T14:48:00.000Z",
      },
      {
        user: 3,
        rating: 5,
        comment:
          "Before getting the Ruck Snack, I struggled my whole life with pulverized snacks, endless crumbs, and other heartbreaking snack catastrophes. Now, I can stow my snacks with confidence and style!",
        created_at: "2023-04-23T10:12:00.000Z",
        updated_at: "2023-04-23T10:12:00.000Z",
      },
      {
        user: 4,
        rating: 4,
        comment:
          "I love how versatile this bag is. It can hold anything ranging from cookies that come in trays to cookies that come in tins.",
        created_at: "2023-03-12T09:30:00.000Z",
        updated_at: "2023-03-12T09:30:00.000Z",
      },
    ];

    const sampleRatingSummary = [
      { stars: 5, percentage: 63, count: 1024 },
      { stars: 4, percentage: 10, count: 162 },
      { stars: 3, percentage: 6, count: 97 },
      { stars: 2, percentage: 12, count: 195 },
      { stars: 1, percentage: 9, count: 146 },
    ];

    return {
      reviews: sampleReviews,
      averageRating: 4.1,
      ratingSummary: sampleRatingSummary,
      totalReviews: 1624,
    };
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="300px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-6 rounded-lg shadow-md">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {/* Title */}
          <Typography variant="h5" fontWeight="bold">
            Reviews Summary
          </Typography>

          {/* Star Rating Overview */}
          <Box display="flex" alignItems="center" gap={1} my={2}>
            <Rating
              name="read-only"
              value={averageRating}
              precision={0.1}
              readOnly
            />
            {/* <Typography color="textSecondary">
              {averageRating.toFixed(1)} out of 5 ({totalReviews} reviews)
            </Typography> */}
            <Typography color="textSecondary">
              {averageRating === 0
                ? "No ratings yet"
                : `${averageRating.toFixed(
                    1
                  )} out of 5 (${totalReviews} reviews)`}
            </Typography>
          </Box>

          {/* Rating Distribution */}
          {ratingSummary.map((item) => (
            <Box key={item.stars} display="flex" alignItems="center" my={1}>
              <Typography
                sx={{ width: 20, textAlign: "center", color: "#616161" }}>
                {item.stars}
              </Typography>
              <Rating name="customized-10" defaultValue={1} max={1} readOnly />
              <Box sx={{ width: "100%", mx: 1 }}>
                <BorderLinearProgress
                  variant="determinate"
                  value={item.percentage}
                />
              </Box>
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
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => setOpenReviewDialog(true)}
              disabled={!accessToken}>
              Write a review
            </Button>
            {!accessToken && (
              <Typography
                color="error"
                variant="caption"
                display="block"
                sx={{ mt: 1 }}>
                Please log in to write a review
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              mt: { xs: 2, md: 6 },
              maxHeight: "72vh",
              overflow: "auto",
              pr: 2,
            }}>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <Box
                  key={`${review.user}-${index}`}
                  sx={{ borderBottom: "1px solid #e0e0e0", pb: 4, mb: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={`/images/avatar.png`}
                      alt={`User ${review.user}`}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                      <Typography fontWeight="bold">
                        User {review.user}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Rating
                          name="read-only"
                          value={review.rating}
                          readOnly
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(review.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography sx={{ color: "#616161", mt: 2 }}>
                    {review.comment}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                No reviews yet. Be the first to share your thoughts!
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Review Dialog */}
      <Dialog
        open={openReviewDialog}
        onClose={() => setOpenReviewDialog(false)}
        fullWidth
        maxWidth="sm">
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Box sx={{ my: 3 }}>
              <Typography component="legend">Your Rating</Typography>
              <Rating
                name="new-review-rating"
                value={newReview.rating}
                onChange={(_, newValue) => {
                  setNewReview({ ...newReview, rating: newValue || 5 });
                }}
                size="large"
              />
            </Box>

            <TextField
              label="Your Review"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : "Submit Review"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
