import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Button, Message, Form, Input, Grid, TextArea } from "semantic-ui-react";
import CampaignInstance from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";

class RequestNew extends Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    message: "",
    loading: false,
  };

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      message: "",
      loading: true,
    });

    const campaign = CampaignInstance(this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          this.state.description,
          web3.utils.toWei(this.state.value, "ether"),
          this.state.recipient
        )
        .send({
          from: accounts[0],
        });

      this.setState({
        description: "",
        value: "",
        recipient: "",
        message: "",
        loading: false,
      });

      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({
        message: err.message,
        loading: false,
      });
    }
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a Request</h3>
        <Grid>
          <Grid.Column width={6}>
            <Form onSubmit={this.onSubmit} error={!!this.state.message}>
              <Form.Field>
                <label>Description</label>
                <TextArea
                  value={this.state.description}
                  onChange={(event) =>
                    this.setState({ description: event.target.value })
                  }
                  placeHolder='Description of the request'
                />
              </Form.Field>
              <Form.Field>
                <label>Value</label>
                <Input
                  label="ether"
                  labelPosition="right"
                  value={this.state.value}
                  onChange={(event) =>
                    this.setState({ value: event.target.value })
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Recipient</label>
                <Input
                  value={this.state.recipient}
                  onChange={(event) =>
                    this.setState({ recipient: event.target.value })
                  }
                />
              </Form.Field>
              <Message
                error
                header="Oops!"
                content={this.state.message}
              ></Message>
              <Button primary loading={this.state.loading}>
                Create
              </Button>
            </Form>
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default RequestNew;
