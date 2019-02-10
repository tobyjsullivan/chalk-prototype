import React, { Component } from 'react';
import axios from 'axios';
import {Map} from 'immutable';
import {Result, None} from './chalk/domain/resolver';
import FormulaWidget from './ui/FormulaWidget';

const API_URL = 'http://192.168.1.5:8080';

interface PropsType {
  formula: string,
  varName: string,
  executeFormula: (formula: string) => Promise<Result>,
}

interface StateType {
  varName: string,
  formula: string,
  result: Result,
  editing: boolean,
}

class Widget extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const {varName, formula} = props;
    this.state = {
      varName,
      formula,
      result: None,
      editing: false,
    }
  }

  componentDidMount() {
    const {varName, formula} = this.state;
    console.log('component did mount:', varName, formula);
    saveVar(varName, formula);
    this.refreshResult();
  }

  startEditing() {
    this.setState({editing: true});
  }

  stopEditing() {
    this.setState({editing: false});
    const {varName, formula} = this.state;
    console.log('stopEditing:', varName, formula);
    saveVar(varName, formula);
    this.refreshResult();
  }

  refreshResult() {
    const {executeFormula} = this.props;
    executeFormula(this.state.formula).then((result) => {
      this.setState({result});
    }).catch((e) => {
      this.setState({result: {
        resultType: 'string',
        value: `error: ${e}`,
      }});
    });
  }

  handleFormulaChanged = (formula: string) => {
    this.setState({formula: cleanFormula(formula), result: None});
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

function saveVar(key: string, formula: string): Promise<{}> {
  return axios.post(API_URL+'/variables', {
    varName: key,
    formula,
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
