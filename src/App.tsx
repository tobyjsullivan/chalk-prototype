import React, { Component } from 'react';
import Widget from './Widget';
import {List, Map} from 'immutable';

import './App.css';

const DEFAULT_FORMULA = 'SUM(1, 2, 3)';

interface AppState {
  variables: List<Variable>;
  nextVarNum: number;
}

interface Variable {
  varName: string;
  formula: string;
}

class App extends Component<{}, AppState> {
  state = {
    variables: List(),
    nextVarNum: 1,
  }

  onAdd() {
    console.log('onAdd() executing...');
    this.setState((prev) => {
      const varName = `var${prev.nextVarNum}`;
      const newVar = {varName, formula: DEFAULT_FORMULA};

      return {
        variables: prev.variables.insert(0, newVar),
        nextVarNum: prev.nextVarNum + 1,
      };
    });
  }

  render() {
    const {variables} = this.state;

    const widgets = variables.map((v) => (
      <Widget
        key={v.varName}
        varName={v.varName}
        formula={v.formula} />
    )).toArray();
    console.log('Widgets: %o', widgets);

    return (
      <div className="App">
        <h1 className="App-title">Chalk</h1>
        <a onClick={() => this.onAdd()} href="#">Add +</a>
        {widgets}
      </div>
    );
  }
}

export default App;
