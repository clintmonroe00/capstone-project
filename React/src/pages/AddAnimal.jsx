import React from 'react';
import AnimalForm from '../components/AnimalForm'; 

function AddAnimal() {
  return (
    <div className='container mt-4'>
      {/* Render the AnimalForm component inside a container */}
      <AnimalForm />
    </div>
  );
}

export default AddAnimal;