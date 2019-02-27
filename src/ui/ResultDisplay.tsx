import React from 'react';
import {Result} from '../chalk/domain/resolver';
import './ResultDisplay.css';

interface PropsType {
  result: Result,
}

const ResultDisplay = ({result}: PropsType) => {
  let content: JSX.Element;

  switch (result.resultType) {
    case 'none':
      content = (<span />);
      break;
    case 'boolean':
      content = (<span>{result.value ? 'TRUE' : 'FALSE'}</span>);
      break;
    case 'lambda':
      content = (<span>`λ (${result.freeVariables.join(', ')})`</span>);
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
    case 'number':
      content = (<span>{result.value}</span>);
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
    case 'string':
      content = (<span>{result.value}</span>);
      break;
    case 'error':
      content = (
        <p className="ResultDisplay-error">{result.message}</p>
      );
      break;
    default:
        throw 'Unexpected type: ' + result;
  }

  return (
    <div className="ResultDisplay">
      {content}
    </div>
  );
};

export default ResultDisplay;
