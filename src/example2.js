import PouchDB from 'pouchdb';
import React, { Component } from 'react';
import { IndexRoute, Route } from 'react-router';
import { connect } from 'react-redux';

import { createCRUD, paginate } from 'pouchdb-redux-helper';

import {
  ProjectTable,
  App,
  Navigation,
} from './components';
import createExampleApp from './exampleApp';

const db = window.db = PouchDB('example2');

const projectsCrud = createCRUD(db, 'doc');
const reducers = {
  [projectsCrud.mountPoint]: projectsCrud.reducer,
};

const PaginatedComponent = (props) => {
  const prev = props.folderVars.get('prev');
  const next = props.folderVars.get('next');

  return (
    <div>
      <ProjectTable items={props.items} />
      <Navigation location={{pathname: '/'}} next={next} prev={prev} />
    </div>
  );
}

//map url params to props
@connect(state => ({
  startkey: state.router.location.query.start,
}))
class Container extends Component {
  render() {
    const {startkey} = this.props;
    const C = paginate({
      rowsPerPage: 5,
      startkey,
    }, projectsCrud)(PaginatedComponent);
    return React.createElement(C);
  }
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={ Container } />
  </Route>
);


db.get('version').then(() => {
  createExampleApp(reducers, routes);
}).catch(err => {
  if (err.status == 404) {
    db.bulkDocs([
      { _id: 'doc-01', name: '1' },
      { _id: 'doc-02', name: '2' },
      { _id: 'doc-03', name: '3' },
      { _id: 'doc-04', name: '4' },
      { _id: 'doc-05', name: '5' },
      { _id: 'doc-06', name: '6' },
      { _id: 'doc-07', name: '7' },
      { _id: 'doc-08', name: '8' },
      { _id: 'doc-09', name: '9' },
      { _id: 'doc-10', name: '10' },
      { _id: 'doc-11', name: '11' },
      { _id: 'doc-12', name: '12' },
      { _id: 'doc-13', name: '13' },
      { _id: 'doc-14', name: '14' },
      { _id: 'doc-15', name: '15' },
      { _id: 'doc-16', name: '16' },
      { _id: 'doc-17', name: '17' },
      { _id: 'doc-18', name: '18' },
      { _id: 'doc-19', name: '19' },
      { _id: 'doc-20', name: '20' },
      { _id: 'version', name: '1' }
    ]).then((res) => {
      createExampleApp(reducers, routes);
    }).catch(err => {
      throw(err);
    });
  }
});
