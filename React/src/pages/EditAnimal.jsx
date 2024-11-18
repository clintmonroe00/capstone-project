import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchAnimal } from '../api/animals';
import AnimalForm from '../components/AnimalForm'

const EditAnimal = () => {
    const { id } = useParams(); 

    // Fetch animal data using the useQuery hook
    const { 
        isLoading,
        isError,
        data: animal,
        error,
     } = useQuery({
        queryKey: ['animals', id], 
        queryFn: () => fetchAnimal(id), 
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
            {/* Render the AnimalForm component with the fetched animal data */}
            <AnimalForm initialValue={animal}/>
        </div>
    )
}

export default EditAnimal