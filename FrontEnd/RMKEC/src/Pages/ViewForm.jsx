import React, { useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditForm.css';
import { ToastContainer, toast,Zoom} from 'react-toastify';
function ViewForm() {
  const navigate = useNavigate();
  const [table, setTable] = useState('');
  const [dept, setDept] = useState('');
  const [data, setData] = useState(null);
  const [attributenames, setAttributenames] = useState(null);
  const [lockedstatus,setLockedstatus]=useState('');
  const notifysuccess = () =>{
    toast.success('Signed Up Successfully!', {
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
  }
  const notifyfailure=(error)=>{
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
  }
  useEffect(() => {
    const fetchLockStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3000/tables/getlocktablestatus', {id:1,table:'form_locks'});
        setLockedstatus(response.data.is_locked);
      } catch (error) {
        console.error('Error fetching lock status:', error);
        notifyfailure(response.error.data);
      }
    };
  
    fetchLockStatus();
  }, []);
  
  const handleEdit = (attributenames, item) => {
    (lockedstatus)?alert("Form is locked."):
    navigate("/dashboard/view-form/edit-form", { state: { table, attributenames, item } }); 
  };

  const handleAdd = () => {
    (lockedstatus)?alert("Form is locked."):
    navigate("/dashboard/view-form/add-form", { state: { table, attributenames } }); 
  };
  const handleLock = async () => {
    const confirmLock = window.confirm("Are you sure you want to lock this form?");
    if (confirmLock) {
      try {
        await axios.post('http://localhost:3000/tables/locktable', {id:1,lock:!lockedstatus});
        setLockedstatus(!lockedstatus); 
      } catch (error) {
        console.error('Error locking form:', error);
        notifyfailure(response.error.data);
      }
    }
  };
  
  const handleDelete = async (id) => {
    if (lockedstatus) {
      alert("Form is locked. You cannot delete records.");
      return; 
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      try {
        await axios.delete('http://localhost:3000/tables/deleterecord', { data: { id, table } });
        setData(data.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
        notifyfailure(response.error.data);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/tables/gettable', { table, dept });
      setData(response.data);
      setAttributenames(Object.keys(response.data[0]));
    } catch (err) {
      if (err.response && err.response.data) {
        notifyfailure(err.response.data);
      } else {
        notifyfailure('Something went wrong');
      }
      setData(null);
      setAttributenames(null);
    }
  };

  return (
      <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <button type="button" onClick={handleAdd} className="btn btn-primary">Add Records</button>
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter table name"
              value={table}
              onChange={(e) => setTable(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter department"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">Fetch Data</button>
          </div>
          <div className="col">
            <button type="button" onClick={handleLock} className="btn btn-warning">{(!lockedstatus)?"Lock Form":"Unlock Form"}</button>
          </div>
        </div>
      </form>
      {data && (
        <div>
          <h2>Results:</h2>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  {attributenames && attributenames.map((name, index) => (
                    name === "id" ? <th key={index}>S.No</th> : (
                      <th key={index}>{name}</th>
                    )
                  ))}
                  <th className="fixed-column">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {attributenames.map((name, idx) => (
                        name === "id" ? 
                        <td key={idx}>{index + 1}</td> : 
                        <td key={idx}>
                {name === 'deadline' || name === 'createdAt' ? 
                  new Date(item[name]).toLocaleString('en-US', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) 
                  : 
                  item[name]}
              </td>

                    ))}
                    <td className="fixed-column">
                      <button className="btn btn-warning btn-sm mr-2" style={{ marginRight: "5px" }} onClick={() => handleEdit(attributenames, item)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
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

export default ViewForm;
