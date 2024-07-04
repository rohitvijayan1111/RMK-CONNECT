import React from 'react';
import { useLocation } from 'react-router-dom';

const EditForm = () => {
  const location = useLocation();
  const { attributenames, item } = location.state; 

  return (
    <div className="container">
      <h2>Edit Form</h2>
      {attributenames && attributenames.length > 0 ? (
        <form>
          {attributenames.map((attribute, index) => (
            <div className="form-group" key={index}>
              <label htmlFor={attribute}>{attribute}:</label>
              <input
                type="text"
                className="form-control"
                id={attribute}
                defaultValue={item[attribute] || ''}
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditForm;
