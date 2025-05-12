import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteFlightById, getAllFlights } from "../../api/api";
import type { Flight } from "../../types";

const Flights = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const navigate = useNavigate();

    const fetchFlights = async () => {
        try {
            const data = await getAllFlights();
            setFlights(data);
        }
        catch (error) {
            console.error("Failed to fetch flights:", error);
        }
    }

    useEffect(() => {
        fetchFlights();
    }, []);

    const handleDelete = async (flightId: string) => {
        if (confirm("Are you want to delete this flight?")) {
            try {
                await deleteFlightById(flightId);
                setFlights((prev) => prev.filter((flight) => flight.flightId !== flightId));
            }
            catch (error) {
                console.error("Failed to delete flight:", error);
            }
        }
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-dark">Flights Management</h2>
                <button onClick={() => navigate("/admin/flights/add")} className="btn btn-primary">
                    + Add Flight
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-light">
                        <tr>
                            <th>Flight Number</th>
                            <th>Departure</th>
                            <th>Arrival</th>
                            <th>Departure Time</th>
                            <th>Arrival Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((flight) => (
                            <tr key={flight.flightId}>
                                <td>{flight.flightNumber}</td>
                                <td>{flight.originAirportName}</td>
                                <td>{flight.destinationAirportName}</td>
                                <td>{new Date(flight.departureTime).toLocaleString()}</td>
                                <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/admin/flights/edit/${flight.flightId}`)}
                                        className="btn btn-link text-primary">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(flight.flightId)}
                                        className="btn btn-link text-danger">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Flights;
