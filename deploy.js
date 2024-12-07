// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const Web3 = require('web3');
// const { abi, bytecode } = require('./compile');
// const provider = new HDWalletProvider(
//   'shoe spice upon reform cram trim paper frown pair divert record favorite',
//   // remember to change this to your own phrase!
//   'https://sepolia.infura.io/v3/384df1c112ba4dbcb64622b6d85f4919'
//   // remember to change this to your own endpoint!
// );
// const web3 = new Web3(provider);
// const deploy = async () => {
//   const accounts = await web3.eth.getAccounts();
//   console.log('Attempting to deploy from account', accounts[0]);
//   inbox = await new web3.eth.Contract(abi)
//     .deploy({ data: bytecode, arguments: ['Hi there!'] })
//     .send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
//   console.log('Contract deployed to', inbox.options.address);
//   provider.engine.stop();
// };
// deploy();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'shoe spice upon reform cram trim paper frown pair divert record favorite',
  // remember to change this to your own phrase!
  'https://sepolia.infura.io/v3/384df1c112ba4dbcb64622b6d85f4919'
  // remember to change this to your own endpoint!
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({
      from: accounts[0],
      gas: '4700000',
      gasPrice: web3.utils.toWei('8', 'gwei'),
    });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};

deploy();
