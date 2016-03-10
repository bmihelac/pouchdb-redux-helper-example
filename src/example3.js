import PouchDB from 'pouchdb';
import PouchDBLoad from 'pouchdb-load';
import React, { Component } from 'react';
import { IndexRoute, Route } from 'react-router';
import { connect } from 'react-redux';

import { createCRUD, paginate } from 'pouchdb-redux-helper';

PouchDB.plugin(PouchDBLoad);


import {
  ProjectTable,
  App,
  Navigation,
} from './components';
import createExampleApp from './exampleApp';

const db = window.db = PouchDB('example3');

const monstersCRUD = createCRUD(db, 'monsters', null, {
  startkey: null,
  endkey: null,
});
const reducers = {
  [monstersCRUD.mountPoint]: monstersCRUD.reducer,
};

const columns = [
  '_id',
  'name',
  'attack',
  'catch_rate',
  'defense',
  'growth_rate',
  'happiness',
  'height',
  'hp',
  'male_female_ratio',
  'national_id',
  'species',
  'sp_atk',
  'sp_def',
  'speed',
  'weight',
]

const PaginatedComponent = (props) => {
  const prev = props.folderVars.get('prev');
  const next = props.folderVars.get('next');

  return (
    <div>
      <ProjectTable items={props.items} columns={columns} />
      <Navigation next={next} prev={prev} />
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
      rowsPerPage: 25,
      startkey,
    }, monstersCRUD)(PaginatedComponent);
    return React.createElement(C);
  }
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={ Container } />
  </Route>
);


// load data from file
db.get('_local/initial_load_complete').catch(function (err) {
  if (err.status !== 404) {
    throw err;
  }
  document.getElementById('root').innerHTML = 'populating database';
  return db.load('data/monsters.txt').then(() => {
    return db.put({_id: '_local/initial_load_complete'});
  });
}).then(function() {
  createExampleApp(reducers, routes);
});
