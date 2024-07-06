import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import DateFnsUtils from '@date-io/date-fns';
import './EditForm.css';

const AddForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { table, attributenames } = location.state;
  const [data, setData] = useState({});
  
  const handleDateTimeChange = (dateTime) => {
    const formattedDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');
    setData({ ...data, deadline: formattedDateTime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/tables/insertrecord", {
        data: { ...data },
        table
      });
      console.log(response.data);
      navigate("/dashboard/view-form");
    } catch (error) {
      window.alert("Error inserting record");
      console.error('Error inserting record:', error);
    }
  };

  return (
    <div className="cnt">
      <h2>Add Record</h2>
      {attributenames && attributenames.length > 0 ? (
        <form className='edt' onSubmit={handleSubmit}>
          {attributenames.map((attribute, index) => (
            attribute !== "id" && attribute !== "createdAt" && (
              <div className="frm" key={index}>
                <label htmlFor={attribute} className="lbl">{attribute}:</label>
                {attribute === "deadline" ? (
                  <MobileDateTimePicker
                    value={data[attribute] ? new Date(data[attribute]) : null}
                    onChange={handleDateTimeChange}
                    renderInput={(params) => (
                      <input
                        {...params}
                        type="text"
                        className="cntr"
                        id={attribute}
                      />
                    )}
                  />
                ) : (
                  <input
                    type="text"
                    className="cntr"
                    id={attribute}
                    onChange={(e) => setData({ ...data, [attribute]: e.target.value })}
                    value={data[attribute] || ''}
                  />
                )}
              </div>
            )
          ))}
          <div className="holder">
            <input type='submit' value="Submit" className='btt'/>
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AddForm;
