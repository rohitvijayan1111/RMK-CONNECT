import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';

const Guestlecture = () => {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.post('http://localhost:3000/forms/getformlist',{});
                setForms(response.data); 
            } catch (error) {
                console.error('Error fetching forms:', error);
                
            }
        };

        fetchForms();
    }, []);

    const handleViewForm = (formId) => {
        
    };

    const handleLockForm = (formId) => {
        
        console.log(`Lock form with ID ${formId}`);
        
    };

    return (
        <Container>
            <h1>Form List</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Form Title</th>
                        <th>Date of Creation</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {forms.map((form) => (
                        <tr key={form.id}>
                            <td>{form.form_name}</td>
                            <td>{form.created_at}</td> 
                            <td>
                                <Button variant="primary" onClick={() => handleViewForm(form.id)}>View</Button>
                                {' '}
                                <Button variant="secondary" onClick={() => handleLockForm(form.id)}>Lock Form</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Guestlecture;
