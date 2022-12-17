const solc = require('solc');
const fs = require('fs');
const path = require('path');

const filepath = path.resolve(__dirname, 'contracts', 'buyTickets.sol');
const source = fs.readFileSync(filepath, 'utf-8');

var input = {
  language: 'Solidity',
  sources: {
    'buyTickets.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));

const evm = output.contracts['buyTickets.sol']['Register'].evm;
const abi = output.contracts['buyTickets.sol']['Register'].abi;

module.exports = [abi, evm];


// `output` here contains the JSON output as specified in the documentation
// for (var contractName in output.contracts['contract.sol']) {
//   console.log(
//     contractName +
//       ': ' +
//       output.contracts['contract.sol'][contractName].evm.bytecode.object
//   );
// }