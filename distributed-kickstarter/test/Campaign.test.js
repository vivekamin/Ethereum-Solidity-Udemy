const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas:'1000000' });

    await factory.methods.createCampaign('100').send({
         from: accounts[0],
         gas: '1000000'
        });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );

});


describe('Campaigns',() => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('manager is ok', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);        
    });

    it('allows people to be contributor and approvers', async() => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        })

        const isContributor = await campaign.methods.approvers(accounts[1]).call();

        assert(isContributor);

    });

    it('requires a minimum contribution', async () => {

        try{
            await campaign.methods.contribute().send({
                value:'5',
                from: accounts[1]
            });
            assert(false);

        } catch(err){
            assert(true);

        }

    });

    it('allows to make a request', async () => {
        await campaign.methods
            .createRequest('but anything', '100', accounts[1])
            .send({ from: accounts[0], gas: '1000000'});

        const request = await campaign.methods.requests(0).call();
        assert.equal(accounts[1], request.recipient);
    });

    
});

