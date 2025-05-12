import { useState, useEffect } from "react";
import type { FlightRequest } from "../../../types";

interface Props {
    initialData?: FlightRequest;
    onSubmit: (data: FlightRequest) => void;
    isEdit?: boolean;
}

const FlightForm = ({ initialData, onSubmit, isEdit = false }: Props) => {
    const [formData, setFormData] = useState<FlightRequest>({
        flightNumber: "",
        departureTime: "",
        arrivalTime: "",
        originAirportId: "",
        destinationAirportId: "",
        aircraftId: "",
        price: 0,
    });

    useEffect(() => {
        if (initialData) setFormData(initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '600px' }}>
            <div className="mb-3">
                <input
                    name="flightNumber"
                    placeholder="Flight Number"
                    value={formData.flightNumber}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    name="departureTime"
                    type="datetime-local"
                    value={formData.departureTime}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    name="arrivalTime"
                    type="datetime-local"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    name="originAirportId"
                    placeholder="Origin Airport ID"
                    value={formData.originAirportId}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    name="destinationAirportId"
                    placeholder="Destination Airport ID"
                    value={formData.destinationAirportId}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    name="aircraftId"
                    placeholder="Aircraft ID"
                    value={formData.aircraftId}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="d-flex justify-content-end">
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    {isEdit ? "Update Flight" : "Add Flight"}
                </button>
            </div>
        </form>
    );
};

export default FlightForm;
