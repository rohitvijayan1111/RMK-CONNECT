import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    'Proposed Date': 'date',
    'Date of completion': 'date',
    'Proposed date of visit': 'date',
    'Actual Date  Visited': 'date',
    'Date_of_event_planned': 'date',
    'Date_of_completion': 'date',
    'Date planned': 'date',
    'Actual Date of lecture': 'date',
    'Completion Date of Event': 'date',
    'Date of Interview': 'date',
    'start_date': 'date',
    'end_date': 'date',
    'joining_date':'date'
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

      const response = await axios.post("http://localhost:3000/tables/updaterecord", {
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
      notifyfailure(error.response?.data?.error || 'Error inserting record');
    }
  };
  const handleChange = (attribute, value) => {
    setData(prevData => {
      const newData = { ...prevData, [attribute]: value };
      if (attribute === 'No_of_Students_Registered_for_Placement' || attribute === 'No_of_Students_Placed') {
        const totalStudents = parseFloat(newData['No_of_Students_Registered_for_Placement']);
        const placedStudents = parseFloat(newData['No_of_Students_Placed']);
        if (totalStudents && placedStudents) {
          newData['Placement_Percentage'] = ((placedStudents / totalStudents) * 100).toFixed(2);
        } else {
          newData['Placement_Percentage'] = '0.00';
        }
      }
      if (attribute === 'No_of_Students_Opted_for_Higher_Studies' || attribute === 'No_of_Students_Admitted_to_Higher_Studies') {
        const totalStudents = parseFloat(newData['No_of_Students_Opted_for_Higher_Studies']);
        const placedStudents = parseFloat(newData['No_of_Students_Admitted_to_Higher_Studies']);
        if (totalStudents && placedStudents) {
          newData['Percentage_of_Higher_Studies'] = ((placedStudents / totalStudents) * 100).toFixed(2);
        } else {
          newData['Percentage_of_Higher_Studies'] = '0.00';
        }
      }

      return newData;
    });
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
                ) : attributeTypes[attribute] === 'Placement_Percentage' ?( 
                  <>
                  <input
                      type="text"
                      className="cntr"
                      id={attribute}
                      onChange={(e) => setData({ ...data, [attribute]: (data[No_of_Students_Placed]/data[Total_No_of_Students])/100 })}
                      value={data[attribute]  || ''}
                      readOnly
                      required
                    />
                  </>
                ): attributeTypes[attribute] === 'Percentage_of_Higher_Studies' ?( 
                  <>
                  <input
                      type="text"
                      className="cntr"
                      id={attribute}
                      onChange={(e) => setData({ ...data, [attribute]: (data[No_of_Students_Admitted_to_Higher_Studies]/data[No_of_Students_Opted_for_Higher_Studies])/100  })}
                      value={data[attribute] || ''}
                      readOnly
                      required
                    />
                  </>

                ): (
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

export default EditForm;