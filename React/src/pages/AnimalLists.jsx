// TEST PAGE, CAN REMOVE BEFORE PUBLISHING

import { useQuery } from '@tanstack/react-query';
import { fetchAnimals } from '../api/animals';

const AnimalLists = () => {
    // Fetch animal data with TanStack Query's useQuery hook
    const { 
        isLoading,
        isError,
        data: animals,
        error,
     } = useQuery({
        queryKey: ['animals'], 
        queryFn: fetchAnimals, 
    });

    // Show a loading indicator while the data is being fetched
    if (isLoading) {
        return <div>Loading...</div>;
    }
    // Display an error message if the query fails
    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='container mt-4'>
            <h2>Animal List</h2> {/* TESTING - CONFIRM CONTENT APPEARS ON PAGE AS EXPECTED */}
            <ul>
                {/* Map through the list of animals and render each as a list item */}
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