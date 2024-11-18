import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnimals } from '../api/animals';
import AnimalTable from '../components/AnimalTable';
import AnimalChart from '../components/AnimalChart';
import AnimalMap from '../components/AnimalMap';

const FILTER_PRESETS = {
    WaterRescue: {
        animalType: "Dog",
        breed: [
            "Labrador Retriever Mix", 
            "Chesapeake Bay Retriever", 
            "Newfoundland"
        ],
        sex: "Intact Female",
        minAge: 26,
        maxAge: 156,
    },
    MountainRescue: {
        animalType: "Dog",
        breed: [
            "German Shepherd",
            "Alaskan Malamute",
            "Old English Sheepdog",
            "Siberian Husky",
            "Rottweiler",
        ],
        sex: "Intact Male",
        minAge: 26,
        maxAge: 156,
    },
    DisasterRescue: {
        animalType: "Dog",
        breed: [
            "Doberman Pinscher",
            "German Shepherd",
            "Golden Retriever",
            "Bloodhound",
            "Rottweiler",
        ],
        sex: "Intact Male",
        minAge: 20,
        maxAge: 300,
    },
    Reset: {
        animalType: null,
        breed: null,
        sex: null,
        minAge: null,
        maxAge: null,
    },
};

const AnimalLists = () => {
    const [selectedFilter, setSelectedFilter] = useState("Reset"); // Default to showing all animals
    const filters = FILTER_PRESETS[selectedFilter];

    const { isLoading, isError, data: animals, error } = useQuery({
        queryKey: ["animals", filters],
        queryFn: () => fetchAnimals(filters),
        keepPreviousData: true,
    });

    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value); // Update the selected filter preset
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div className="container mt-4">
            <div className="mb-3">
                <div className="d-flex align-items-center gap-3">
                    {Object.keys(FILTER_PRESETS).map((filterKey) => (
                        <label key={filterKey} className="form-check">
                            <input
                                type="radio"
                                name="filter"
                                value={filterKey}
                                checked={selectedFilter === filterKey}
                                onChange={handleFilterChange}
                                className="form-check-input"
                            />
                            <span className="form-check-label">{filterKey}</span>
                        </label>
                    ))}
                </div>
            </div>
            {/* Pass animals data to AnimalTable */}
            <AnimalTable data={animals} />

            {/* Add new visualizations underneath AnimalTable */}
            <div className="row mt-4 align-items-center justify-content-center">
                <div className="col-md-6 d-flex justify-content-center">
                    <AnimalChart data={animals} />
                </div>

                <div className="col-md-6 d-flex justify-content-center">
                    <AnimalMap data={animals} />
                </div>
            </div>
        </div>
    );
};

export default AnimalLists;