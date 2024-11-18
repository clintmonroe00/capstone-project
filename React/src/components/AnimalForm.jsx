import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Initial state for the form fields
const initialFormData = {
  animal_id: "",
  animal_type: "",
  breed: "",
  color: "",
  date_of_birth: "",
  date_of_outcome: "",
  name: "",
  outcome_subtype: "",
  outcome_type: "",
  sex_upon_outcome: "",
  location_lat: "",
  location_long: "",
};

const AnimalForm = ({ onSubmit }) => {
  const { id } = useParams(); 
  const [formData, setFormData] = useState(initialFormData); // State to track form data

  useEffect(() => {
    if (id) {
      // Fetch existing animal data for editing if an ID is provided
      axios
        .get(`http://localhost:8000/animals/${id}`)
        .then((response) => setFormData(response.data))
        .catch((error) => console.error("Error fetching animal data:", error));
    }
  }, [id]);

  // Handle changes in form input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Render a reusable input field component
  const renderField = (label, type = "text", name, required = false) => (
    <div className="col-md-6">
      <label className="form-label">{label}</label>
      <input
        type={type}
        name={name}
        className="form-control"
        value={formData[name]}
        onChange={handleInputChange}
        required={required}
      />
    </div>
  );

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

  // Format date fields to a consistent "YYYY-MM-DD" format
  const formattedData = {
     ...formData,
     date_of_birth: formData.date_of_birth
       ? new Date(formData.date_of_birth).toISOString().split("T")[0]
       : null,
     date_of_outcome: formData.date_of_outcome
       ? new Date(formData.date_of_outcome).toISOString().split("T")[0]
       : null,
  };

  if (onSubmit) {
    // If an external submit handler is provided, use it
    onSubmit(formattedData, id); 
  } else {
    // Default behavior: create or update the animal record via API
    const method = id ? "put" : "post";
    const url = id
      ? `http://localhost:8000/animals/${id}`
      : "http://localhost:8000/animals/";

    axios[method](url, formattedData)  // Make the API call
      .then(() => {
        alert(`Animal ${id ? "updated" : "created"} successfully!`);
        setFormData(initialFormData);  // Reset the form
      })
      .catch((error) => console.error("Error submitting form:", error));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="row g-3">
        {/* Render the form fields using the reusable renderField function */}
        {renderField("Animal ID", "text", "animal_id", true)}
        {renderField("Animal Type", "text", "animal_type", true)}
        {renderField("Breed", "text", "breed", true)}
        {renderField("Color", "text", "color", true)}
        {renderField("Date of Birth", "date", "date_of_birth", true)}
        {renderField("Date of Outcome", "date", "date_of_outcome", true)}
        {renderField("Name", "text", "name")}
        {renderField("Outcome Subtype", "text", "outcome_subtype")}
        {renderField("Outcome Type", "text", "outcome_type", true)}
        {renderField("Sex Upon Outcome", "text", "sex_upon_outcome", true)}
        {renderField("Location Latitude", "number", "location_lat", true)}
        {renderField("Location Longitude", "number", "location_long", true)}
      </div>
      <button type="submit" className="btn btn-primary mt-3">
        {/* Button label changes dynamically based on the operation (update or create) */}
        {id ? "Update Animal" : "Add Animal"}
      </button>
    </form>
  );
};

export default AnimalForm;