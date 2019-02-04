import React, { Component, ComponentClass } from "react";
import {List} from 'immutable';

import './MainScreen.css';

interface WidgetProps {
  varName: string;
  formula: string;
}

interface MainScreenProps {
  title: string;
  onAdd: () => void;
  Widget: ComponentClass<WidgetProps, {}>;
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
