import React, {Component} from 'react';
import enhanceWithClickOutside from 'react-click-outside';

import {Result} from '../chalk/domain/resolver';
import ResultDisplay from './ResultDisplay';
import './FormulaWidget.css';

interface PropsType {
  varName: string;
  formula: string;
  result: Result;
  onFormulaChange: (formula: string) => Promise<any>;
}

interface StateType {
  editing: boolean;
  disabled: boolean;
  currentValue: string;
}

function isEndAction(e: React.KeyboardEvent) {
  // 13 => Enter
  // 27 => Escape
  if (e.keyCode == 13 || e.keyCode == 27) {
    e.preventDefault();
    return true;
  }
}

// Not a static component to allow the input focus and click-outside.
class FormulaWidget extends Component<PropsType, StateType> {
  input: HTMLInputElement | null = null;
  state = {
    editing: false,
    disabled: false,
    currentValue: this.props.formula,
  }

  componentDidMount() {
    this.focus()
  }

  componentDidUpdate() {
    this.focus()
  }

  focus() {
    this.input && this.state.editing ? this.input.focus() : {}
  }

  handleClickOutside() {
    const {editing} = this.state;

    if (editing) {
      this.endEditing();
    }
  }

  handleInputChanged(formula: string) {
    this.setState({currentValue: formula});
  }

  startEditing() {
    this.setState({editing: true}, () => {
      this.focus();
    });
  }

  endEditing() {
    const {onFormulaChange} = this.props;
    const {editing, currentValue} = this.state;

    if (editing) {
      this.setState({disabled: true});
      onFormulaChange(currentValue).then(() => {
        this.setState({editing: false, disabled: false});
      });
    }
  }

  render() {
    const {varName, formula, result} = this.props;
    const {editing, disabled} = this.state;
    let display = (
      <div className="Widget-result_window" onClick={() => this.startEditing()}>
        <ResultDisplay result={result} />
      </div>
    );
    if (editing) {
      display = (
        <div className="Widget-formula_window">
          <input
            ref={(input) => {this.input = input}}
            className="Widget-formula_input"
            type="text"
            defaultValue={formula}
            disabled={disabled}
            onBlur={() => this.endEditing()}
            onKeyDown={e => isEndAction(e) ? this.endEditing() : {}}
            onChange={e => this.handleInputChanged(e.target.value)} />
        </div>
      );
    }

    return (
      <div className="Widget">
        <div className="Widget-var_name">
          {varName}
        </div>
        {display}
      </div>
    );
  }
}

export default enhanceWithClickOutside(FormulaWidget);
