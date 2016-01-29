import { render } from 'react-dom';
import React from 'react';
import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
//github pages does not support redirect all
//import createHistory from 'history/lib/createBrowserHistory';
import createHistory from 'history/lib/createHashHistory';
import { reduxReactRouter, ReduxRouter, routerStateReducer } from 'redux-router';
import { reducer as formReducer } from 'redux-form';


export default function createExampleApp(reducers, routes) {

  const finalCreateStore = compose(
    applyMiddleware(thunk),
    reduxReactRouter({ routes, createHistory }),
    devTools(),
  )(createStore);

  const store = finalCreateStore(combineReducers({
    form: formReducer,
    router: routerStateReducer,
    ...reducers
  }));

  render(
    <div>
      <Provider store={store}>
        <ReduxRouter />
      </Provider>
      <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
      </DebugPanel>
    </div>
    ,
    document.getElementById('root') 
  );
}


