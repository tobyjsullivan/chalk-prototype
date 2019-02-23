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
    case 'lambda':
      content = `λ (${result.freeVariables.join(', ')})`
      break;
    case 'list':
      const items = result.elements.map((res, i) => (
        <li key={i} className="ResultDisplay-list_item">
          <ResultDisplay result={res} />
        </li>
      ));
      content = (
        <ul>
          {items}
        </ul>
      );
      break;
    case 'record':
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
      break;
    case 'error':
        content = (
          <p className="ResultDisplay-error">{result.message}</p>
        )
  }

  return (
    <div className="ResultDisplay">
      {content}
    </div>
  );
};

export default ResultDisplay;
