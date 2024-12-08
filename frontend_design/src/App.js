import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { TicketSale_ABI, TicketSale_address } from './TicketSale';
import './App.css';

function App() {
  const [ticketId, setTicketId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [notification, setNotification] = useState('');
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      // Create Web3 instance
      const web3 = new Web3(window.ethereum);

      // Enable MetaMask accounts
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          setAccount(accounts[0]);
          // Initialize contract
          const ticketSaleContract = new web3.eth.Contract(
            TicketSale_ABI, // Contract ABI from TicketSale.js
            TicketSale_address // Contract address from TicketSale.js
          );
          setContract(ticketSaleContract);
        })
        .catch((error) => {
          console.error(error);
          setNotification('Error connecting to MetaMask.');
        });
    } else {
      setNotification('Please install MetaMask to interact with the contract.');
    }
  }, []);

  const [loading, setLoading] = useState(false);

  const handlePurchaseTicket = async () => {
    if (contract && account && ticketId) {
      try {
        // Validate ticketId
        if (isNaN(ticketId) || ticketId <= 0) {
          setNotification('Invalid Ticket ID');
          return;
        }

        // Estimate gas for the transaction
        const gasEstimate = await contract.methods
          .buyTicket(ticketId)
          .estimateGas({ from: account });

        // Send the transaction with gas estimation and added buffer
        await contract.methods.buyTicket(ticketId).send({
          from: account,
          gas: gasEstimate + 10000, // Adding buffer to the gas estimate
        });

        // Success message
        setNotification(`Ticket ${ticketId} purchased successfully!`);
      } catch (error) {
        setNotification('Error purchasing ticket: ' + error.message);
      }
      setLoading(false);
    } else {
      setNotification('Please connect wallet and provide a valid Ticket ID.');
    }
  };
  // Function to handle offer swap
  const handleOfferSwap = async () => {
    if (contract && account && ticketId) {
      try {
        // Call the offerSwap method on the contract
        await contract.methods.offerSwap(ticketId).send({ from: account });
        setNotification(`Offer to swap ticket ${ticketId} is pending.`);
      } catch (error) {
        setNotification('Error making offer swap: ' + error.message);
      }
    } else {
      setNotification('Please connect wallet and provide a valid Ticket ID.');
    }
  };

  // Function to handle accepting an offer
  const handleAcceptOffer = async () => {
    if (contract && account && ticketId) {
      try {
        // Call the acceptSwap method on the contract
        await contract.methods.acceptSwap(ticketId).send({ from: account });
        setNotification(`Swap offer for ticket ${ticketId} has been accepted.`);
      } catch (error) {
        setNotification('Error accepting offer: ' + error.message);
      }
    } else {
      setNotification('Please connect wallet and provide a valid Ticket ID.');
    }
  };

  // Function to retrieve ticket number using wallet address
  const handleGetTicketNumber = async () => {
    if (contract && walletAddress) {
      try {
        // Call the getTicketOf method on the contract
        const ticket = await contract.methods.getTicketOf(walletAddress).call();
        setTicketId(ticket);
        setNotification(`Your ticket ID is: ${ticket}`);
      } catch (error) {
        setNotification('Error fetching ticket ID: ' + error.message);
      }
    } else {
      setNotification('Please provide a valid wallet address.');
    }
  };

  // Handle ticket return
  const handleReturnTicket = async () => {
    if (ticketId && contract && account) {
      try {
        // Call the returnTicket method on the contract
        await contract.methods.returnTicket(ticketId).send({ from: account });
        const serviceFee = 5; // Example fee
        const refundAmount = 100 - serviceFee; // Example refund calculation
        setNotification(`Ticket returned. Refund amount: $${refundAmount}`);
      } catch (error) {
        setNotification('Error returning ticket: ' + error.message);
      }
    } else {
      setNotification('No ticket to return.');
    }
  };

  return (
    <div className="App">
      <div className="box-container">
        <div className="box">
          <h2>Purchase Ticket</h2>
          <input
            type="text"
            placeholder="Enter Ticket ID"
            onChange={(e) => setTicketId(e.target.value)}
          />
          <button onClick={handlePurchaseTicket}>Purchase</button>
        </div>

        <div className="box">
          <h2>Offer Swap</h2>
          <input
            type="text"
            placeholder="Enter Ticket ID to Swap"
            onChange={(e) => setTicketId(e.target.value)}
          />
          <button onClick={handleOfferSwap}>Offer Swap</button>
        </div>

        <div className="box">
          <h2>Accept Offer</h2>
          <input
            type="text"
            placeholder="Enter Ticket ID or Address"
            onChange={(e) => setTicketId(e.target.value)}
          />
          <button onClick={handleAcceptOffer}>Accept Offer</button>
        </div>

        <div className="box">
          <h2>Get Ticket Number</h2>
          <input
            type="text"
            placeholder="Enter Wallet Address"
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <button onClick={handleGetTicketNumber}>Get Ticket</button>
        </div>

        <div className="box">
          <h2>Return Ticket</h2>
          <button onClick={handleReturnTicket}>Return Ticket</button>
        </div>
      </div>

      {notification && <p>{notification}</p>}
    </div>
  );
}

export default App;
