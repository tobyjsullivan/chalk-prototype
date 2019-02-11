import React, { Component } from 'react';
import axios from 'axios';
import {Map} from 'immutable';
import {Result, None} from './chalk/domain/resolver';
import FormulaWidget from './ui/FormulaWidget';

const API_URL = 'http://192.168.1.5:8080';

interface PropsType {
  formula: string,
  varName: string,
  onVarChange: (formula: string) => any,
  executeFormula: (formula: string) => Promise<Result>,
}

interface StateType {
  varName: string,
  formula: string,
  result: Result,
  editing: boolean,
}

class Widget extends Component<PropsType, StateType> {
  unmounted: boolean;

  constructor(props: PropsType) {
    super(props);
    const {varName, formula} = props;
    this.state = {
      varName,
      formula,
      result: None,
      editing: false,
    }
    this.unmounted = false;
  }

  componentDidMount() {
    console.log('Refreshing b/c component did mount for', this.props.varName);
    this.refreshResult();
  }

  componentDidUpdate(prevProps: PropsType) {
    if (prevProps.formula === this.props.formula) {
      return
    }

    console.log('Refreshing b/c formula changed from', prevProps.formula, 'to', this.props.formula);

    this.refreshResult();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  startEditing() {
    this.setState({editing: true});
  }

  stopEditing() {
    const {formula: originalFormula, onVarChange} = this.props;
    const {formula: newFormula} = this.state;

    this.setState({editing: false});

    if (newFormula !== originalFormula) {
      onVarChange(newFormula);
    } else {
      this.refreshResult();
    }
  }

  refreshResult() {
    const {executeFormula} = this.props;
    const {formula} = this.state;
    executeFormula(formula).then((result) => {
      console.log("Execution complete:", formula, "=>", result);
      if (this.unmounted) {
        console.log('Widget already unmounted.');
        return;
      }
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

const CHAR_REPLACEMENTS = Map({
  '“': '"',
  '”': '"',
});

function cleanFormula(formula: string): string {
  return CHAR_REPLACEMENTS.reduce((f, replacement, needle) => f.replace(needle, replacement), formula);
}

export default Widget;
