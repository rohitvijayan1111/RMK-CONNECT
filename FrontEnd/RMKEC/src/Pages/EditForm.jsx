import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import './EditForm.css';

const EditForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { table, attributenames, item } = location.state;
  const [data, setData] = useState(item);

  const attributeTypes = {
    'completion_date': 'date',
    'Proposed Date':'date',
    'Date of completion':'date',
    'Proposed date of visit':'date',
    'Actual Date  Visited':'date',
    'Date_of_event_planned':'date',
    'Date_of_completion':'date',
    'Date planned':'date',
    'Actual Date of lecture':'date',
    'Completion Date of Event':'date',
    'Date of Interview':'date'
  };

  const notifysuccess = () => {
    toast.success('Record Edited Successfully!', {
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

  const handleDateChange = (attribute, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setData({ ...data, [attribute]: formattedDate });
  };

  const handleChange = (attribute, value) => {
    setData({ ...data, [attribute]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the date before submitting if it's a date attribute
      const formattedData = { ...data };
      for (const attribute of attributenames) {
        if (attributeTypes[attribute] === 'date' && formattedData[attribute]) {
          formattedData[attribute] = dayjs(formattedData[attribute]).format('YYYY-MM-DD');
        }
      }

      const response = await axios.put("http://localhost:3000/tables/updaterecord", {
        id: data.id,
        data: formattedData,
        table
      });
      console.log(response.data);
      notifysuccess();
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      notifyfailure(error.response.data.error || 'Error inserting record');
  };

  return (
    <div className="cnt">
      <h2>Edit Form</h2>
      {attributenames && attributenames.length > 0 ? (
        <form className='edt' onSubmit={handleSubmit}>
          {attributenames.map((attribute, index) => (
            attribute !== "id" && attribute !== "department" && (
              <div className="frm" key={index}>
                <label htmlFor={attribute} className="lbl">{attribute.replace(/_/g, ' ')}:</label>
                {attributeTypes[attribute] === 'date' ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label=''
                      value={data[attribute] ? dayjs(data[attribute]) : null}
                      onChange={(date) => handleDateChange(attribute, date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
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
                    onChange={(e) => handleChange(attribute, e.target.value)}
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
}
export default EditForm;
