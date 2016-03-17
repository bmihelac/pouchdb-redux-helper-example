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

class PaginatedComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: props.items
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items !== null) {
      this.setState(nextProps);
    }
  }

  render() {
    if (!this.state.items) {
      return <div>loading...</div>;
    }
    const props = this.props;
    const folderVars = this.state.folderVars;
    const prev = folderVars.get('prev');
    const next = folderVars.get('next');
    const opacity = props.isLoading ? '0.5' : '1';

    return (
      <div>
        <input type="search" value={props.q} placeholder="Search"
          onChange={e => props.dispatch(pushState(null, '/', {q: e.target.value})) }
        />
        <div style={{opacity}}>
          <ProjectTable items={this.state.items} columns={columns} />
          <Navigation location={props.location} next={next} prev={prev} />
        </div>
      </div>
    );
  }

}


function mapStateToProps(state) {
  const query = state.router.location.query;
  let listOpts = {
    options: { fun: 'byName' }
  }
  if (query.q) {
    listOpts.options.startkey = query.q.toLowerCase();
    listOpts.options.endkey = query.q.toLowerCase() + '\uffff';
  }
  return {
    query,
    startkey: query.start,
    q: query.q,
    location: { pathname: '/', query },
    listOpts,
  }
}
const Container = paginate(
  { rowsPerPage: 25 },
  monstersCRUD,
  {},
  mapStateToProps
)(PaginatedComponent);


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
