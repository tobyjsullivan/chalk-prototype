import React, { Component, StatelessComponent } from 'react';
import {List, Map} from 'immutable';
import Widget from './Widget';
import {Result} from './chalk/domain/resolver';
import { Session } from './chalk/domain';
import MainScreen, {WidgetProps} from './ui/MainScreen';

const DEFAULT_FORMULA = '1';

interface AppProps {
  getSession: () => Promise<Session>,
  executeFormula: (formula: string) => Promise<Result>,
}

interface AppState {
  variables: List<Variable>;
  nextVarNum: number;
  session: Session | null;
}

interface Variable {
  varName: string;
  formula: string;
}

class App extends Component<AppProps, AppState> {
  state = {
    variables: List(),
    nextVarNum: 1,
    session: null,
  }

  componentDidMount() {
  }

  async initSession() {
    const {getSession} = this.props;
    const session = await getSession();
    this.setState({session});
  }

  onAdd() {
    console.log('onAdd() executing...');
    this.setState((prev) => {
      const varName = `var${prev.nextVarNum}`;
      const newVar = {varName, formula: DEFAULT_FORMULA};

      return {
        variables: prev.variables.insert(0, newVar),
        nextVarNum: prev.nextVarNum + 1,
      };
    });
  }

  render() {
    const {executeFormula} = this.props;
    const {variables} = this.state;

    const ExecutingWidget = ({formula, varName}: WidgetProps) => (
      <Widget formula={formula} varName={varName} executeFormula={executeFormula} />
    );

    return (
      <MainScreen
        Widget={ExecutingWidget}
        onAdd={() => this.onAdd()}
        title="Chalk"
        variables={variables} />
    );
  }
}

export default App;
