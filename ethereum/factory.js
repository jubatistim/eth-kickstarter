import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xeFF928535D20d0D33E3F83D8A5b706b8D3b63439'
);

export default instance;
