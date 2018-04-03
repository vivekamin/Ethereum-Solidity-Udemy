import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import web3 from './web3';
import lottery from './lottery'

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message:''

  };

  async componentDidMount(){
    //debugger;
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
    
    console.log(manager,players);
  }

  onSubmit = async (event) => {
    event.preventDefault();
    
    const accounts = await web3.eth.getAccounts();
     
    this.setState({ message: 'Waiting on trasaction to process...'})
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
    });

    this.setState({ message: 'You have been entered!' })
    //this.componentDidMount();
  }

  onClick = async (event) => {
    const accounts = await web3.eth.getAccounts();
    
    this.setState({ message: 'Waiting on trasaction to process...'})
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' })


  };

  render() {
    return (
     <div>
       <h2> Lottery Contract </h2>
       <p>
         The Contract is manager by {this.state.manager}.
         There are total {this.state.players.length} participants to win {web3.utils.fromWei(this.state.balance,'ether')} ether.
       </p>
       <hr />
       <form  onSubmit={this.onSubmit}>
         <h4>Try your luck!</h4>
         <label>Amount of ether to enter </label>
         <input 
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
         />
         <button> Enter </button>

       </form>

       <hr />
       <h4>Ready topick a winner?</h4>
       <button onClick={this.onClick}>Pick a winner</button>
       <hr />
       <h1>{this.state.message}</h1>
       <hr />

     </div>
    );
  }
}

export default App;
