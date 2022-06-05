import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xAc27d5803d6CbDEc2CC9f1d1bA9C63D9014b3F82'
);

export default instance;
