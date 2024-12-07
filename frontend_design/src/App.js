import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
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
        })
        .catch((error) => {
          console.error(error);
          setNotification('Error connecting to MetaMask.');
        });

      // Get contract ABI and address from compiled contract
      const contractABI = [
        // Add your contract ABI here (unchanged from your code)
      ];
      const contractAddress = '0x806c6a130BD1B47a0Cd82366b532B6C1eD38Fa55'; // Replace with actual address

      // Initialize contract
      const ticketSaleContract = new web3.eth.Contract(
        contractABI,
        contractAddress
      );
      setContract(ticketSaleContract);
    } else {
      setNotification('Please install MetaMask to interact with the contract.');
    }
  }, []);

  // Function to handle purchasing a ticket
  const handlePurchaseTicket = async (id) => {
    if (contract && account) {
      try {
        // Assuming the purchase function is called purchaseTicket in the contract
        await contract.methods.buyTicket(id).send({ from: account });
        setNotification(`Ticket ${id} purchased successfully!`);
      } catch (error) {
        setNotification('Error purchasing ticket: ' + error.message);
      }
    }
  };

  // Function to handle offer swap
  const handleOfferSwap = async (id) => {
    if (contract && account) {
      try {
        // Assuming offerSwap function in contract
        await contract.methods.offerSwap(id).send({ from: account });
        setNotification(`Offer to swap ticket ${id} is pending.`);
      } catch (error) {
        setNotification('Error making offer swap: ' + error.message);
      }
    }
  };

  // Function to handle accepting an offer
  const handleAcceptOffer = async (id) => {
    if (contract && account) {
      try {
        // Assuming acceptOffer function in contract
        await contract.methods.acceptSwap(id).send({ from: account });
        setNotification(`Swap offer for ticket ${id} has been accepted.`);
      } catch (error) {
        setNotification('Error accepting offer: ' + error.message);
      }
    }
  };

  // Function to retrieve ticket number using wallet address
  const handleGetTicketNumber = async (address) => {
    if (contract) {
      try {
        // Assuming getTicketNumber function in contract
        const ticketId = await contract.methods.getTicketOf(address).call();
        setTicketId(ticketId);
        setNotification(`Your ticket ID is: ${ticketId}`);
      } catch (error) {
        setNotification('Error fetching ticket ID: ' + error.message);
      }
    }
  };

  // Handle ticket return
  const handleReturnTicket = async () => {
    if (ticketId && contract && account) {
      try {
        // Assuming returnTicket function in contract
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
          <button onClick={() => handlePurchaseTicket(ticketId)}>
            Purchase
          </button>
        </div>

        <div className="box">
          <h2>Offer Swap</h2>
          <input
            type="text"
            placeholder="Enter Ticket ID to Swap"
            onChange={(e) => setTicketId(e.target.value)}
          />
          <button onClick={() => handleOfferSwap(ticketId)}>Offer Swap</button>
        </div>

        <div className="box">
          <h2>Accept Offer</h2>
          <input
            type="text"
            placeholder="Enter Ticket ID or Address"
            onChange={(e) => setTicketId(e.target.value)}
          />
          <button onClick={() => handleAcceptOffer(ticketId)}>
            Accept Offer
          </button>
        </div>

        <div className="box">
          <h2>Get Ticket Number</h2>
          <input
            type="text"
            placeholder="Enter Wallet Address"
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <button onClick={() => handleGetTicketNumber(walletAddress)}>
            Get Ticket
          </button>
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
