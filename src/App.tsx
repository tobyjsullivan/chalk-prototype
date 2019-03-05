import React, { Component, StatelessComponent, ComponentClass } from 'react';
import {List, Map} from 'immutable';
import {VariableState, PageState} from './chalk/domain';
import { SessionState } from './chalk/domain';
import MainScreen from './ui/MainScreen';
import LoadingScreen from './ui/LoadingScreen';
import './App.css';

const DEFAULT_FORMULA = '"Tap Here"';

interface AppProps {
  checkConnection: () => Promise<any>,
  getSession: () => Promise<SessionState>,
  getPageVariables: (pageId: string) => Promise<List<VariableState>>,
  createVariable: (pageId: string, varName: string, formula: string) => Promise<VariableState>,
  updateVariable: (id: string, formula: string) => Promise<VariableState>,
  renameVariable: (id: string, name: string) => Promise<VariableState>,
}

interface AppState {
  online: boolean | null,
  currentPage: string | null,
  nextVarNum: number,
  session: SessionState | null,
  currentPageVars: Map<string, VariableState>,
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
  }

  state = {
    online: null,
    currentPage: null,
    variables: List<string>(),
    nextVarNum: 1,
    session: null,
    currentPageVars: Map<string, VariableState>(),
  }

  async initSession() {
    const {getSession} = this.props;
    const session = await getSession();
    this.setState({session});

    const defaultPage = session.pages.first(null);
    if (defaultPage === null) {
      return;
    }

    this.handlePageOpened(defaultPage.id);
  }

  componentDidMount() {
    const {checkConnection} = this.props;

    checkConnection().then(() => {
      this.setState({online: true});
    }).catch(() => {
      this.setState({online: false});
    });

    // We initialise sessions within the App component because we don't want to block first render.
    this.initSession();
  }

  async getNextVarName(): Promise<string> {
    return new Promise((res) => {
      this.setState(({nextVarNum}) => {
        const varName = `var${nextVarNum}`;

        res(varName);
        return {
          nextVarNum: nextVarNum + 1,
        };
      });
    });
  }

  async onAdd() {
    console.log('onAdd() executing...');
    const {createVariable} = this.props;
    const {currentPage} = this.state;
    if (currentPage === null) {
      console.warn('var added before page loaded.');
      return;
    }

    const varName = await this.getNextVarName();
    createVariable(currentPage, varName, DEFAULT_FORMULA).then((varState) => {
      this.reloadPageVars();
    });
  }

  async handleVarChanged(varId: string, formula: string): Promise<void> {
    await this.props.updateVariable(varId, formula);

    this.reloadPageVars();
  }

  async handleVarRenamed(varId: string, name: string): Promise<void> {
    try {
      await this.props.renameVariable(varId, name);

      this.reloadPageVars();
    } catch (e) {
      console.error(e);
      alert('error renaming var: ' + e);
    }
  }

  async handlePageOpened(pageId: string) {
    this.setState({currentPage: pageId}, () => {
      this.reloadPageVars();
    });
  }

  async reloadPageVars() {
    // Load page variables
    const {getPageVariables} = this.props;
    const {currentPage} = this.state;

    if (currentPage === null) {
      return;
    }

    const vars = await getPageVariables(currentPage);
    const varMap = vars.toMap().mapKeys((_, v) => v.id);
    this.setState({currentPageVars: varMap});
  }

  render() {
    const {updateVariable} = this.props;
    const {online, currentPage, currentPageVars} = this.state;
    let currentScreen;
    if (currentPage === null) {
      currentScreen = (<LoadingScreen />);
    } else {
      currentScreen = (
        <MainScreen
          title="Messy"
          online={online}
          currentPage={currentPage}
          pages={List()}
          variables={List(currentPageVars.values())}
          onAddVar={() => this.onAdd()}
          onOpenPage={(pageId) => this.handlePageOpened(pageId)}
          onVarChange={(id, formula) => this.handleVarChanged(id, formula)}
          onVarRename={(id, name) => this.handleVarRenamed(id, name)} />
      );
    }

    return (
      <div className="App">
        {currentScreen}
      </div>
    );
  }
}

export default App;
