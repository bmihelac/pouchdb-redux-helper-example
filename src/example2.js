import PouchDB from 'pouchdb';
import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { createCRUD, paginate } from 'pouchdb-redux-helper';

import {
  ProjectTable,
  App,
} from './components';
import createExampleApp from './exampleApp';

const db = PouchDB('testdb');
const projectsCrud = createCRUD(db, 'projects');
const reducers = {
  [projectsCrud.mountPoint]: projectsCrud.reducer,
};

const Navigation = ({current, next, prev}) => {
  const nextLink = next ? <Link to={`?start=${next}&prev=${current}`}>Next page</Link> : null;
  const prevLink = prev ? <Link to={`?start=${prev}`}>Previous page</Link> : null;
  return (
    <div>
      {prevLink}
      {nextLink}
    </div>
  );
};

const PaginatedComponent = ({ items, folderVars }) => {
  const rowsPerPage = folderVars.get('rowsPerPage');
  console.log(folderVars.toJS());
  const prev = folderVars.get('prevStartkey');
  const next = items.getIn([rowsPerPage, '_id']);
  const current = items.getIn([0, '_id']);

  return (
    <div>
      <ProjectTable items={items.slice(0, rowsPerPage)} />
      <Navigation current={current} next={next} prev={prev} />
    </div>
  );
}

// map paging url params
const PaginatedContainer = ({startkey, prevStartkey}) => {
  console.log(startkey, prevStartkey);
  const C = paginate({
    rowsPerPage: 2,
    startkey,
    prevStartkey,
  }, projectsCrud)(PaginatedComponent);
  return <C />;
}

const PaginatedContainer2 = connect(state => ({
  startkey: state.router.location.query.start,
  prevStartkey: state.router.location.query.prev,
}))(PaginatedContainer)

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={ PaginatedContainer2 } />
  </Route>
);


createExampleApp(reducers, routes);

