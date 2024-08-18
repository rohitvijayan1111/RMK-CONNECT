import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import { getTokenData } from '../Pages/authUtils';

const OtherForms = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [lockedStatus, setLockedStatus] = useState({});
    const tokendata=getTokenData();
    const role = tokendata.role;
    
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

    const handleAdd = () => {
        navigate("create-form");
    };

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.post('http://localhost:3000/forms/getformlist', {});
                const formsData = response.data;
                setForms(formsData);
                const initialLockStatus = formsData.reduce((acc, form) => {
                    acc[form.id] = form.is_locked;
                    return acc;
                }, {});
                setLockedStatus(initialLockStatus);
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };

        fetchForms();
    }, []);
    const handleLock = async (formId) => {
        Swal.fire({
            title: 'Do you want to change the lock status of this form?',
            showCancelButton: true,
            confirmButtonText: lockedStatus[formId] ? 'Unlock' : 'Lock',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post('http://localhost:3000/tables/locktable', { id: formId, lock: !lockedStatus[formId] });
                    setLockedStatus(prevState => ({ ...prevState, [formId]: !lockedStatus[formId] }));
                    Swal.fire(`${lockedStatus[formId] ? 'Unlocked' : 'Locked'}!`, '', 'success');
                } catch (error) {
                    console.error('Error locking form:', error);
                    Swal.fire('Error!', 'There was an error changing the lock status', 'error');
                }
            }
        });
    };

   function handleView(form){
    navigate("form-records", { state: { form: form} });
   }

    return (
        <Container>
                <h1>Form List</h1>
                {role === 'IQAC' && (
                    <Button type="button" onClick={handleAdd} className="btn btn-primary">Add Form</Button>
                )}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Form Title</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {forms.map((form, index) => (
                        <tr key={form.id}>
                            <td>{index + 1}</td>
                            <td>{form.form_title}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleView(form)}>View</Button>
                                {' '}
                                {role === 'IQAC'&& (
                                    <Button variant="danger" onClick={() => handleLock(form.id)}>
                                        {lockedStatus[form.id] ? 'Unlock Form' : 'Lock Form'}
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ToastContainer />
        </Container>
    );
};

export default OtherForms;
