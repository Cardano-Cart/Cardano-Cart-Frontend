export const formatDate = (dateString) => {
    // Convert the date string to a Date object
    const date = new Date(dateString);
    
    // Define options to get the abbreviated month
    const options = {
      year: 'numeric',
      month: 'short', // Use 'short' for abbreviated month name (3 letters)
      day: 'numeric',
    };
  
    // Format the date to a user-friendly string (date only)
    const formattedDate = date.toLocaleDateString('en-US', options); // Change 'en-US' to your desired locale
  
    return formattedDate; // e.g., "Oct 10, 2024"
  };