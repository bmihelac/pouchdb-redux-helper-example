import PouchDB from 'pouchdb';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
//github pages does not support redirect all
//import createHistory from 'history/lib/createBrowserHistory';
import createHistory from 'history/lib/createHashHistory';
import { reduxReactRouter, ReduxRouter, routerStateReducer, pushState } from 'redux-router';
import { Route, Link } from 'react-router';
import {reduxForm} from 'redux-form';
import { pouchdbMiddleware, createCRUD, containers, utils } from 'pouchdb-redux-helper';


const db = PouchDB('testdb');
const middlewares = [pouchdbMiddleware(db)];
const projectsCrud = createCRUD(db, 'projects');
const reducers = combineReducers({
  form: formReducer,
  router: routerStateReducer,
  [projectsCrud.mountPoint]: projectsCrud.reducer,
});


//redux-form options
const projectFormOptions = {
  form: 'projectForm',
  fields: ['name'],
  validate: values => {
    if (!values.name) {
      return {name: 'required'};
    }
    return {};
  }
}

class ProjectForm extends Component {
  render() {
    const { fields: {name }, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className={'form-group' + (name.touched && name.error ? ' has-error' : '')}>
          <label>Project</label>
          <input {...name} />
          {name.touched && name.error && <div>{name.error}</div>}
        </div>
        <button onClick={handleSubmit.bind(this)}>Submit</button>
      </form>
    );
  }
}

const onSubmit = containers.createOnSubmitHandler(projectsCrud);
const redirectToList = (fun, item, data, dispatch) => {
  fun(item, data, dispatch);
  dispatch(pushState(null, projectsCrud.paths.list));
};
const onRemove = (dispatch, items) => {
  containers.createOnRemoveHandler(projectsCrud)(dispatch, items);
  dispatch(pushState(null, projectsCrud.paths.list));
}
const onCreate = (item, data, dispatch) => {
  onSubmit(item, data, dispatch);
  //force reloading
  dispatch(projectsCrud.actions.allDocs('all'));
}


const ProjectDetail = ({item, dispatch}) => (
  <div>
    <span>{ item.get('name') }</span>
    <Link to={`/projects/${item.get('_id')}/edit/`}>Edit</Link>

    <p>
      <button onClick={ () => onRemove(dispatch, item) }>remove</button>
    </p>
  </div>
);

//dumb component that displays projects list
const ProjectList = ({items}) => (
  <div>
    { items.map(item => (
      <div key={ item.get('_id') }>
        <Link to={`/projects/${item.get('_id')}/`}>{ item.get('name') }</Link>
      </div>
     ))}
    <Link to="/projects/new/">New</Link>
  </div>
);


// connected component
export const AllProjectListContainer = containers.connectList(projectsCrud, {folder: 'all'})(ProjectList);

export const ProjectNewContainer = reduxForm(projectFormOptions, state => ({
  onSubmit: redirectToList.bind(null, onCreate, null),
}))(ProjectForm);

export const ProjectDetailContainer = connect(state => ({ docId: state.router.params.id }))(
  containers.connectSingleItem(projectsCrud)(ProjectDetail)
)


const editMapStateToProps = state => {
  const item = utils.getObjectFromState(state, projectsCrud.mountPoint, state.router.params.id).toJS();
  return ({
    onSubmit: redirectToList.bind(null, onSubmit, item),
    initialValues: item,
  });
};


class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li> <Link to="/projects/">Projects</Link> </li>
        </ul>
        <div className="main">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export const ProjectEditContainer = containers.connectSingleItem(projectsCrud)(
  reduxForm(projectFormOptions, editMapStateToProps)(ProjectForm)
);

const routes = (
  <Route path="/" component={App}>
    <Route path={projectsCrud.paths.list} component={AllProjectListContainer} />
    <Route path={projectsCrud.paths.create} component={ProjectNewContainer} />
    <Route path={projectsCrud.paths.edit} component={ProjectEditContainer} />
    <Route path={projectsCrud.paths.detail} component={ProjectDetailContainer} />
  </Route>
);

const finalCreateStore = compose(
  // Enables your middleware:
  applyMiddleware(...middlewares),
  reduxReactRouter({ routes, createHistory }),
  devTools(),
)(createStore);

const store = finalCreateStore(reducers);



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
