const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const [ abi, evm ] = require('./compile');

const provider = new HDWalletProvider(
    '', // MNEMONIC
    ''  // URL
);

const web3 = new  Web3(provider);

const deploy = async() => {
    const accounts = await web3.eth.getAccounts();
    
    console.log(`deploying from ${accounts[0]} ..... Please wait a second ...`);

    const result = await new web3.eth.Contract(abi)
        .deploy({ 
            data: evm.bytecode.object,
            arguments: [
                '0xa429E08B646AaA994e2eb0aF68C96C6A6fb16fD3',
                3000000000000000,
            ]
        })
        .send({ gas: '1000000', from: accounts[0] });

    console.log(JSON.stringify(abi));
    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
}

deploy();




console.log(evm);
