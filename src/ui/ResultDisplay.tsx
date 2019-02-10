import React from 'react';
import {Result, List} from '../chalk/domain/resolver';

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
      content = (
        <pre>
          {JSON.stringify(result)}
        </pre>
      );
  }

  return (
    <div>
      {content}
    </div>
  );
};

export default ResultDisplay;
