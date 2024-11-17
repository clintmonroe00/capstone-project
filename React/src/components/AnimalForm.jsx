import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

const fetchAnimal = async (id) => {
  const { data } = await axios.get(`http://localhost:8000/animals/${id}`);
  return data;
};

const updateAnimal = async ({ id, data }) => {
  return axios.put(`http://localhost:8000/animals/${id}`, data);
};

const createAnimal = async (data) => {
  return axios.post('http://localhost:8000/animals/', data);
};

const AnimalForm = () => {
  const { id } = useParams(); // Get the animal ID from the URL (for editing)
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialFormData);

  // Fetch data if editing an existing animal
  useQuery({
    queryKey: ['animal', id],
    queryFn: () => fetchAnimal(id),
    enabled: !!id, // Only fetch if ID is provided
    onSuccess: (data) => setFormData(data),
    onError: (error) => console.error('Error fetching animal data:', error),
  });

  // Mutations for create and update
  const createMutation = useMutation({
    mutationFn: createAnimal,
    onSuccess: () => {
      alert('Animal created successfully!');
      queryClient.invalidateQueries(['animals']); // Refresh animal list
      setFormData(initialFormData); // Reset form
    },
    onError: (error) => console.error('Error creating animal:', error),
  });

  const updateMutation = useMutation({
    mutationFn: updateAnimal,
    onSuccess: () => {
      alert('Animal updated successfully!');
      queryClient.invalidateQueries(['animal', id]); // Refresh specific animal data
    },
    onError: (error) => console.error('Error updating animal:', error),
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      date_of_birth: formData.date_of_birth
        ? new Date(formData.date_of_birth).toISOString().split('T')[0]
        : null,
      date_of_outcome: formData.date_of_outcome
        ? new Date(formData.date_of_outcome).toISOString().split('T')[0]
        : null,
    };

    if (id) {
      updateMutation.mutate({ id, data: formattedData });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='container mt-4'>
      <div className='row g-3'>
        <div className='col-md-6'>
          <label className='form-label'>Animal ID</label>
          <input
            type='text'
            name='animal_id'
            className = 'form-control'
            value={formData.animal_id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='col-md-6'>
          <label>Animal Type</label>
          <input
            type='text'
            name='animal_type'
            className = 'form-control'
            value={formData.animal_type}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='col-md-6'>
          <label>Breed</label>
          <input
            type='text'
            name='breed'
            className = 'form-control'
            value={formData.breed}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='col-md-6'>
          <label>Color</label>
          <input
            type='text'
            name='color'
            className = 'form-control'
            value={formData.color}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='col-md-6'>
          <label>Date of Birth</label>
          <input
            type='date'
            name='date_of_birth'
            className = 'form-control'
            value={formData.date_of_birth}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='col-md-6'>
          <label>Date of Outcome</label>
          <input
            type='date'
            name='date_of_outcome'
            className = 'form-control'
            value={formData.date_of_outcome}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='col-md-6'>
          <label>Name</label>
          <input
            type='text'
            name='name'
            className = 'form-control'
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className='col-md-6'>
          <label>Outcome Subtype</label>
          <input
            type='text'
            name='outcome_subtype'
            className = 'form-control'
            value={formData.outcome_subtype}
            onChange={handleInputChange}
          />
        </div>
        <div className='col-md-6'>
          <label>Outcome Type</label>
          <input
            type='text'
            name='outcome_type'
            className = 'form-control'
            value={formData.outcome_type}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='col-md-6'>
          <label>Sex Upon Outcome</label>
          <input
            type='text'
            name='sex_upon_outcome'
            className = 'form-control'
            value={formData.sex_upon_outcome}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='col-md-6'>
          <label>Location Latitude</label>
          <input
            type='number'
            step='0.000001'
            name='location_lat'
            className = 'form-control'
            value={formData.location_lat}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='col-md-6'>
          <label>Location Longitude</label>
          <input
            type='number'
            step='0.000001'
            name='location_long'
            className = 'form-control'
            value={formData.location_long}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <button type='submit' className='btn btn-primary mt-3'>
        {id ? 'Update Animal' : 'Add Animal'}
      </button>
    </form>
  );
};

export default AnimalForm;