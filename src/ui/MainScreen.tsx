import React, { Component, ComponentClass, StatelessComponent } from "react";
import {List} from 'immutable';

import './MainScreen.css';
import { type } from "os";

export interface WidgetProps {
  varName: string;
  formula: string;
}

type Widget = Component<WidgetProps, {}>

interface MainScreenProps {
  title: string;
  onAdd: () => void;
  Widget: StatelessComponent<WidgetProps> | ComponentClass<WidgetProps, {}>;
  variables: List<{
    varName: string;
    formula: string;
  }>;
}

const MainScreen = ({title, onAdd, Widget, variables}: MainScreenProps) => {
  const widgets = variables.map((v) => (
    <Widget
      key={v.varName}
      varName={v.varName}
      formula={v.formula} />
  )).toArray();
  console.log('Widgets: %o', widgets);

  return (
    <div className="MainScreen">
      <h1 className="MainScreen-title">{title}</h1>
      <a className="MainScreen-link" onClick={() => onAdd()} href="#">Add +</a>
      {widgets}
    </div>
  );
};

export default MainScreen;
