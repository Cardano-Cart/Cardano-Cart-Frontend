import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/_products'; // Adjust the path as necessary

// Create the User Context
export const UserContext = createContext();

// Create a UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        setLoading(true); // Set loading to true while fetching data
        try {
          // Fetch user data from the /me/ endpoint
          const userResponse = await getCurrentUser(accessToken);
          setUser(userResponse);  // Store user data in state
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Handle invalid or expired token case (e.g., clear the token)
          localStorage.removeItem('accessToken');
          setUser(null);
        } finally {
          setLoading(false);  // Set loading to false once the API call is finished
        }
      } else {
        setLoading(false);  // No token, stop loading
      }
    };

    fetchUserData();  // Invoke the function on mount
  }, []);  // Empty dependency array, runs only on mount

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
