export async function fetchAnimals() {
    const response = await fetch('http://localhost:8000/animals');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}