import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFlightById, updateFlightById } from "../../../api/api";
import FlightForm from "./FlightForm";
import type { FlightRequest } from "../../../types";

const EditFlight = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<FlightRequest | null>(null);

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const data = await getFlightById(id!);
                setInitialData(data);
            } catch (error) {
                console.error("Error fetching flight", error);
            }
        };
        fetchFlight();
    }, [id]);

    const handleUpdate = async (data: FlightRequest) => {
        try {
            await updateFlightById(id!, data);
            navigate("/admin/flights");
        } catch (error) {
            console.error("Failed to update flight", error);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-dark mb-4">Edit Flight</h2>
            {initialData ? (
                <FlightForm initialData={initialData} onSubmit={handleUpdate} isEdit />
            ) : (
                <p className="text-muted">Loading...</p>
            )}
        </div>
    );
};

export default EditFlight;
