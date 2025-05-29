'use client';
import React, { useContext } from 'react';
import { WalletContext } from '../_components/WalletContext';


function ConnectWallet() {
  const { isConnected, walletName, balance, connectWallet, disconnectWallet, walletAvailable } =
    useContext(WalletContext);
        
          if(isConnected) return (
            <header style={headerStyle}>
      <div style={walletInfoStyle}>
         
           <>
            <p>
              Balance: <strong>{balance ? `${balance} ADA` : 'Loading...'}</strong>
            </p>
            <button onClick={disconnectWallet} style={buttonStyle}>
              Disconnect
            </button>
          </>
       
      </div>
    </header>
          )
             if(!walletAvailable) return (
            <header style={headerStyle}>
      <div style={walletInfoStyle}>
         
           <>
           
            <button onClick={connectWallet} style={buttonStyle}>
              Install Yoroi Wallet
            </button>
          </>
       
      </div>
    </header>
          )
  return (
    <header style={headerStyle}>
      <div style={walletInfoStyle}>
         
           <>
           
            <button onClick={connectWallet} style={buttonStyle}>
              Connect Wallet
            </button>
          </>
       
      </div>
    </header>
    

  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#f8f9fa',
  borderBottom: '1px solid #ddd',
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: 0,
};

const walletInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '5px',
};

const buttonStyle = {
  padding: '5px 10px',
  fontSize: '14px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
};

export default ConnectWallet;