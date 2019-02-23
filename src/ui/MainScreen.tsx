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
  onChange: (id: string, formula: string) => void;
}

const MainScreen = ({title, online, onAdd, variables, onChange}: MainScreenProps) => {
  const widgets = variables.map(({id, name, formula, result}) => (
    <div key={name}>
      <FormulaWidget
        varName={name}
        formula={formula}
        result={result}
        onFormulaChange={(formula) => onChange(id, formula)} />
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
      <p>Status: {status}</p>
      <a className="MainScreen-link" onClick={() => onAdd()} href="#">Add +</a>
      <div>
        {widgets}
      </div>
    </div>
  );
};

export default MainScreen;
