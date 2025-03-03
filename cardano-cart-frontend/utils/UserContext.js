import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/_products'; // Adjust the path as necessary

// Create the User Context
export const UserContext = createContext();

// Create a UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [access_token, setAccessToken] = useState(null);

  useEffect(() => {
    // This will only run on the client side
    const data = localStorage.getItem('accessToken');
    setAccessToken(data);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (access_token) {
        try {
          // Fetch user data from the /me/ endpoint
          const userResponse = await getCurrentUser(access_token);
          //console.log(user)
          setUser(userResponse);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [access_token]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
