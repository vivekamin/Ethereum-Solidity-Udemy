const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider('amazing throw sleep peasant grief betray retire video system hole tell demise',
'https://rinkeby.infura.io/uuVjwXb02VCrn9YOX8XH '
);


const web3 = new Web3(provider);

const deploy = async () => {

    const accounts = await web3.eth.getAccounts();
    console.log("Deploy on", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({gas: 1000000, from: accounts[0]});

    console.log('Contracts deployed on', result.options.address);

};
 
deploy();





