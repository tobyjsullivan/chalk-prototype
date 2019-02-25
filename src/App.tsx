import React, { Component, StatelessComponent, ComponentClass } from 'react';
import {List, Map} from 'immutable';
import {VariableState} from './chalk/domain';
import { Session } from './chalk/domain';
import MainScreen from './ui/MainScreen';

const DEFAULT_FORMULA = '"Click me"';

interface AppProps {
  checkConnection: () => Promise<any>,
  getSession: () => Promise<Session>,
  createVariable: (varName: string, formula: string) => Promise<VariableState>,
  updateVariable: (id: string, formula: string) => Promise<VariableState>,
  renameVariable: (id: string, name: string) => Promise<VariableState>,
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

  async handleVarChanged(varId: string, formula: string): Promise<void> {
    const varState = await this.props.updateVariable(varId, formula);

    this.registerVar(varState);
  }

  async handleVarRenamed(varId: string, name: string): Promise<void> {
    const varState = await this.props.renameVariable(varId, name);

    this.registerVar(varState);
  }

  render() {
    const {updateVariable} = this.props;
    const {online, variables, currentPageVars} = this.state;

    return (
      <MainScreen
        onAdd={() => this.onAdd()}
        onChange={(id, formula) => this.handleVarChanged(id, formula)}
        onRename={(id, name) => this.handleVarRenamed(id, name)}
        title="MessyCodes"
        online={online}
        variables={List(currentPageVars.values()).toArray()} />
    );
  }
}

export default App;
