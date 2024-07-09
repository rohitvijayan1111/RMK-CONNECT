import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddOtherForm = () => {
    const [formName, setFormName] = useState('');
    const [attributes, setAttributes] = useState([]);
    const [attributeName, setAttributeName] = useState('');
    const [recordCount, setRecordCount] = useState('');
    const [attributeType, setAttributeType] = useState('text');
    const role=window.localStorage.getItem('userType');
    const notifySuccess = (msg) => {
        toast.success(msg, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Zoom,
        });
    }

    const notifyFailure = (error) => {
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

    const addAttribute = () => {
        if (attributeName) {
            setAttributes([...attributes, { name: attributeName, type: attributeType }]);
            setAttributeName('');
            setAttributeType('text');
        }
    };

    const removeAttribute = (index) => {
        const newAttributes = [...attributes];
        newAttributes.splice(index, 1);
        setAttributes(newAttributes);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/forms/getEndIndex', {});
            console.log('getEndIndex response:', response.data.end_index);
            const c = response.data.end_index;
            const newForm = {
                form_name: formName,
                possible_start_index:c+1,
                Max_index: c + 1 + parseInt(recordCount), 
                attributes: JSON.stringify(attributes)
            };
            console.log('Payload:', newForm);
            const createFormResponse = await axios.post('http://localhost:3000/forms/createformrecord', newForm);
            console.log('createformrecord response:', createFormResponse.data);
            notifySuccess('Form created successfully');
            const data= {end_index:newForm.Max_index}
            const response3 = await axios.post('http://localhost:3000/forms/updateEndIndex',data);
            console.log('getEndIndex response:', response3.data);

        } catch (error) {
            console.error('Error creating form:', error);
            if (error.response) {
                console.error('Response error:', error.response.data);
                notifyFailure(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Request error:', error.request);
                notifyFailure('No response from server');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error:', error.message);
                notifyFailure(error.message);
            }
        }
    };

    return (
        <Container>
        { role==='coordinator' ? (
            <Row>
                <Col>
                    <h1>Create Form</h1>
                    <Form>
                        <Form.Group>
                            <Form.Label>Form Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={formName} 
                                onChange={(e) => setFormName(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Number of Records</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={recordCount} 
                                onChange={(e) => setRecordCount(e.target.value)} 
                            />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Attribute Name</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={attributeName} 
                                        onChange={(e) => setAttributeName(e.target.value)} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Attribute Type</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        value={attributeType} 
                                        onChange={(e) => setAttributeType(e.target.value)}
                                    >
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="date">Date</option>
                                        <option value="boolean">Boolean</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col className="align-self-end">
                                <Button variant="primary" onClick={addAttribute}>
                                    Add Attribute
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <Table striped bordered hover style={{ marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th>Attribute Name</th>
                                <th>Attribute Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attributes.map((attribute, index) => (
                                <tr key={index}>
                                    <td>{attribute.name}</td>
                                    <td>{attribute.type}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => removeAttribute(index)}>
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button variant="success" onClick={handleSubmit} style={{ marginTop: '10px' }}>
                        Submit
                    </Button>
                    <ToastContainer />
                </Col>
            </Row>):<h1>Wrong User GO back</h1>
        }
        </Container>
    );
};

export default AddOtherForm;
