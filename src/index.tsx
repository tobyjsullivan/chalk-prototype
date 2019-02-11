import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ChalkClient from './chalk/ChalkClient';
import { getActiveSession } from './services/sessions';

const API_URL = 'http://192.168.1.5:8080';

// Allow click-outside to work on iOS.
if ('ontouchstart' in document.documentElement) {
  document.body.style.cursor = 'pointer';
}

const chalk = new ChalkClient(API_URL);

ReactDOM.render(
  <App
    checkConnection={() => chalk.checkConnection()}
    executeFormula={(formula) => chalk.execute(formula)}
    setVariable={(varName, formula) => chalk.setVariable(varName, formula)}
    getSession={() => getActiveSession(chalk)} />,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
