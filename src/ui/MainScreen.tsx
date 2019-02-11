import React, { Component, ComponentClass, StatelessComponent } from "react";
import {List} from 'immutable';

import './MainScreen.css';

export interface WidgetProps {
  varName: string;
  formula: string;
}

interface MainScreenProps {
  title: string;
  online: boolean | null;
  onAdd: () => void;
  Widget: StatelessComponent<WidgetProps> | ComponentClass<WidgetProps, {}>;
  variables: List<{
    varName: string;
    formula: string;
  }>;
}

const MainScreen = ({title, online, onAdd, Widget, variables}: MainScreenProps) => {
  const widgets = variables.map(({varName, formula}) => (
    <div key={varName}>
      <Widget
        varName={varName}
        formula={formula} />
    </div>
  )).toArray();
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
