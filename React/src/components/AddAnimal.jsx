import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnimal } from '../api/animals'
import AnimalForm from './AnimalForm'

const AddAnimal = () => {
    const queryClient = useQueryClient();

    // Set up a mutation for creating a new animal
    const createAnimalMutation = useMutation({
        mutationFn: createAnimal,
        onSuccess: () => {
            // Invalidate the animals query to ensure fresh data is fetched
            queryClient.invalidateQueries({ queryKey: ['animals'] })
            console.log("Success!")
        }
    });

    // Handler for adding a new animal
    const handleAddAnimal = (animal) => {
        createAnimalMutation.mutate({
            ...animal
        })
    }

    return (
        <div>
            {/* Render the AnimalForm component and pass the handleAddAnimal function as the onSubmit handler */}
            <AnimalForm onSubmit={handleAddAnimal}/>
        </div>
    )
}

export default AddAnimal;