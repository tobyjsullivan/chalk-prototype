import React, { Component } from 'react';
import axios from 'axios';
import enhanceWithClickOutside from 'react-click-outside';

import './Widget.css';

const API_URL = 'http://localhost:8080/execute';

interface PropsType {
  formula: string,
  varName: string,
}

interface StateType {
  varName: string,
  formula: string,
  result: string | number | null,
  editing: boolean,
}

class Widget extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const {varName, formula} = props;
    this.state = {
      varName,
      formula,
      result: null,
      editing: false,
    }
  }

  input: HTMLInputElement | null = null;

  componentDidMount() {
    this.handleFormulaChanged(this.state.formula);
  }

  handleVarNameChanged = (varName: string) => {
    this.setState({varName});
  }

  startEditing() {
    this.setState({editing: true}, () => this.input ? this.input.focus() : {});
  }

  stopEditing() {
    this.setState({editing: false});
  }

  handleFormulaInputKeyDown = (keyCode: number) => {
    // 13 => Enter
    // 27 => Escape
    if (keyCode == 13 || keyCode == 27) {
      this.stopEditing();
    }
  }

  handleFormulaChanged = (formula: string) => {
    this.setState({formula, result: null});

    execute(formula).then((result) => {
      this.setState({result});
    }).catch((e) => {
      this.setState({result: `error: ${e}`});
    });
  }

  handleResultWindowClicked = () => {
    this.startEditing();
  }

  handleClickOutside() {
    this.stopEditing();
  }

  render() {
    const {editing, varName, formula, result} = this.state;

    const widgetClass = `Widget ${editing ? 'Widget--editing' : ''}`;

    return (
      <div className={widgetClass}>
        <div className="Widget-var_name">
          {varName}
        </div>
        <div className="Widget-formula_window">
          <input
            ref={(input) => {this.input = input}}
            className="Widget-formula_input"
            type="text"
            defaultValue={formula}
            onKeyDown={e => this.handleFormulaInputKeyDown(e.keyCode)}
            onChange={e => this.handleFormulaChanged(e.target.value)} />
        </div>
        <div className="Widget-result_window" onClick={this.handleResultWindowClicked}>
          {result || ''}
        </div>
      </div>
    );
  }
}

interface ApiResult {
  error?: string,
  result?: {
    type: 'number';
    numberValue: number;
  } | {
    type: 'string',
    stringValue: string;
  },
}

function execute(formula: string): Promise<number | string | null> {
  return axios.post(API_URL, {
    formula,
  }).then((resp) => {
    const payload: ApiResult = resp.data;

    if (payload.error) {
      throw payload.error;
    }

    if (!payload.result) {
      // Empty result
      return null;
    }

    switch (payload.result.type) {
    case 'number':
      return payload.result.numberValue;
    case 'string':
      return payload.result.stringValue;
    }
  });
}

export default enhanceWithClickOutside(Widget);
