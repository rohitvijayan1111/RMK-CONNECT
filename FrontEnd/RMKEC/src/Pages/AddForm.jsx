import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditForm.css';

const AddForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { table, attributenames } = location.state;
  const [data, setData] = useState({});
  
  const attributeTypes = {
    completion_date: 'date', 

  };

  const notifysuccess = () => {
    toast.success('Added Record Successfully!', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
  };

  const notifyfailure = (error) => {
    toast.error(error, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
  };

  const handleDateTimeChange = (attribute, dateTime) => {
    const formattedDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');
    setData({ ...data, [attribute]: formattedDateTime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/tables/insertrecord", {
        data: { ...data },
        table
      });
      console.log(response.data);
      notifysuccess();
      setTimeout(() => {
        navigate("/dashboard/view-form");
      }, 1500);
    } catch (error) {
      notifyfailure('Error inserting record:');
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
                <label htmlFor={attribute} className="lbl">{attribute.replace(/_/g, ' ')}:</label>
                {attributeTypes[attribute] === 'date' ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDateTimePicker
                      value={data[attribute] ? new Date(data[attribute]) : null}
                      onChange={(date) => handleDateTimeChange(attribute, date)}
                      renderInput={(params) => (
                        <input
                          {...params}
                          type="text"
                          className="cntr"
                          id={attribute}
                          required
                        />
                      )}
                    />
                  </LocalizationProvider>
                ) : (
                  <input
                    type="text"
                    className="cntr"
                    id={attribute}
                    onChange={(e) => setData({ ...data, [attribute]: e.target.value })}
                    value={data[attribute] || ''}
                    required
                  />
                )}
              </div>
            )
          ))}
          <div className="holder">
            <input type='submit' value="Submit" className='btt' />
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default AddForm;
