import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import CampaignInstance from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class ContributeForm extends Component {
  state = {
    value: "",
    message: "",
    loading: false,
  };

  onDonateSubmit = async (event) => {
    event.preventDefault();

    this.setState({ message: "", loading: true });

    const campaign = CampaignInstance(this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ message: err.message });
    }

    this.setState({ loading: false, value: "" });
  };

  render() {
    return (
      <Form onSubmit={this.onDonateSubmit} error={!!this.state.message}>
        <h3>Contribute to this campaign</h3>
        <Form.Field>
          <label>Ammount</label>
          <Input
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
            label="ether"
            labelPosition="right"
          />
          <Message error header="Oops!" content={this.state.message} />
          <Button style={{ marginTop: "10px" }} primary loading={this.state.loading}>
            Contribute!
          </Button>
        </Form.Field>
      </Form>
    );
  }
}

export default ContributeForm;
