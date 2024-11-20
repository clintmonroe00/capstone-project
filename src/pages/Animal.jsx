import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom';
import { fetchAnimal } from '../api/animals';

const Animal = () => {
    // Use TanStack Query's useQuery hook
    const { id } = useParams();

    const { 
        isLoading,
        isError,
        data: animal,
        error,
     } = useQuery({
        queryKey: ['animals', id], // Unique key for the query
        queryFn: () => fetchAnimal(id), // Function to fetch data
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='container mt-4'>
            <h2>{animal.animal_id}</h2> {/* TESTING - CONFIRM CONTENT APPEARS ON PAGE AS EXPECTED */}
            <p>{animal.animal_type}</p>
            <p>{animal.breed}</p>
            <p>{animal.name}</p>
        </div>
    )
}

export default Animal