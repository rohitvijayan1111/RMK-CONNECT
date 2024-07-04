import React from 'react';
import { useLocation } from 'react-router-dom';
import './EditForm.css'
const EditForm = () => {
  const location = useLocation();
  const { attributenames, item } = location.state; 

  return (
    <div className="cnt">
      
      <h2>Edit Field</h2>
      {attributenames && attributenames.length > 0 ? (
        <form className="edt">
          {attributenames.map((attribute, index) => (
            <div className="frm" key={index}>
              <label htmlFor={attribute} className="lbl">{attribute}:</label>
              <input
                type="text"
                className="cntr"
                id={attribute}
                defaultValue={item[attribute] || ''}
              />
            </div>
          ))}
          <div className="holder">
          <button className='btt'>Save Changes</button>
          </div>
          
        </form>
      ) : (
        <p>Loading...</p>
      )} 
      
      
    </div>
  );
};

export default EditForm;
