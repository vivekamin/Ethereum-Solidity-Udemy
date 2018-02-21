const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile')


let accounts; 
let inbox;

beforeEach( async () => {
    /* --using promise--
    web3.eth.getAccounts()
        .then( fetchAccounts => {
            console.log(fetchAccounts);      
        });
    */
    accounts = await web3.eth.getAccounts();

    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi contract']})
        .send({ from: accounts[0], gas : '1000000'});

    inbox.setProvider(provider);
});

describe('Inbox contract', () => {

    it('deploys a contract', () =>{
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi contract');
        
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('trasaction').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'trasaction');
    });
});








































/*

Mocha Test Sample

class Car{

    park(){
        return 'stopped';
    }

    drive(){
        return 'vroom';
    }
}

let car;

beforeEach(() => {
     car = new Car();
});

describe('class Car', ()=>{
    it('Park Fn', () => {
        assert.equal(car.park(),'stopped')
    });

    it('Drive fn', () => {
        assert.equal(car.drive(),'vroom');
    });

});
*/