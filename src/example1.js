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
  App,
  Loading,
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


const singleItem = containers.connectSingleItem(
  projectsCrud, {}, state => ({
  singleItemOpts: {docId: state.router.params.id},
  onRemove,
}))

export const ProjectDetailContainer = singleItem(ProjectDetail)

const editMapStateToProps = state => {
  const item = utils.getObjectFromState(state, projectsCrud.mountPoint, state.router.params.id);
  if (!item) {
    return {}
  }
  return ({
    onSubmit: redirectToList.bind(null, onSubmit, item.toJS()),
    initialValues: item.toJS(),
  });
};


export const ProjectEditContainer = singleItem(
  reduxForm(projectFormOptions, editMapStateToProps)(ProjectForm)
);




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
