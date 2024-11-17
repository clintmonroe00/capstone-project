import React from 'react';
import AnimalForm from '../components/AnimalForm'; // Adjust path if necessary

function AddAnimal() {
  return (
    <div className='container mt-4'>
      <h2>Add a New Animal</h2> {/* TESTING - CONFIRM CONTENT APPEARS ON PAGE AS EXPECTED */}
      <AnimalForm />
    </div>
  );
}

export default AddAnimal;