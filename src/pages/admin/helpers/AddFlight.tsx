import { useNavigate } from "react-router-dom";
import { createFlight } from "../../../api/api";
import type { FlightRequest } from "../../../types";
import FlightForm from "./FlightForm";

const AddFlight = () => {
    const navigate = useNavigate();

    const handleAdd = async (data: FlightRequest) => {
        try {
            await createFlight(data);
            navigate("/admin/flights");
        } catch (err) {
            console.error("Failed to add flight:", err);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-dark mb-4">Add New Flight</h2>
            <FlightForm onSubmit={handleAdd} />
        </div>
    );
};

export default AddFlight;
