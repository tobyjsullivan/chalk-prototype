import React, {Component} from 'react';
import enhanceWithClickOutside from 'react-click-outside';

import {Result} from '../chalk/domain/resolver';
import ResultDisplay from './ResultDisplay';
import './FormulaWidget.css';

interface PropsType {
  editing: boolean;
  varName: string;
  formula: string;
  result: Result;
  onEditStartAction: () => any;
  onEditEndAction: () => any;
  onFormulaChange: (formula: string) => any;
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
class FormulaWidget extends Component<PropsType, {}> {
  input: HTMLInputElement | null = null;

  componentDidMount() {
    this.focus()
  }

  componentDidUpdate() {
    this.focus()
  }

  focus() {
    this.input && this.props.editing ? this.input.focus() : {}
  }

  handleClickOutside() {
    const {editing, onEditEndAction} = this.props;

    if (editing) {
      onEditEndAction();
    }
  }

  render() {
    const {editing, varName, formula, result, onEditStartAction, onEditEndAction, onFormulaChange} = this.props;
    let display = (
      <div className="Widget-result_window" onClick={onEditStartAction}>
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
            onBlur={onEditEndAction}
            onKeyDown={e => isEndAction(e) ? onEditEndAction() : {}}
            onChange={e => onFormulaChange(e.target.value)} />
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
