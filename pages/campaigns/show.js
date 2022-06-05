import React, { Component } from "react";
import { Card, Grid, GridColumn, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import CampaignInstance from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaignInstance = CampaignInstance(props.query.address);
    const summary = await campaignInstance.methods.getSummary().call();
    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requests: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  renderCards() {
    const items = [
      {
        header: this.props.manager,
        meta: "Address of the manager",
        description:
          "The manager created this campaign an can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: this.props.minimumContribution,
        meta: "Minimum contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver",
      },
      {
        header: this.props.requests,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the campaign. Requests must be approved by approvers",
      },
      {
        header: this.props.approversCount,
        meta: "Number of Approvers",
        description: "Number of people that already donated to this campaign",
      },
      {
        header: web3.utils.fromWei(this.props.balance, "ether"),
        meta: "Campaign balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend",
      },
    ];

    return <Card.Group items={items}></Card.Group>;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Link route={"/"}>
          <a>Back</a>
        </Link>
        <Grid style={{ marginTop: 10 }}>
          <Grid.Column width={10}>
            {this.renderCards()}
            <Link route={`/campaigns/${this.props.address}/requests`}>
              <a>
                <Button primary style={{ marginTop: "20px" }}>View requests</Button>
              </a>
            </Link>
          </Grid.Column>
          <GridColumn width={6}>
            <ContributeForm address={this.props.address} />
          </GridColumn>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
