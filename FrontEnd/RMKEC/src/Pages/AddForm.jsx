import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditForm.css';
import dayjs from 'dayjs';
import { getTokenData } from './authUtils';
const AddForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tokendata=getTokenData();
  const { table, attributenames,attributeTypes,formId} = location.state;
  const [data, setData] = useState({ department: tokendata.department });
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  
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

  const handleDateChange = (attribute, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setData({ ...data, [attribute]: formattedDate });
  };



  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleFileReset = () => {
    setFile(null);
    setFileInputKey(Date.now()); 
    setData((prevData) => ({
      ...prevData,
      document: 'No file selected' 
    }));
  };
  
  const removeEmailFromNotSubmitted = async (formId, email) => {
    try {
      const response = await axios.post('http://localhost:3000/tables/remove-email', {
        formId,
        email
      });
  
      // Handle successful response
      console.log('Response:', response.data);
      toast.success('Email removed successfully', {
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
    } catch (error) {
      // Handle error
      console.error('Error removing email:', error.response?.data || error.message);
      toast.error('Error removing email', {
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('table', table);
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (file) {
        console.log("File exists");
        formData.append('file', file);
      }
      const response = await axios.post("http://localhost:3000/tables/insertrecord", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      removeEmailFromNotSubmitted(formId,tokendata.email);
      notifysuccess();
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      notifyfailure(error.response.data.error || 'Error inserting record');
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
      <h2>Add Record</h2>
      {attributenames && attributenames.length > 0 ? (
        <form className='edt' onSubmit={handleSubmit}>
          {attributenames.map((attribute, index) => (
            attribute !== "id" && attribute !== "department" && attribute !== "createdAt" &&(
              <div className="frm" key={index}>
                <label htmlFor={attribute} className="lbl">{attribute.replace(/_/g, ' ')}:</label>
                {attributeTypes[attribute] === 'date' ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={data[attribute] ? dayjs(data[attribute]) : null}
                      onChange={(date) => handleDateChange(attribute, date)}
                      renderInput={(params) => (
                        <input
                          {...params.inputProps}
                          type="text"
                          className="cntr"
                          id={attribute}
                          required
                        />
                      )}
                    />
                  </LocalizationProvider>
                ) : attributeTypes[attribute] === 'file' ? (
                  <div>

                    <div className="file-upload-container">
                      <input
                        type="text"
                        className="cntr"
                        value={data[attribute] || 'No file selected'}
                        readOnly
                      />
                    </div>
                    <div className='bttns'>
                      <label htmlFor={attribute}  className="custom-file-upload">
                        Choose File
                      </label>
                      <button type="button" className="custom-file-upload" onClick={handleFileReset}>Reset File</button>
                    </div>
                    <input
                      type="file"
                      id={attribute}
                      className="custom-file-upload"
                      onChange={(e) => {
                        handleFileChange(e);
                        setData((prevData) => ({ ...prevData, [attribute]: e.target.files[0].name }));
                      }}
                      key={fileInputKey}
                      style={{ display: 'none' }}
                      required
                    />
                  </div>
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
                ):attributeTypes[attribute] === 'Percentage_of_Higher_Studies' ?( 
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

                ):attributeTypes[attribute] === 'company_details' ?( 
                  <>
                  <div className='company'>
                  <input
                    type="text"
                    className="cmp"
                    id={attribute}
                    onChange={(e) => handleChange(attribute, e.target.value)}
                    value={data[attribute] || ''}
                    required
                  />
                  <input
                    type="text"
                    className="cmp"
                    id={attribute}
                    onChange={(e) => handleChange(attribute, e.target.value)}
                    value={data[attribute] || ''}
                    required
                  />
                  <input
                    type="text"
                    className="cmp"
                    id={attribute}
                    onChange={(e) => handleChange(attribute, e.target.value)}
                    value={data[attribute] || ''}
                    required
                  />
                  </div>
                  <button className='cmp-btt'>
                    ADD
                  </button>
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

export default AddForm;
