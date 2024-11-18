import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const AnimalChart = ({ data }) => {
    // Transform the data into a format suitable for visualization.
    // Example: Count animals by breed.
    const chartData = data.reduce((acc, animal) => {
        const breed = animal.breed || "Unknown";
        if (!acc[breed]) acc[breed] = { breed, count: 0 };
        acc[breed].count += 1;
        return acc;
    }, {});

    // Convert the object into an array for the chart
    const formattedData = Object.values(chartData);

    return (
        <div>
            <h5>Animal Distribution by Breed</h5>
            <BarChart
                width={500}
                height={300}
                data={formattedData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="breed" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </div>
    );
};

export default AnimalChart;