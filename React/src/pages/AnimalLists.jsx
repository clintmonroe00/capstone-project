import { useQuery } from '@tanstack/react-query';
import { fetchAnimals } from '../api/animals';

const AnimalLists = () => {
    // Use TanStack Query's useQuery hook
    const { data: animals, isLoading, error } = useQuery({
        queryKey: ['animals'], // Unique key for the query
        queryFn: fetchAnimals, // Function to fetch data
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='container mt-4'>
            <h2>Animal List</h2> {/* TESTING - CONFIRM CONTENT APPEARS ON PAGE AS EXPECTED */}
            <ul>
                {animals.map((animal) => (
                    <li key={animal.rec_num}>
                        {animal.name} - {animal.animal_type}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnimalLists;