import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import { number } from 'prop-types';

const API_URL = 'http://localhost:8080/execute';

interface AppState {
  formula: string,
}

interface ApiResult {
  error: string,
  result?: {
    type: 'number';
    numberValue: number;
  } | {
    type: 'string',
    stringValue: string;
  },
}

function execute(formula: string): Promise<number | string> {
  return axios.post(API_URL, {
    formula,
  }).then((resp) => {
    const payload: ApiResult = resp.data;

    if (payload.error) {
      throw payload.error;
    }

    if (!payload.result) {
      throw 'expected result.';
    }

    switch (payload.result.type) {
    case 'number':
      return payload.result.numberValue;
    case 'string':
      return payload.result.stringValue;
    }
  });
}

class App extends Component {
  state = {
    varName: 'var1',
    formula: 'SUM(4,6)',
    result: 'error: not implemented',
  }

  handleVarNameChanged = (varName: string) => {
    this.setState({varName});
  }

  handleFormulaChanged = (formula: string) => {
    this.setState({formula, result: 'executing...'});

    execute(formula).then((result) => {
      this.setState({result});
    }).catch((e) => {
      this.setState({result: `error: ${e}`});
    });
  }

  render() {
    const {varName, formula, result} = this.state;

    return (
      <div className="App">
        <h1 className="App-title">Chalk</h1>
        <div className="App-console">
          <p>
            {varName}:&nbsp;
            <input
              className="App-formula_input"
              type="text"
              defaultValue={formula}
              onChange={e => this.handleFormulaChanged(e.target.value)} />
          </p>
          <p>&gt; {result}</p>
        </div>
      </div>
    );
  }
}

export default App;
