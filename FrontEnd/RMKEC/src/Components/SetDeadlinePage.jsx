import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { Button } from 'react-bootstrap';

const SetDeadlinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formId, title, usersgroup } = location.state || {};

  const [deadline, setDeadline] = useState(null);
  const [userGroup, setUserGroup] = useState(usersgroup || '');
  const [newUserGroup, setNewUserGroup] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');

  useEffect(() => {
    setUserGroup(usersgroup);
  }, [usersgroup]);

  const handleDeadlineChange = (date) => {
    setDeadline(date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '');
  };

  const handleUserGroupChange = (e) => {
    setNewUserGroup(e.target.value);
  };

  const handleEmailContentChange = (e) => {
    setEmailContent(e.target.value);
  };

  const handleEmailSubjectChange = (e) => {
    setEmailSubject(e.target.value);
  };

  const handleUpdateUserGroup = async () => {
    try {
      if (!newUserGroup.trim()) {
        toast.error("No User mail entered", {
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
        return;
      }

      const updatedUserGroup = userGroup ? `${userGroup},${newUserGroup.trim()}` : newUserGroup.trim();
      const response = await axios.post('http://localhost:3000/tables/updateusergroup', {
        id: formId,
        usergroup: updatedUserGroup,
      });

      setUserGroup(updatedUserGroup);
      setNewUserGroup(''); // Clear the input after update
      toast.success(response.data.message, {
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
      toast.error(error.response?.data?.error || 'Error updating user group', {
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
      const response = await axios.post('http://localhost:3000/tables/deadline', {
        id: formId,
        deadline: deadline,
      });

      await axios.post('http://localhost:3000/mail/send', {
        to: userGroup.split(",").map(email => email.trim()).filter(email => email),
        subject: emailSubject,
        desc: emailContent,
      });

      toast.success(response.data.message, {
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

      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error setting deadline', {
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

  const userGroupList = userGroup.split(',').map(email => email.trim()).filter(email => email);

  return (
    <div className="cnt">
      <h2>Set Deadline for {title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="frm">
          <label htmlFor="deadline">Deadline:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select Deadline"
              value={deadline ? dayjs(deadline) : null}
              onChange={handleDeadlineChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="cntr"
                  id="deadline"
                  required
                />
              )}
            />
          </LocalizationProvider>
        </div>
        <div className="frm">
          <label htmlFor="usergroup">User Group:</label>
          <div id="usergroup" className="user-group-display">
            {userGroupList.length > 0 ? (
              <ul>
                {userGroupList.map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>
            ) : (
              <p>No users in the group.</p>
            )}
          </div>
        </div>
        <div className="frm">
          <label htmlFor="newUserGroup">Add/Update User Group:</label>
          <TextField
            type="text"
            id="newUserGroup"
            value={newUserGroup}
            onChange={handleUserGroupChange}
            variant="outlined"
            className="cntr"
          />
          <Button type="button" onClick={handleUpdateUserGroup} className="btt">
            Add User Mail
          </Button>
        </div>
        <div className="frm">
          <label htmlFor="emailSubject">Email Subject:</label>
          <TextField
            type="text"
            id="emailSubject"
            value={emailSubject}
            onChange={handleEmailSubjectChange}
            variant="outlined"
            className="cntr"
          />
        </div>
        <div className="frm">
          <label htmlFor="emailcontent">Email Content to Notify the User Group:</label>
          <TextField
            id="emailcontent"
            value={emailContent}
            onChange={handleEmailContentChange}
            variant="outlined"
            className="cntr"
            multiline
            rows={4}
          />
        </div>
        <div className="holder">
          <input type="submit" value="Set Deadline" className="btt" />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SetDeadlinePage;
