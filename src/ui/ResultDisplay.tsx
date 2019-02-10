import React from 'react';
import {Result, List} from '../chalk/domain/resolver';
import './ResultDisplay.css';

interface PropsType {
  result: Result,
}

const ResultDisplay = ({result}: PropsType) => {
  let content = null;

  switch (result.resultType) {
    case 'none':
      break;
    case 'string':
    case 'number':
      content = result.value;
      break;
    case 'list':
      const items = result.elements.map((res, i) => (
        <ResultDisplay result={res} key={i} />
      ));
      content = (
        <ul>
          {items}
        </ul>
      );
      break;
    default:
      const propRows = result.properties.map(({name, value}) => (
        <li key={name}>
          {name}: <ResultDisplay result={value} />
        </li>
      ));

      content = (
        <ul>
          {propRows}
        </ul>
      );
  }

  return (
    <div className="ResultDisplay">
      {content}
    </div>
  );
};

export default ResultDisplay;
