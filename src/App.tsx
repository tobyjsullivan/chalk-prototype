import React, { Component } from 'react';
import './App.css';

interface AppState {
  formula: string,
}

class App extends Component {
  state = {
    varName: 'var1',
    formula: 'SUM(4,6)',
  }

  handleVarNameChanged = (varName: string) => {
    this.setState({varName});
  }

  handleFormulaChanged = (formula: string) => {
    this.setState({formula});
  }

  render() {
    const {varName, formula} = this.state;

    return (
      <div className="App">
        <h1 className="App-title">Chalk</h1>
        <div className="App-console">
          <p>
            <input
              className="App-var_name_input"
              type="text"
              defaultValue={varName}
              onChange={e => this.handleVarNameChanged(e.target.value)} />
            :&nbsp;
            <input
              className="App-formula_input"
              type="text"
              defaultValue={formula}
              onChange={e => this.handleFormulaChanged(e.target.value)} />
          </p>
          <p>> error: not implemented</p>
        </div>
      </div>
    );
  }
}

export default App;
