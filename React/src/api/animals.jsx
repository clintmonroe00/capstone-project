// Fetch the list of all animals from the backend API
export async function fetchAnimals({ animalType, breed, sex, minAge, maxAge }) {
    const params = new URLSearchParams();
    if (animalType) params.append("animal_type", animalType);
    if (breed && breed.length > 0) breed.forEach((b) => params.append("breed", b));
    if (sex) params.append("sex_upon_outcome", sex);
    if (minAge !== null) params.append("min_age", minAge);
    if (maxAge !== null) params.append("max_age", maxAge);

    const response = await fetch(`http://localhost:8000/animals?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

// Fetch a specific animal by its ID from the backend API
export async function fetchAnimal(id) {
    const response = await fetch(`http://localhost:8000/animals/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

// Create a new animal record in the backend database
export async function createAnimal(newAnimal) {
    const response = await fetch(`http://localhost:8000/animals/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newAnimal)
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

// Delete a specific animal by its ID
export async function deleteAnimal(id) {
    const response = await fetch(`http://localhost:8000/animals/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete the animal.");
    }
    return response.json(); 
}