import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt } from "react-icons/fa";
import { searchFlights } from "../api/api";
import type { Flight } from "../types";

const airlineLogos: Record<string, string> = {
    "IndiGo": "/pic6.png",
    "Vistara": "/pic6.png",
    "Air India": "/pic5.png",
};

const SearchResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { flights = [], origin: initialOrigin, destination: initialDestination, departureDate: initialDate } = location.state || {};
    const [origin, setOrigin] = useState(initialOrigin || "");
    const [destination, setDestination] = useState(initialDestination || "");
    const [departureDate, setDepartureDate] = useState(initialDate || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [sortType, setSortType] = useState<string>("priceAsc");
    const [selectedStops, setSelectedStops] = useState<number[]>([]);
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
    const [flightList, setFlightList] = useState<Flight[]>(flights);

    const handleBook = (flightId: string) => {
        navigate(`/book/${flightId}`);
    };

    const handleSort = (flightsList: Flight[]) => {
        let sorted = [...flightsList];
        switch (sortType) {
            case "priceAsc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "earlyDeparture":
                sorted.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
                break;
        }
        return sorted;
    };

    const handleFilters = (flightsList: Flight[]) => {
        return flightsList.filter(flight => {
            // const matchesStops = selectedStops.length === 0 || selectedStops.includes(flight.stops);
            const matchesAirline = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);
            // return matchesStops && matchesAirline;
            return matchesAirline;
        });
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const results = await searchFlights(origin, destination, departureDate);
            setFlightList(results);
            console.log(results)
        } catch (err) {
            setError("Failed to fetch flights. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredAndSortedFlights = handleSort(handleFilters(flightList));

    return (
        <div className="container-fluid py-4">
            {/* Search Form */}
            <div className="bg-light p-4 rounded-4 mb-4 shadow-sm">
                <Form onSubmit={handleSearch}>
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4 col-12">
                            <div className="input-group">
                                <span className="input-group-text bg-primary text-white"><FaPlaneDeparture /></span>
                                <input
                                    type="text"
                                    className="form-control"
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
                                    className="form-control"
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
                                    className="form-control"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <Button
                                type="submit"
                                variant="warning"
                                className="w-100 fw-semibold rounded-pill py-2"
                                disabled={loading}
                            >
                                {loading ? "Searching..." : "Search Flights"}
                            </Button>
                        </div>
                    </div>
                </Form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>

            <div className="row">
                {/* FILTERS SECTION */}
                <div className="col-md-3 mb-4">
                    <h5>Filters</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Stops</Form.Label>
                        <Form.Check
                            label="Non-stop"
                            onChange={() =>
                                setSelectedStops(prev =>
                                    prev.includes(0) ? prev.filter(s => s !== 0) : [...prev, 0]
                                )
                            }
                            checked={selectedStops.includes(0)}
                        />
                        <Form.Check
                            label="1 Stop"
                            onChange={() =>
                                setSelectedStops(prev =>
                                    prev.includes(1) ? prev.filter(s => s !== 1) : [...prev, 1]
                                )
                            }
                            checked={selectedStops.includes(1)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Airlines</Form.Label>
                        {["IndiGo", "Vistara", "Air India"].map(airline => (
                            <Form.Check
                                key={airline}
                                label={airline}
                                onChange={() =>
                                    setSelectedAirlines(prev =>
                                        prev.includes(airline)
                                            ? prev.filter(a => a !== airline)
                                            : [...prev, airline]
                                    )
                                }
                                checked={selectedAirlines.includes(airline)}
                            />
                        ))}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Sort By</Form.Label>
                        <Form.Select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="earlyDeparture">Early Departure</option>
                        </Form.Select>
                    </Form.Group>
                </div>

                {/* RESULTS SECTION */}
                <div className="col-md-9">
                    <h4 className="mb-3">
                        ✈️ {origin} → {destination} |{" "}
                        <small>{new Date(departureDate).toLocaleDateString()}</small>
                    </h4>

                    {filteredAndSortedFlights.length === 0 ? (
                        <div className="alert alert-warning">No flights match selected filters.</div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {filteredAndSortedFlights.map(flight => (
                                <div
                                    key={flight.flightId}
                                    className="card shadow-sm border-0 p-3 rounded-4"
                                    style={{ borderLeft: "4px solid #0d6efd" }}
                                >
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                                        {/* Airline + Flight Info */}
                                        <div className="d-flex align-items-center gap-3 w-100 w-md-25">
                                            <img
                                                src={airlineLogos[flight.airline] || "https://via.placeholder.com/40"}
                                                alt={flight.airline}
                                                style={{ width: "40px", height: "40px", objectFit: "contain" }}
                                            />
                                            <div>
                                                <h6 className="mb-0">{flight.airline}</h6>
                                                <small className="text-muted">#{flight.flightNumber}</small>
                                            </div>
                                        </div>

                                        {/* Timings */}
                                        <div className="text-center w-100 w-md-50">
                                            <div className="d-flex justify-content-between align-items-center px-md-4">
                                                <div>
                                                    <h5 className="mb-0">
                                                        {new Date(flight.departureTime).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </h5>
                                                    <small className="text-muted">{flight.originAirportName}</small>
                                                </div>

                                                {/* <div className="text-muted">
                                                    <div>🕓</div>
                                                    <small>{flight.duration}</small>
                                                </div> */}

                                                <div>
                                                    <h5 className="mb-0">
                                                        {new Date(flight.arrivalTime).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </h5>
                                                    <small className="text-muted">{flight.destinationAirportName}</small>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price + CTA */}
                                        <div className="text-end w-100 w-md-25">
                                            <h5 className="text-primary mb-2">₹{flight.price}</h5>
                                            <Button variant="primary" size="sm" className="rounded-pill" onClick={() => handleBook(flight.flightId)}>
                                                Book Now
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResultsPage;
