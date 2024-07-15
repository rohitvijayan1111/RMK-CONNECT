import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditForm.css';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

function Clubactivities() {
  const navigate = useNavigate();
  const [table] = useState('DepartmentalClubs'); // Hardcoded table name
  const [dept, setDept] = useState(window.localStorage.getItem('department')); // If you want to use department filtering
  const [data, setData] = useState([]);
  const [attributenames, setAttributenames] = useState([]);
  const [lockedstatus, setLockedstatus] = useState('');

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

  useEffect(() => {
    const fetchLockStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3000/tables/getlocktablestatus', { id: 1, table: 'form_locks' });
        setLockedstatus(response.data.is_locked);
      } catch (error) {
        console.error('Error fetching lock status:', error);
        notifyfailure(error.response.data);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/tables/gettable', { table: 'DepartmentalClubs', department: dept });
        setData(response.data.data);
        setAttributenames(response.data.columnNames);
      } catch (err) {
        if (err.response && err.response.data) {
          notifyfailure(err.response.data);
        } else {
          notifyfailure('Something went wrong');
        }
        setData([]);
        setAttributenames([]);
      }
    };

    fetchLockStatus();
    fetchData();
  }, [dept]);

  const handleEdit = (attributenames, item) => {
    if (lockedstatus) {
      toast.error('Form is locked. You cannot edit records.', {
        position: "top-center",
        autoClose: 4000,
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
    navigate("/dashboard/view-form/edit-form", { state: { table, attributenames, item } });
  };

  const handleAdd = () => {
    if (lockedstatus) {
      toast.error('Form is locked. You cannot add records.', {
        position: "top-center",
        autoClose: 4000,
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
    navigate("/dashboard/view-form/add-form", { state: { table, attributenames } });
  };

  const handleLock = async () => {
    Swal.fire({
      title: 'Do you want to change the lock status of this form?',
      showCancelButton: true,
      confirmButtonText: lockedstatus ? 'Unlock' : 'Lock',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('http://localhost:3000/tables/locktable', { id: 2, lock: !lockedstatus });
          setLockedstatus(!lockedstatus);
          Swal.fire(`${lockedstatus ? 'Unlocked' : 'Locked'}!`, '', 'success');
        } catch (error) {
          console.error('Error locking form:', error);
          notifyfailure(error.response.data);
          Swal.fire('Error!', 'There was an error changing the lock status', 'error');
        }
      }
    });
  };

  const handleDelete = async (id) => {
    if (lockedstatus) {
      toast.error('Form is locked. You cannot delete records.', {
        position: "top-center",
        autoClose: 4000,
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

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete('http://localhost:3000/tables/deleterecord', { data: { id, table } });
          setData(data.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "Your record has been deleted.", "success");
        } catch (error) {
          console.error('Error deleting item:', error);
          notifyfailure(error.response.data);
          Swal.fire('Error!', 'There was an error deleting the record', 'error');
        }
      }
    });
  };

  const formatColumnName = (name) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col">
          <button type="button" onClick={handleAdd} className="btn btn-primary">Add Records</button>
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Enter department"
            value={dept}
            readOnly
          />
        </div>
        <div className="col">
          <button type="button" onClick={handleLock} className="btn btn-warning">{(!lockedstatus) ? "Lock Form" : "Unlock Form"}</button>
        </div>
      </div>
      {data && (
        <div>
          <h2>Results:</h2>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  {attributenames && attributenames.map((name, index) => (
                    name === "id" ? <th key={index}>S.No</th> : (
                      <th key={index}>{formatColumnName(name)}</th>
                    )
                  ))}
                  <th className="fixed-column">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {attributenames.map((name, attrIndex) => (
                      name === "id" ? <td key={attrIndex}>{index + 1}</td> : (
                        <td key={attrIndex}>{item[name]}</td>
                      )
                    ))}
                    <td>
                      <button type="button" className="btn btn-info mr-2" onClick={() => handleEdit(attributenames, item)}>Edit</button>
                      <button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Clubactivities;
