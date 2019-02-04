import React, { Component } from 'react';
import axios from 'axios';
import {Map} from 'immutable';
import FormulaWidget from './ui/FormulaWidget';

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

  componentDidMount() {
    saveVar(this.state.varName, this.state.formula);
    this.refreshResult();
  }

  startEditing() {
    this.setState({editing: true});
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

  handleFormulaChanged = (formula: string) => {
    this.setState({formula: cleanFormula(formula), result: null});
  }

  handleResultWindowClicked = () => {
    this.startEditing();
  }

  render() {
    const {editing, varName, formula, result} = this.state;

    return (
      <FormulaWidget
        editing={editing}
        varName={varName}
        formula={formula}
        result={result}
        onEditStartAction={() => this.startEditing()}
        onEditEndAction={() => this.stopEditing()}
        onFormulaChange={(formula) => this.handleFormulaChanged(formula)} />
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

export default Widget;
