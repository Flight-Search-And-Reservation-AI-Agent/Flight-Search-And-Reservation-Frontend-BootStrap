import { useState } from "react";
import type { Flight } from "../../types";
import { searchFlights } from "../../api/api";
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt } from "react-icons/fa"; // Icons for inputs

export default function FlightSearchForm() {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const results = await searchFlights(origin, destination, departureDate);
            setFlights(results);
        } catch (err: any) {
            setError("Failed to fetch flights. Please try again.");
            setFlights([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section
                className="position-relative d-flex align-items-center justify-content-center text-white"
                style={{
                    backgroundImage: "url('src/assets/pic3.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100vh",
                }}
            >
                <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-dark opacity-50"></div>

                <div className="position-relative text-center container">
                    <h1 className="display-4 fw-bold mb-4 text-shadow">Book Your Dream Flight</h1>

                    {/* Form */}
                    <form
                        onSubmit={handleSearch}
                        className="bg-white bg-opacity-80 rounded-4 p-5 shadow-lg mx-auto"
                        style={{
                            maxWidth: "900px",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <div className="row g-3">
                            <div className="col-md-4 col-12">
                                <div className="input-group">
                                    <span className="input-group-text bg-primary text-white"><FaPlaneDeparture /></span>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg p-3 border-0 rounded-3 shadow-sm focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="Origin (e.g. DEL)"
                                        value={origin}
                                        onChange={(e) => setOrigin(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-12">
                                <div className="input-group">
                                    <span className="input-group-text bg-primary text-white"><FaPlaneArrival /></span>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg p-3 border-0 rounded-3 shadow-sm focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="Destination (e.g. BOM)"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-12">
                                <div className="input-group">
                                    <span className="input-group-text bg-primary text-white"><FaCalendarAlt /></span>
                                    <input
                                        type="date"
                                        className="form-control form-control-lg p-3 border-0 rounded-3 shadow-sm focus:ring-2 focus:ring-primary transition-all"
                                        value={departureDate}
                                        onChange={(e) => setDepartureDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-warning w-100 mt-3 fw-semibold rounded-pill py-3 text-uppercase shadow-lg transition-all hover:bg-yellow-500 hover:scale-105"
                            disabled={loading}
                            style={{ minWidth: "150px" }}
                        >
                            {loading ? "Searching..." : "Search Flights"}
                        </button>
                    </form>
                </div>
            </section>

            {/* Error */}
            {error && (
                <div className="alert alert-danger mt-4 text-center">{error}</div>
            )}

            {/* Results */}
            {flights.length > 0 && (
                <div className="container my-5">
                    <h3 className="fw-bold mb-4 text-center">Available Flights</h3>
                    <div className="row g-4">
                        {flights.map((flight, index) => (
                            <div
                                key={index}
                                className="col-md-6 col-lg-4 animate__animated animate__fadeInUp"
                                style={{ animationDelay: `${index * 0.2}s`, animationFillMode: "both" }}
                            >
                                <div className="card h-100 shadow-lg border-0 rounded-3">
                                    <div className="card-body">
                                        <h5 className="card-title mb-2 fw-semibold">
                                            {flight.flightNumber}
                                        </h5>
                                        <p className="mb-1">
                                            <strong>{flight.originAirportId}</strong> →{" "}
                                            <strong>{flight.destinationAirportId}</strong>
                                        </p>
                                        <p className="mb-1">
                                            Departure:{" "}
                                            {new Date(
                                                flight.departureTime
                                            ).toLocaleString()}
                                        </p>
                                        <p className="mb-1">
                                            Arrival:{" "}
                                            {new Date(
                                                flight.arrivalTime
                                            ).toLocaleString()}
                                        </p>
                                        <p className="mb-1">
                                            Aircraft: {flight.aircraftId}
                                        </p>
                                        <p className="fw-bold text-success">
                                            ₹{flight.price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
