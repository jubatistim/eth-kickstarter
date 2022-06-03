const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require ('web3');
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
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'});
    
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

describe('Campaigns', () => {
    it('deploys a factory campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });

    it('allows people to contribute money and mark them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isApprover = await campaign.methods.approvers(accounts[1]).call();
        assert(isApprover);
    });

    it('reject contribution less than minimum', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '99',
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert.ok(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        const req_description = 'buy LUNA token';
        await campaign.methods
            .createRequest(req_description,'100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        const request = await campaign.methods.requests(0).call();
        assert.equal(req_description, request.description);
    });

    it('processes request', async () => {
        await campaign.methods.contribute().send({
            from: accounts[2],
            value: web3.utils.toWei('10', 'ether')
        });
        
        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[3])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        
        await campaign.methods.approveRequest(0).send({
            from: accounts[2],
            gas: '1000000'
        });

        let balance_before = await web3.eth.getBalance(accounts[3]);
        balance_before = web3.utils.fromWei(balance_before, 'ether');
        balance_before = parseFloat(balance_before);
        
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance_after = await web3.eth.getBalance(accounts[3]);
        balance_after = web3.utils.fromWei(balance_after, 'ether');
        balance_after = parseFloat(balance_after);

        assert.equal(balance_after - balance_before, 5);
    });
});