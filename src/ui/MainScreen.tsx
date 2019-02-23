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
}

const MainScreen = ({title, online, onAdd, variables}: MainScreenProps) => {
  const widgets = variables.map(({name, formula, result}) => (
    <div key={name}>
      <FormulaWidget
        editing={false} // TODO
        varName={name}
        formula={formula}
        result={result}
        onEditStartAction={() => {}}
        onEditEndAction={() => {}}
        onFormulaChange={() => {}} />
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
