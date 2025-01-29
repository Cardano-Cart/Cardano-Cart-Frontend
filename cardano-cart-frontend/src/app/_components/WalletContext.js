// 'use client';
// import React, { createContext, useState, useEffect } from 'react';
// import { BrowserWallet } from '@meshsdk/core';

// export const WalletContext = createContext();

// export const WalletProvider = ({ children }) => {
//   const [walletName, setWalletName] = useState('');
//   const [wallet, setWallet] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [balance, setBalance] = useState(null);

//   useEffect(() => {
//     const savedWalletName = localStorage.getItem('walletName');
//     const savedBalance = localStorage.getItem('balance');
//     const savedIsConnected = localStorage.getItem('isConnected') === 'true';

//     if (savedIsConnected && savedWalletName) {
//       setWalletName(savedWalletName);
//       setBalance(savedBalance);
//       setIsConnected(true);

      
//       const walletInstance = BrowserWallet.enable('yoroi');
//       setWallet(walletInstance);
//     }
//   }, []);

//   const connectWallet = async () => {
//     try {
//       const walletInstance = await BrowserWallet.enable('yoroi');
//       const walletBalance = await walletInstance.getBalance();

//       setWalletName('Yoroi');
//       setWallet(walletInstance);
//       setIsConnected(true);

//       if (walletBalance && walletBalance.length > 0) {
//         const lovelace = walletBalance[0].quantity;
//         const ada = parseInt(lovelace) / 1000000;
//         setBalance(ada.toFixed(2));

       
//         localStorage.setItem('walletName', 'Yoroi');
//         localStorage.setItem('balance', ada.toFixed(2));
//         localStorage.setItem('isConnected', true);
//       }
//     } catch (error) {
//       console.error('Error connecting to wallet:', error);
//     }
//   };

//   const disconnectWallet = () => {
//     setWalletName('');
//     setWallet(null);
//     setIsConnected(false);
//     setBalance(null);


//     localStorage.removeItem('walletName');
//     localStorage.removeItem('balance');
//     localStorage.removeItem('isConnected');
//   };

//   return (
//     <WalletContext.Provider
//       value={{
//         walletName,
//         wallet,
//         isConnected,
//         balance,
//         connectWallet,
//         disconnectWallet,
//       }}
//     >
//       {children}
//     </WalletContext.Provider>
//   );
// };


'use client';
import React, { createContext, useState, useEffect } from 'react';
import { BrowserWallet } from '@meshsdk/core';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletName, setWalletName] = useState('');
  const [wallet, setWallet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const initializeWallet = async () => {
      const savedWalletName = localStorage.getItem('walletName');
      const savedBalance = localStorage.getItem('balance');
      const savedIsConnected = localStorage.getItem('isConnected') === 'true';

      if (savedIsConnected && savedWalletName) {
        try {
          const walletInstance = await BrowserWallet.enable('yoroi');
          const walletBalance = await walletInstance.getBalance();

          if (walletBalance && walletBalance.length > 0) {
            const lovelace = walletBalance[0].quantity;
            const ada = parseInt(lovelace) / 1000000;
            setBalance(ada.toFixed(2));
          } else {
            setBalance('0.00');
          }

          setWalletName(savedWalletName);
          setWallet(walletInstance);
          setIsConnected(true);
        } catch (error) {
          console.error('Error restoring wallet connection:', error);
          disconnectWallet();
        }
      }
    };

    initializeWallet();
  }, []);

  const connectWallet = async () => {
    try {
      const walletInstance = await BrowserWallet.enable('yoroi');
      const walletBalance = await walletInstance.getBalance();

      setWalletName('Yoroi');
      setWallet(walletInstance);
      setIsConnected(true);

      if (walletBalance && walletBalance.length > 0) {
        const lovelace = walletBalance[0].quantity;
        const ada = parseInt(lovelace) / 1000000;
        setBalance(ada.toFixed(2));

        localStorage.setItem('walletName', 'Yoroi');
        localStorage.setItem('balance', ada.toFixed(2));
        localStorage.setItem('isConnected', 'true');
      } else {
        setBalance('0.00');
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setWalletName('');
    setWallet(null);
    setIsConnected(false);
    setBalance(null);

    localStorage.removeItem('walletName');
    localStorage.removeItem('balance');
    localStorage.removeItem('isConnected');
  };

  return (
    <WalletContext.Provider
      value={{
        walletName,
        wallet,
        isConnected,
        balance,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
