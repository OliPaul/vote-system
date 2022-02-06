import React, { Component } from "react";
import Poll from "./contracts/Poll.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import Main from "./pages/main";

class App extends Component {
  state = { storageValue: null, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts)

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Poll.networks["5777"];
      const instance = new web3.eth.Contract(
          Poll.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.log(error);
    }
  };

  render() {

    const { accounts, contract, web3 } = this.state;

    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Main accounts={accounts} contract={contract} />
      </div>
    );
  }
}

export default App;
