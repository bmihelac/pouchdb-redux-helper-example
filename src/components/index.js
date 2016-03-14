import React, { Component } from 'react';
import { Link } from 'react-router';


//redux-form options
export const projectFormOptions = {
  form: 'projectForm',
  fields: ['name'],
  validate: values => {
    if (!values.name) {
      return {name: 'required'};
    }
    return {};
  }
}


export class ProjectForm extends Component {
  render() {
    const { fields: {name }, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className={'form-group' + (name.touched && name.error ? ' has-error' : '')}>
          <label>Project</label>
          <input {...name} />
          {name.touched && name.error && <div className="text-danger">{name.error}</div>}
        </div>
        <button  className="btn btn-default" onClick={handleSubmit.bind(this)}>Submit</button>
      </form>
    );
  }
}


export const ProjectDetail = ({item, dispatch, onRemove}) => (
  <div>
    <span>{ item.get('name') }</span>

    <p>
      <Link className="btn btn-default"
        to={`/projects/${item.get('_id')}/edit/`}>Edit</Link>
    </p>

    <p>
      <button className="btn btn-danger"
        onClick={ () => onRemove(dispatch, item) }>remove</button>
    </p>
  </div>
);


//dumb component that displays projects list
export const ProjectList = ({items}) => (
  <div>
    { items.map(item => (
      <div key={ item.get('_id') }>
        <Link to={`/projects/${item.get('_id')}/`}>{ item.get('name') }</Link>
      </div>
     ))}

    <Link to="/projects/new/" className="btn btn-default">New</Link>
  </div>
);

export const ProjectTable = ({items, columns=['name']}) => (
  <table className="table table-hove ">
    <thead>
      <tr>
        { columns.map(column => (
          <th key={column}>{ column }</th>
          )) }
      </tr>
    </thead>
    <tbody>
      { items.map(item => (
        <tr key={ item.get('_id') }>
          { columns.map(column => (
            <td key={column}>{ item.get(column) }</td>
            )) }
        </tr>
       ))}
     </tbody>
  </table>
);


// linked list style pagination component
export const Navigation = ({location, next, prev}) => {
  const nextLink = next ? <Link to={location.pathname} query={{...location.query, start: next}}>Next page</Link> : <span>Next page</span>;
  const prevLink = prev ? <Link to={location.pathname} query={{...location.query, start: prev}}>Previous page</Link> : <span>Previous page</span>;
  return (
    <nav>
      <ul className="pager">
        <li className={prev ? '' : 'disabled'}>{prevLink}</li>
        <li className={next ? '': 'disabled'}>{nextLink}</li>
      </ul>
    </nav>
  );
};


export class App extends Component {
  render() {
    return (
      <div className="main">
        {this.props.children}
      </div>
    );
  }
}
