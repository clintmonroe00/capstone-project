import { useQuery } from '@tanstack/react-query';
import { fetchAnimals } from '../api/animals';
import AnimalTable from '../components/AnimalTable';

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
        <div className="container mt-4">
            <h2>Animal Table WIP</h2>
            {/* Pass animals data to AnimalTable */}
            <AnimalTable data={animals} />
        </div>
    );
};

export default AnimalLists;