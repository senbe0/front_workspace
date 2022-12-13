import web3 from 'web3'
// may need a window.ethereum
ethereum.request({ method: 'eth_requestAccounts' });
const web3 = new Web3(window.ethereum);

export default web3;
