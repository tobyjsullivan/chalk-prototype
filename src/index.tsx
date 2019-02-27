import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ChalkClient from './chalk/ChalkClient';
import { getActiveSession } from './services/sessions';
import { VariableState } from './chalk/domain';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.messy.codes' : 'http://localhost:8080';

// Allow click-outside to work on iOS.
if ('ontouchstart' in document.documentElement) {
  document.body.style.cursor = 'pointer';
}

const chalk = new ChalkClient(API_URL);

async function getVariable(id: string): Promise<VariableState> {
  const result = await chalk.getVariables([id]);
  return result[0]
}

ReactDOM.render(
  <App
    checkConnection={() => chalk.checkConnection()}
    createVariable={(name, formula) => chalk.createVariable(name, formula)}
    updateVariable={(id, formula) => chalk.updateVariable(id, formula)}
    renameVariable={(id, name) => chalk.renameVariable(id, name)}
    getVariable={(id) => getVariable(id)}
    getSession={() => getActiveSession(chalk)} />,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
