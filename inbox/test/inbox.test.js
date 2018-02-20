const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

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