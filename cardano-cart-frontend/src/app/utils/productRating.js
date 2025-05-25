const API_BASE_URL = "https://charming-ninnetta-knust-028ea081.koyeb.app/api/v1"; 

export const productRating = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${productId || "default"}/reviews`);
    if (!response.ok) throw new Error(`Failed to fetch reviews: ${response.status}`);

    const reviewsData = await response.json();

    const averagRating =
      reviewsData.length > 0
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length
        : 0;

    return {
      averageRating: Number(averagRating.toFixed(1)),
    };
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return {
      averageRating: 0,
      error: err.message,
    };
  }
};
