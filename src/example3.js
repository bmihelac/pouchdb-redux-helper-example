import PouchDB from 'pouchdb';
import PouchDBLoad from 'pouchdb-load';
import React, { Component } from 'react';
import { IndexRoute, Route } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import { createCRUD, paginate } from 'pouchdb-redux-helper';

PouchDB.plugin(PouchDBLoad);


import {
  ProjectTable,
  App,
  Navigation,
} from './components';
import createExampleApp from './exampleApp';

const db = window.db = PouchDB('example31');

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
      <Navigation location={props.location} next={next} prev={prev} />
    </div>
  );
}

//map url params to props
@connect(state => ({
  query: state.router.location.query,
  startkey: state.router.location.query.start,
  q: state.router.location.query.q,
}))
class Container extends Component {
  render() {
    const {query, startkey, q, dispatch} = this.props;
    const paginationOpts = {
      rowsPerPage: 25,
      startkey,
    }
    const listOpts = {
      options: {
        fun: 'byName',
      }
    };
    if (q) {
      Object.assign(listOpts.options, {
        startkey: q.toLowerCase(),
        endkey: q.toLowerCase() + '\uffff',
      });
    }
    const C = paginate(
      paginationOpts,
      monstersCRUD,
      listOpts
    )(PaginatedComponent);

    const location = {
      pathname: '/',
      query
    }
    return (
      <div>
        <input type="search" value={q} placeholder="Search"
          onChange={e => dispatch(pushState(null, '/', {q: e.target.value})) }
        />
        <C location={location} />
      </div>
    )
  }
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={ Container } />
  </Route>
);


const ddoc = {
  _id: '_design/byName',
  views: {
    byName: {
      map: function (doc) {
        if (doc.name) {
          emit(doc.name.toLowerCase());
        }
      }.toString()
    }
  }
}

db.get(ddoc._id).catch(err => {
  if (err.status !== 404) {
    throw err;
  }
  return db.put(ddoc);
}).then(() => {
  // load data from file
  return db.get('_local/initial_load_complete').catch(function (err) {
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
});
