import React, { Component } from "react";
import { Button, Message, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import CampaignInstance from "../ethereum/campaign";
import {Router} from "../routes";

class RequestRow extends Component {
  state = {
    loadingApprove: false,
    loadingFinalize: false,
  };

  onApprove = async () => {
    this.setState({ loadingApprove: true });

    const campaign = CampaignInstance(this.props.address);

    const accounts = await web3.eth.getAccounts();

    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0],
    });

    this.setState({ loadingApprove: false });

    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  onFinalize = async () => {
    this.setState({ loadingFinalize: true });
    const campaign = CampaignInstance(this.props.address);

    const accounts = await web3.eth.getAccounts();

    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0],
    });
    this.setState({ loadingFinalize: false });

    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.loadingApprove}
              color="green"
              basic
              onClick={this.onApprove}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.loadingFinalize}
              color="teal"
              basic
              onClick={this.onFinalize}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
