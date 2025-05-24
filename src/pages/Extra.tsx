import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt } from "react-icons/fa";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

import { searchFlights, getAllAirports } from "../api/api";
import type { Flight, Airport } from "../types";
// import BookButton from "./BookButton";

const airlineLogos: Record<string, string> = {
    "IndiGo": "/pic6.png",
    "Vistara": "/pic6.png",
    "Air India": "/pic5.png",
};

const SearchResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        flights = [],
        origin: initialOrigin,
        destination: initialDestination,
        departureDate: initialDate,
    } = location.state || {};

    // Search form states
    const [origin, setOrigin] = useState<string | null>(initialOrigin || null);
    const [destination, setDestination] = useState<string | null>(
        initialDestination || null
    );
    const [departureDate, setDepartureDate] = useState(initialDate || "");
    const [airportOptions, setAirportOptions] = useState<Airport[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Filters and sorting states
    const [sortType, setSortType] = useState<string>("priceAsc");
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
    const [flightList, setFlightList] = useState<Flight[]>(flights);

    // Fetch airports on mount for the typeahead fields
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const data = await getAllAirports();
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
            setFlightList(results);
            // Also update location state (optional)
            navigate("/search-results", {
                replace: true,
                state: { flights: results, origin, destination, departureDate },
            });
        } catch (err) {
            setError("Failed to fetch flights. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (flightsList: Flight[]) => {
        let sorted = [...flightsList];
        switch (sortType) {
            case "priceAsc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "earlyDeparture":
                sorted.sort(
                    (a, b) =>
                        new Date(a.departureTime).getTime() -
                        new Date(b.departureTime).getTime()
                );
                break;
        }
        return sorted;
    };

    const handleFilters = (flightsList: Flight[]) => {
        return flightsList.filter((flight) => {
            const matchesAirline =
                selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);
            return matchesAirline;
        });
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
                                <span className="input-group-text bg-primary text-white">
                                    <FaPlaneDeparture />
                                </span>
                                <Typeahead
                                    id="origin-typeahead"
                                    labelKey="city"
                                    options={airportOptions}
                                    onChange={(selected) =>
                                        setOrigin((selected[0] as Airport)?.code ?? null)
                                    }
                                    placeholder="Origin City"
                                    selected={
                                        origin
                                            ? airportOptions.filter((a) => a.code === origin)
                                            : []
                                    }
                                    renderMenuItemChildren={(option, _props, index) => {
                                        const airport = option as Airport;
                                        return (
                                            <div key={index}>
                                                {airport.city}, {airport.country}{" "}
                                                <small className="text-muted">({airport.code})</small>
                                            </div>
                                        );
                                    }}
                                    clearButton
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-12">
                            <div className="input-group">
                                <span className="input-group-text bg-primary text-white">
                                    <FaPlaneArrival />
                                </span>
                                <Typeahead
                                    id="destination-typeahead"
                                    labelKey="city"
                                    options={airportOptions}
                                    onChange={(selected) =>
                                        setDestination((selected[0] as Airport)?.code ?? null)
                                    }
                                    placeholder="Destination City"
                                    selected={
                                        destination
                                            ? airportOptions.filter((a) => a.code === destination)
                                            : []
                                    }
                                    renderMenuItemChildren={(option, _props, index) => {
                                        const airport = option as Airport;
                                        return (
                                            <div key={index}>
                                                {airport.city}, {airport.country}{" "}
                                                <small className="text-muted">({airport.code})</small>
                                            </div>
                                        );
                                    }}
                                    clearButton
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-12">
                            <div className="input-group">
                                <span className="input-group-text bg-primary text-white">
                                    <FaCalendarAlt />
                                </span>
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
                        <Form.Label>Airlines</Form.Label>
                        {["IndiGo", "Vistara", "Air India"].map((airline) => (
                            <Form.Check
                                key={airline}
                                label={airline}
                                onChange={() =>
                                    setSelectedAirlines((prev) =>
                                        prev.includes(airline)
                                            ? prev.filter((a) => a !== airline)
                                            : [...prev, airline]
                                    )
                                }
                                checked={selectedAirlines.includes(airline)}
                            />
                        ))}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Sort By</Form.Label>
                        <Form.Select
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                        >
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="earlyDeparture">Early Departure</option>
                        </Form.Select>
                    </Form.Group>
                </div>

                {/* RESULTS SECTION */}
                <div className="col-md-9">
                    <h4 className="mb-3">
                        ✈️ {origin || "Origin"} → {destination || "Destination"} |{" "}
                        <small>
                            {departureDate
                                ? new Date(departureDate).toLocaleDateString()
                                : "Date"}
                        </small>
                    </h4>

                    {filteredAndSortedFlights.length === 0 ? (
                        <div className="alert alert-warning">
                            No flights match selected filters.
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {filteredAndSortedFlights.map((flight) => (
                                <div
                                    key={flight.flightId}
                                    className="card shadow-sm border-0 p-3 rounded-4"
                                    style={{ borderLeft: "4px solid #0d6efd" }}
                                >
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                                        {/* Airline + Flight Info */}
                                        <div className="d-flex align-items-center gap-3 w-100 w-md-25">
                                            <img
                                                src={
                                                    airlineLogos[flight.airline] ||
                                                    "https://via.placeholder.com/40"
                                                }
                                                alt={flight.airline}
                                                style={{ width: 40, height: 40 }}
                                            />
                                            <div>
                                                <h6 className="mb-1">{flight.airline}</h6>
                                                <p className="mb-0 text-muted">{flight.flightNumber}</p>
                                            </div>
                                        </div>

                                        {/* Departure */}
                                        <div className="text-center w-100 w-md-25">
                                            <div>
                                                <FaPlaneDeparture />
                                                <span className="fw-bold ms-1">{flight.originAirportName}</span>
                                            </div>
                                            <small className="text-muted">
                                                {new Date(flight.departureTime).toLocaleString()}
                                            </small>
                                        </div>

                                        {/* Arrival */}
                                        <div className="text-center w-100 w-md-25">
                                            <div>
                                                <FaPlaneArrival />
                                                <span className="fw-bold ms-1">{flight.destinationAirportName}</span>
                                            </div>
                                            <small className="text-muted">
                                                {new Date(flight.arrivalTime).toLocaleString()}
                                            </small>
                                        </div>

                                        {/* Price + Book button */}
                                        <div className="d-flex flex-column align-items-center gap-2 w-100 w-md-25">
                                            <div className="fs-5 fw-bold text-primary">
                                                ₹{flight.price}
                                            </div>

                                            <button
                                                className="btn btn-success"
                                                onClick={() => navigate(`/checkout/${flight.flightId}`)}
                                            >
                                                Book Now
                                            </button>


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
