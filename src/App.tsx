import React, { Component, StatelessComponent, ComponentClass } from 'react';
import {List, Map} from 'immutable';
import Widget from './Widget';
import {Result} from './chalk/domain/resolver';
import { Session } from './chalk/domain';
import MainScreen, {WidgetProps} from './ui/MainScreen';

const DEFAULT_FORMULA = '"Click me"';

interface AppProps {
  checkConnection: () => Promise<any>,
  getSession: () => Promise<Session>,
  executeFormula: (formula: string) => Promise<Result>,
  setVariable: (varName: string, formula: string) => Promise<any>,
}

interface AppState {
  online: boolean | null;
  variables: List<string>;
  nextVarNum: number;
  session: Session | null;
  varCache: Map<string, string>;
}

class App extends Component<AppProps, AppState> {
  ExecutingWidget: StatelessComponent<WidgetProps> | ComponentClass<WidgetProps, {}>;

  constructor(props: AppProps) {
    super(props);

    const {executeFormula} = this.props;

    this.ExecutingWidget = ({formula, varName}: WidgetProps) => (
      <Widget
        formula={formula}
        varName={varName}
        onVarChange={(f: string) => this.handleVarChanged(varName, f)}
        executeFormula={(f) => executeFormula(f)} />
    );
  }

  state = {
    online: null,
    variables: List<string>(),
    nextVarNum: 1,
    session: null,
    varCache: Map<string, string>(),
  }

  async initSession() {
    const {getSession} = this.props;
    const session = await getSession();
    this.setState({session});
  }

  componentDidMount() {
    const {checkConnection} = this.props;

    checkConnection().then(() => {
      this.setState({online: true});
    }).catch(() => {
      this.setState({online: false});
    });
  }

  onAdd() {
    console.log('onAdd() executing...');
    this.setState((prev) => {
      const varName = `var${prev.nextVarNum}`;
      this.props.setVariable(varName, DEFAULT_FORMULA).then(() => {
        this.setCache(varName, DEFAULT_FORMULA);
      });

      return {
        variables: prev.variables.push(varName),
        nextVarNum: prev.nextVarNum + 1,
      };
    });
  }

  setCache(varName: string, formula: string) {
    this.setState(({varCache}) => ({varCache: varCache.set(varName, formula)}));
  }

  clearCache(varName: string) {
    this.setState(({varCache}) => ({varCache: varCache.delete(varName)}));
  }

  handleVarChanged(varName: string, formula: string) {
    this.setCache(varName, formula);
    this.props.setVariable(varName, formula);
  }

  render() {
    const {online, variables, varCache} = this.state;

    const vars: List<{varName:string, formula: string}> = variables
      .map((varName) => ({varName, formula: varCache.get(varName, '')}))
      .filter((v) => v.formula !== '')
      .toList();
    return (
      <MainScreen
        Widget={this.ExecutingWidget}
        onAdd={() => this.onAdd()}
        title="Chalk"
        online={online}
        variables={vars} />
    );
  }
}

export default App;
