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
          {name.touched && name.error && <div>{name.error}</div>}
        </div>
        <button onClick={handleSubmit.bind(this)}>Submit</button>
      </form>
    );
  }
}


export const ProjectDetail = ({item, dispatch, onRemove}) => (
  <div>
    <span>{ item.get('name') }</span>
    <Link to={`/projects/${item.get('_id')}/edit/`}>Edit</Link>

    <p>
      <button onClick={ () => onRemove(dispatch, item) }>remove</button>
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
    <Link to="/projects/new/">New</Link>
  </div>
);

