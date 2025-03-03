// product.js
import axios from 'axios';

const BASE_URL = 'https://charming-ninnetta-knust-028ea081.koyeb.app/api/v1';
//const BASE_URL = 'http://localhost/api/v1';


// Function to get all products
export const getAllProducts = async (access_token) => {
  const endpoint = `${BASE_URL}/products/`;
  //console.log(`Bearer ${access_token}`)
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};


// function to create a new product
export const createProduct = async (productData, access_token) => {

  const endpoint = `${BASE_URL}/products/`;
  try {
    const response = await axios.post(endpoint, productData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};


// function to get user

export const getUser = async (user_id, access_token) => {
  const endpoint = `${BASE_URL}/users/${user_id}/`;
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}


// update user
export const updateUser = async (user_id, userData, access_token) => {
  const endpoint = `${BASE_URL}/users/${user_id}/`;
  try {
    const response = await axios.put(endpoint, userData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.message);
    throw error;
  }
}

// change user password
export const updateUserPassword = async (user_id, userPasswordData, access_token) => {
  const endpoint = `${BASE_URL}/users/${user_id}/`;
  try {
    const response = await axios.put(endpoint, userPasswordData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
}


// getWalletAddress from product id

export const fetchProductSeller = async (product_id, access_token) => {
  try {
    // Step 1: Fetch the product by product_id
    const paymentResponse = await axios.post(
      `${BASE_URL}/payments/get_address/${product_id}/`, 
      {}, // Empty body for POST request
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const payment = paymentResponse.data;
    //console.log('Fetched product:', payment);

    // Check if seller ID is present
    const payment_address = payment.payment_address;
    if (!payment_address) {
      throw new Error('Seller ID not found in product data.');
    }
    return payment_address;

  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};



// make an order



export const completeOrder = async (orderData, access_token) => {
  access_token = localStorage.getItem('accessToken');
  try {
    // Step 1: Send POST request to create the order
    const orderResponse = await axios.post(`${BASE_URL}/orders/`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    });

    const orderResult = orderResponse.data?.order;
    const orderId = orderResult.id;  // Assuming order ID is in the response

    if (!orderId) {
      throw new Error('Order ID is not returned from the order creation response.');
    }

    //console.log('Order created successfully with ID:', orderId);
    return orderId;  // Return the order ID

    
  } catch (error) {
    console.error('Error completing order:', error.response ? error.response.data : error.message);
    throw error;  // Rethrow the error for further handling
  }
};


export const verifyPayment = async(order_id, transaction_id, access_token) => {
  try{
    const paymentResponse = await axios.post(`${BASE_URL}/payments/verify_payment/${order_id}/`, {
      transaction_id: transaction_id,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    });

    const paymentResult = paymentResponse.data;

    //console.log('Payment verification result:', paymentResult);

    return paymentResult;  // Return the payment verification result
  }catch(error){
    console.error('Error verifying payment:', error.response ? error.response.data : error.message);
    throw error;  // Rethrow the error for further handling
  }
};


// get all orders
export const getAllOrders = async (access_token) => {
  const endpoint = `${BASE_URL}/orders/`;
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};


// get current user
export const getCurrentUser = async (access_token) => {
  const endpoint = `${BASE_URL}/users/me/`;
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
