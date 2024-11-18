// Fetch the list of all animals from the backend API
export async function fetchAnimals() {
    const response = await fetch('http://localhost:8000/animals');
    if (!response.ok) {
        throw new Error('Network response was not ok');
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