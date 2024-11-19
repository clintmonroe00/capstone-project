import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Initial state for the form fields
const initialFormData = {
  animal_id: '',
  animal_type: '',
  breed: '',
  color: '',
  date_of_birth: '',
  date_of_outcome: '',
  name: '',
  outcome_subtype: '',
  outcome_type: '',
  sex_upon_outcome: '',
  location_lat: '',
  location_long: '',
};

const AnimalForm = ({ onSubmit }) => {
  const { id } = useParams(); 
  const navigate = useNavigate(); //
  const [formData, setFormData] = useState(initialFormData); // State to track form data
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/animals/${id}`)
        .then((response) => {
          const sanitizedData = Object.fromEntries(
            Object.entries(response.data).map(([key, value]) => [key, value ?? ''])
          );
          setFormData(sanitizedData);
        })
        .catch((error) => console.error('Error fetching animal data:', error));
    }
  }, [id]);

  // Handle changes in form input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors({ ...errors, [name]: null});
  };

  // Render a reusable input field component
  const renderField = (label, type = 'text', name, required = false) => (
    <div className='col-md-6'>
      <label className='form-label'>{label}</label>
      <input
        type={type}
        name={name}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`} // Add is-invalid class if there's an error
        value={formData[name] ?? ''} // Use an empty string if the value is null
        onChange={handleInputChange}
        required={required}
      />
      {errors[name] && <div className='invalid-feedback'>{errors[name]}</div>} {/* Display error message */}
    </div>
  );

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

  // Format date fields to a consistent 'YYYY-MM-DD' format
  const formattedData = {
     ...formData,
     date_of_birth: formData.date_of_birth
       ? new Date(formData.date_of_birth).toISOString().split('T')[0]
       : null,
     date_of_outcome: formData.date_of_outcome
       ? new Date(formData.date_of_outcome).toISOString().split('T')[0]
       : null,
  };

  if (onSubmit) {
    // If an external submit handler is provided, use it
    onSubmit(formattedData, id); 
  } else {
    // Default behavior: create or update the animal record via API
    const method = id ? 'put' : 'post';
    const url = id
      ? `http://localhost:8000/animals/${id}`
      : 'http://localhost:8000/animals/';

    axios[method](url, formattedData)  // Make the API call
      .then(() => {
        alert(`Animal ${id ? 'updated' : 'created'} successfully!`);
        setFormData(initialFormData);  // Reset the form
        navigate('/');
      })
      // .catch((error) => console.error('Error submitting form:', error));
      .catch((error) => {
        if (error.response) {
          // Handle validation errors
          if (error.response.status === 422) {
            const errorDetails = error.response.data.detail;
            const validationErrors = {};
            errorDetails.forEach((err) => {
              const field = err.loc[1];          // Extract the field name from 'loc'
              validationErrors[field] = err.msg; // Mapp error messages
            });
            setErrors(validationErrors);         // Update the errors state
          } else {
            // Handle other types of errors
            alert('An error occured while submitting the form.');
            console.error('Error:', error.response.data);
          }
        } else {
          // Handle network errors or unexpected errors
          alert('Unable to connect to the server. Please try again later.');
          console.error('Network or unexpected error:', error);
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='container mt-4'>
      <div className='row g-3'>
        {/* Render the form fields using the reusable renderField function */}
        {renderField('Animal ID', 'text', 'animal_id', true)}
        {renderField('Animal Type', 'text', 'animal_type', true)}
        {renderField('Breed', 'text', 'breed', true)}
        {renderField('Color', 'text', 'color', true)}
        {renderField('Date of Birth', 'date', 'date_of_birth', true)}
        {renderField('Date of Outcome', 'date', 'date_of_outcome', true)}
        {renderField('Name', 'text', 'name')}
        {renderField('Outcome Subtype', 'text', 'outcome_subtype')}
        {renderField('Outcome Type', 'text', 'outcome_type', true)}
        {renderField('Sex Upon Outcome', 'text', 'sex_upon_outcome', true)}
        {renderField('Location Latitude', 'number', 'location_lat', true)}
        {renderField('Location Longitude', 'number', 'location_long', true)}
      </div>
      <button type='submit' className='btn btn-primary mt-3'>
        {/* Button label changes dynamically based on the operation (update or create) */}
        {id ? 'Update Animal' : 'Add Animal'}
      </button>
    </form>
  );
};

export default AnimalForm;