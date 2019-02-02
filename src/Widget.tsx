import React, { Component } from 'react';
import axios from 'axios';
import enhanceWithClickOutside from 'react-click-outside';
import {Map} from 'immutable';

import './Widget.css';

const API_URL = 'http://192.168.1.5:8080';

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
    saveVar(this.state.varName, this.state.formula);
    this.refreshResult();
  }

  handleVarNameChanged = (varName: string) => {
    this.setState({varName});
  }

  startEditing() {
    this.setState({editing: true}, () => this.input ? this.input.focus() : {});
  }

  stopEditing() {
    this.setState({editing: false});
    saveVar(this.state.varName, this.state.formula);
    this.refreshResult();
  }

  refreshResult() {
    execute(this.state.formula).then((result) => {
      this.setState({result});
    }).catch((e) => {
      this.setState({result: `error: ${e}`});
    });
  }

  handleFormulaInputKeyDown = (e: React.KeyboardEvent) => {
    // 13 => Enter
    // 27 => Escape
    if (e.keyCode == 13 || e.keyCode == 27) {
      e.preventDefault();
      this.stopEditing();
    }
  }

  handleFormulaInputBlur = this.stopEditing;

  handleFormulaChanged = (formula: string) => {
    this.setState({formula: cleanFormula(formula), result: null});
  }

  handleResultWindowClicked = () => {
    this.startEditing();
  }

  handleClickOutside() {
    if (this.state.editing) {
      this.stopEditing();
    }
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
            onBlur={this.handleFormulaInputBlur.bind(this)}
            onKeyDown={this.handleFormulaInputKeyDown.bind(this)}
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

function saveVar(key: string, formula: string): Promise<{}> {
  return axios.post(API_URL+'/variables', {
    varName: key,
    formula,
  });
}

function execute(formula: string): Promise<number | string | null> {
  return axios.post(API_URL+'/execute', {
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

const CHAR_REPLACEMENTS = Map({
  '“': '"',
  '”': '"',
});

function cleanFormula(formula: string): string {
  return CHAR_REPLACEMENTS.reduce((f, replacement, needle) => f.replace(needle, replacement), formula);
}

export default enhanceWithClickOutside(Widget);
