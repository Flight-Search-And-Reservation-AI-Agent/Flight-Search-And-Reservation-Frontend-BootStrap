import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchFlights, getAllAirports } from "../../api/api";
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt } from "react-icons/fa";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import type { Airport } from "../../types";



export default function FlightSearchForm() {
    const [origin, setOrigin] = useState<string | null>(null);
    const [destination, setDestination] = useState<string | null>(null);
    const [departureDate, setDepartureDate] = useState("");
    const [airportOptions, setAirportOptions] = useState<Airport[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const data = await getAllAirports(); // API call
                setAirportOptions(data);
            } catch {
                setError("Failed to load airport data.");
            }
        };
        fetchAirports();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!origin || !destination) {
            setError("Please select both origin and destination.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const results = await searchFlights(origin, destination, departureDate);
            navigate("/search-results", {
                state: { flights: results, origin, destination, departureDate },
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
                backgroundImage: "url('/pic3.jpg')",
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
                                <Typeahead
                                    id="origin-typeahead"
                                    labelKey="city"
                                    options={airportOptions}
                                    onChange={(selected) => setOrigin((selected[0] as Airport)?.code ?? null)}
                                    placeholder="Origin City"
                                    renderMenuItemChildren={(option, _props, index) => {
                                        const airport = option as Airport;
                                        return (
                                            <div key={index}>
                                                {airport.city}, {airport.country} <small className="text-muted">({airport.code})</small>
                                            </div>
                                        );
                                    }}
                                />

                            </div>
                        </div>
                        <div className="col-md-4 col-12">
                            <div className="input-group">
                                <span className="input-group-text bg-primary text-white"><FaPlaneArrival /></span>
                                <Typeahead
                                    id="destination-typeahead"
                                    labelKey="city"
                                    options={airportOptions}
                                    onChange={(selected) => setDestination((selected[0] as Airport)?.code ?? null)}
                                    placeholder="Destination City"
                                    renderMenuItemChildren={(option, _props, index) => {
                                        const airport = option as Airport;
                                        return (
                                            <div key={index}>
                                                {airport.city}, {airport.country} <small className="text-muted">({airport.code})</small>
                                            </div>
                                        );
                                    }}
                                />


                            </div>
                        </div>
                        <div className="col-md-4 col-12">
                            <div className="input-group">
                                <span className="input-group-text bg-primary text-white"><FaCalendarAlt /></span>
                                <input
                                    type="date"
                                    className="form-control form-control-lg"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    required
                                />
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
