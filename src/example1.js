import PouchDB from 'pouchdb';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { IndexRoute, Route } from 'react-router';
import {reduxForm} from 'redux-form';
import { createCRUD, containers, utils } from 'pouchdb-redux-helper';


import {
  ProjectForm,
  projectFormOptions,
  ProjectDetail,
  ProjectList,
} from './components';
import createExampleApp from './exampleApp';

const db = PouchDB('testdb');
const projectsCrud = createCRUD(db, 'projects');
const reducers = {
  [projectsCrud.mountPoint]: projectsCrud.reducer,
};


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


// connected component
export const AllProjectListContainer = containers.connectList(projectsCrud, {folder: 'all'})(ProjectList);

export const ProjectNewContainer = reduxForm(projectFormOptions, state => ({
  onSubmit: redirectToList.bind(null, onCreate, null),
}))(ProjectForm);

export const ProjectDetailContainer = connect(
  state => ({
    docId: state.router.params.id,
    onRemove,
  })
)(containers.connectSingleItem(projectsCrud)(ProjectDetail))


const editMapStateToProps = state => {
  const item = utils.getObjectFromState(state, projectsCrud.mountPoint, state.router.params.id).toJS();
  return ({
    onSubmit: redirectToList.bind(null, onSubmit, item),
    initialValues: item,
  });
};

export const ProjectEditContainer = connect(state => ({ docId: state.router.params.id }))(
  containers.connectSingleItem(projectsCrud)(
    reduxForm(projectFormOptions, editMapStateToProps)(ProjectForm)
));

class App extends Component {
  render() {
    return (
      <div className="main">
        {this.props.children}
      </div>
    );
  }
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={ AllProjectListContainer } />
    <Route path={projectsCrud.paths.list} component={AllProjectListContainer} />
    <Route path={projectsCrud.paths.create} component={ProjectNewContainer} />
    <Route path={projectsCrud.paths.edit} component={ProjectEditContainer} />
    <Route path={projectsCrud.paths.detail} component={ProjectDetailContainer} />
  </Route>
);


createExampleApp(reducers, routes);

