import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchFlights } from "../../api/api";
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt } from "react-icons/fa";

export default function FlightSearchForm() {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const results = await searchFlights(origin, destination, departureDate);
            navigate("/search-results", {
                state: {
                    flights: results,
                    origin,
                    destination,
                    departureDate,
                },
            });
        } catch (err) {
            setError("Failed to fetch flights. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="position-relative d-flex align-items-center justify-content-center text-white"
            style={{
                backgroundImage: "url('public/pic3.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh",
            }}
        >
            <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-dark opacity-50"></div>

            <div className="position-relative text-center container">
                <h1 className="display-4 fw-bold mb-4 text-shadow">Book Your Dream Flight</h1>
                <form
                    onSubmit={handleSearch}
                    className="bg-white bg-opacity-80 rounded-4 p-5 shadow-lg mx-auto"
                    style={{ maxWidth: "900px", backdropFilter: "blur(10px)" }}
                >
                    <div className="row g-3">
                        <div className="col-md-4 col-12">
                            <div className="input-group">
                                <span className="input-group-text bg-primary text-white"><FaPlaneDeparture /></span>
                                <input type="text" className="form-control form-control-lg" placeholder="Origin (e.g. DEL)" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
                            </div>
                        </div>
                        <div className="col-md-4 col-12">
                            <div className="input-group">
                                <span className="input-group-text bg-primary text-white"><FaPlaneArrival /></span>
                                <input type="text" className="form-control form-control-lg" placeholder="Destination (e.g. BOM)" value={destination} onChange={(e) => setDestination(e.target.value)} required />
                            </div>
                        </div>
                        <div className="col-md-4 col-12">
                            <div className="input-group">
                                <span className="input-group-text bg-primary text-white"><FaCalendarAlt /></span>
                                <input type="date" className="form-control form-control-lg" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-warning w-100 mt-3 fw-semibold rounded-pill py-3" disabled={loading}>
                        {loading ? "Searching..." : "Search Flights"}
                    </button>
                </form>

                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </section>
    );
}
