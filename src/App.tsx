import React, { Component, StatelessComponent, ComponentClass } from 'react';
import {List, Map} from 'immutable';
import Widget from './Widget';
import {Result} from './chalk/domain/resolver';
import {VariableState} from './chalk/domain';
import { Session } from './chalk/domain';
import MainScreen from './ui/MainScreen';

const DEFAULT_FORMULA = '"Click me"';

interface AppProps {
  checkConnection: () => Promise<any>,
  getSession: () => Promise<Session>,
  createVariable: (varName: string, formula: string) => Promise<VariableState>,
  updateVariable: (id: string, formula: string) => Promise<VariableState>,
  getVariable: (id: string) => Promise<VariableState>,
}

interface AppState {
  online: boolean | null;
  variables: List<string>;
  nextVarNum: number;
  session: Session | null;
  currentPageVars: Map<string, VariableState>;
}

class App extends Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
  }

  state = {
    online: null,
    variables: List<string>(),
    nextVarNum: 1,
    session: null,
    currentPageVars: Map<string, VariableState>(),
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
      this.props.createVariable(varName, DEFAULT_FORMULA).then((varState) => {
        this.registerVar(varState);
      });

      return {
        variables: prev.variables.push(varName),
        nextVarNum: prev.nextVarNum + 1,
      };
    });
  }

  registerVar(varState: VariableState) {
    this.setState(({currentPageVars}) => ({currentPageVars: currentPageVars.set(varState.id, varState)}));
  }

  handleVarChanged(varId: string, formula: string) {
    this.props.updateVariable(varId, formula).then((varState) => {
      this.registerVar(varState);
    });
  }

  render() {
    const {online, variables, currentPageVars} = this.state;

    return (
      <MainScreen
        onAdd={() => this.onAdd()}
        title="Chalk"
        online={online}
        variables={List(currentPageVars.values()).toArray()} />
    );
  }
}

export default App;
