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
  const [file, setFile] = useState(null);
  const [oldFileName, setOldFileName] = useState(item.document);

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
    'document': 'file',
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

  const handleChange = (attribute, value) => {
    setData({ ...data, [attribute]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setData({ ...data, document: selectedFile.name }); // Update document name in data
  };

  const handleReset = async () => {
    try {
      // Delete the file from the server if it exists
      if (oldFileName) {
        await axios.delete(`http://localhost:3000/tables/deletefile/${oldFileName}`);
      }
      setFile(null);
      setData({ ...item, document: '' }); // Reset form data to original item state
      setOldFileName(item.document); // Reset oldFileName state to original document name
    } catch (error) {
      console.error('Error deleting file:', error);
      notifyfailure('Error deleting file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = { ...data };
      for (const attribute of attributenames) {
        if (attributeTypes[attribute] === 'date' && formattedData[attribute]) {
          formattedData[attribute] = dayjs(formattedData[attribute]).format('YYYY-MM-DD');
        }
      }
      const formData = new FormData();
      formData.append('table', table);
      Object.entries(formattedData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (file) {
        formData.append('file', file);
      }
      const response = await axios.post("http://localhost:3000/tables/updaterecord", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      notifysuccess();
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      notifyfailure(error.response.data.error || 'Error updating record');
    }
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
                ) : attributeTypes[attribute] === 'file' ? (
                  <div className="file-upload">
                    <input
                      type="text"
                      className="cntr"
                      id={attribute}
                      value={data.document || ''}
                      readOnly
                    />
                    <input
                      type="file"
                      className="file-input"
                      onChange={handleFileChange}
                    />
                    <button type="button" className="reset-button" onClick={handleReset}>
                      Reset
                    </button>
                  </div>
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

export default EditForm;
