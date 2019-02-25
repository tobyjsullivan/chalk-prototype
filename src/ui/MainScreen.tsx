import React, { Component, ComponentClass, StatelessComponent } from "react";
import {List} from 'immutable';
import {VariableState} from '../chalk/domain';

import './MainScreen.css';
import FormulaWidget from "./FormulaWidget";

interface MainScreenProps {
  title: string;
  online: boolean | null;
  variables: ReadonlyArray<VariableState>;
  onAdd: () => void;
  onChange: (id: string, formula: string) => Promise<any>;
  onRename: (id: string, name: string) => Promise<any>;
}

const MainScreen = ({title, online, onAdd, variables, onChange, onRename}: MainScreenProps) => {
  const widgets = variables.map(({id, name, formula, result}) => (
    <div key={name}>
      <FormulaWidget
        varName={name}
        formula={formula}
        result={result}
        onFormulaChange={(formula) => onChange(id, formula)}
        onNameChange={(name) => onRename(id, name)} />
    </div>
  ));
  console.log('Widgets: %o', widgets);

  let status = 'checking...';
  if (online !== null) {
    status = online ? 'online' : 'connection error';
  }

  return (
    <div className="MainScreen">
      <h1 className="MainScreen-title">{title}</h1>
      <a className="MainScreen-link MainScreen-addButton" onClick={() => onAdd()} href="#">+ Add a block</a>
      <div>
        {widgets}
      </div>
      <p>Status: {status}</p>
    </div>
  );
};

export default MainScreen;
