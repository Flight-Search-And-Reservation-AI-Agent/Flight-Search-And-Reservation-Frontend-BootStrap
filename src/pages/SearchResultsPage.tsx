import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt } from "react-icons/fa";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

import { searchFlights, getAllAirports } from "../api/api";
import type { Flight, Airport } from "../types";

const airlineLogos: Record<string, string> = {
    "IndiGo": "/pic6.png",
    "Vistara": "/pic5.png",
    "Air India": "/pic5.png",
};

const PAGE_SIZE = 10;

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

    // New filters
    const [priceMin, setPriceMin] = useState<number | "">("");
    const [priceMax, setPriceMax] = useState<number | "">("");
    const [depTimeStart, setDepTimeStart] = useState<string>("00:00"); // HH:mm
    const [depTimeEnd, setDepTimeEnd] = useState<string>("23:59");
    const [durationMin, setDurationMin] = useState<number | "">("");
    const [durationMax, setDurationMax] = useState<number | "">("");

    // Pagination states
    const [allFlights, setAllFlights] = useState<Flight[]>(flights);
    const [page, setPage] = useState(1);

    // Fetch airports on mount for typeahead
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

    // Reset flights and page on new search results
    useEffect(() => {
        setAllFlights(flights);
        setPage(1);
        setSelectedAirlines([]); // optionally reset filters on new search
        // Reset other filters too if you want
        setPriceMin("");
        setPriceMax("");
        setDepTimeStart("00:00");
        setDepTimeEnd("23:59");
        setDurationMin("");
        setDurationMax("");
    }, [flights]);

    // Get unique airlines from current allFlights to build dynamic filters
    const uniqueAirlines = useMemo(() => {
        const setAirlines = new Set<string>();
        allFlights.forEach((f) => setAirlines.add(f.airline));
        return Array.from(setAirlines).sort();
    }, [allFlights]);

    // Helper: Convert time string "HH:mm" to minutes from midnight
    const timeToMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    // Filter flights based on all selected filters
    const filteredFlights = useMemo(() => {
        return allFlights.filter((flight) => {
            // Airline filter
            if (
                selectedAirlines.length > 0 &&
                !selectedAirlines.includes(flight.airline)
            ) {
                return false;
            }

            // Price filter
            if (priceMin !== "" && flight.price < priceMin) return false;
            if (priceMax !== "" && flight.price > priceMax) return false;

            // Departure time filter (time of day)
            const depTime = new Date(flight.departureTime);
            const depMinutes = depTime.getHours() * 60 + depTime.getMinutes();
            const startMinutes = timeToMinutes(depTimeStart);
            const endMinutes = timeToMinutes(depTimeEnd);

            // Handle overnight range (e.g. 22:00 - 06:00)
            if (startMinutes <= endMinutes) {
                if (depMinutes < startMinutes || depMinutes > endMinutes) return false;
            } else {
                // Overnight wrap
                if (depMinutes > endMinutes && depMinutes < startMinutes) return false;
            }

            // Duration filter (in minutes)
            const arrivalTime = new Date(flight.arrivalTime);
            const durationMinutes = (arrivalTime.getTime() - depTime.getTime()) / 60000;
            if (durationMin !== "" && durationMinutes < durationMin) return false;
            if (durationMax !== "" && durationMinutes > durationMax) return false;

            return true;
        });
    }, [
        allFlights,
        selectedAirlines,
        priceMin,
        priceMax,
        depTimeStart,
        depTimeEnd,
        durationMin,
        durationMax,
    ]);

    // Sort flights based on sortType
    const sortedFlights = useMemo(() => {
        const sorted = [...filteredFlights];
        switch (sortType) {
            case "priceAsc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "priceDesc":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "earlyDeparture":
                sorted.sort(
                    (a, b) =>
                        new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
                );
                break;
            case "durationAsc":
                sorted.sort((a, b) => {
                    const durA =
                        new Date(a.arrivalTime).getTime() - new Date(a.departureTime).getTime();
                    const durB =
                        new Date(b.arrivalTime).getTime() - new Date(b.departureTime).getTime();
                    return durA - durB;
                });
                break;
            case "durationDesc":
                sorted.sort((a, b) => {
                    const durA =
                        new Date(a.arrivalTime).getTime() - new Date(a.departureTime).getTime();
                    const durB =
                        new Date(b.arrivalTime).getTime() - new Date(b.departureTime).getTime();
                    return durB - durA;
                });
                break;
            default:
                break;
        }
        return sorted;
    }, [filteredFlights, sortType]);

    // Pagination slice
    const displayedFlights = useMemo(() => {
        return sortedFlights.slice(0, page * PAGE_SIZE);
    }, [sortedFlights, page]);

    // Infinite scroll handler to load more flights
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 200
            ) {
                if (displayedFlights.length < sortedFlights.length) {
                    setPage((prev) => prev + 1);
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [displayedFlights.length, sortedFlights.length]);

    // Search form submission
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
            setAllFlights(results);
            setPage(1);
            navigate("/search-results", {
                replace: true,
                state: { flights: results, origin, destination, departureDate },
            });
        } catch {
            setError("Failed to fetch flights. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
                                                {airport.city}, {airport.country} ({airport.code})
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
                                                {airport.city}, {airport.country} ({airport.code})
                                            </div>
                                        );
                                    }}
                                    clearButton
                                />
                            </div>
                        </div>
                        <div className="col-md-3 col-12">
                            <div className="input-group">
                                <span className="input-group-text bg-primary text-white">
                                    <FaCalendarAlt />
                                </span>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-1 col-12">
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100"
                                disabled={loading}
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>

            {/* Filters and Sort */}
            <div className="row mb-4">
                <div className="col-lg-3 col-md-4 col-12">
                    <div className="card shadow-sm p-3">
                        <h5 className="mb-3">Filters</h5>

                        {/* Airlines checkbox multi-select */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Airlines</label>
                            <div className="d-flex flex-wrap gap-2">
                                {uniqueAirlines.map((airline) => (
                                    <div className="form-check" key={airline}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={airline}
                                            id={`airline-${airline}`}
                                            checked={selectedAirlines.includes(airline)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedAirlines([...selectedAirlines, airline]);
                                                } else {
                                                    setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
                                                }
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor={`airline-${airline}`}>
                                            {airline}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price range */}
                        <div className="mb-3">
                            <label className="form-label">Price Range</label>
                            <div className="d-flex gap-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Min"
                                    value={priceMin}
                                    min={0}
                                    onChange={(e) =>
                                        setPriceMin(e.target.value === "" ? "" : +e.target.value)
                                    }
                                />
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Max"
                                    value={priceMax}
                                    min={0}
                                    onChange={(e) =>
                                        setPriceMax(e.target.value === "" ? "" : +e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Departure time range */}
                        <div className="mb-3">
                            <label className="form-label">Departure Time Range</label>
                            <div className="d-flex gap-2">
                                <input
                                    type="time"
                                    className="form-control"
                                    value={depTimeStart}
                                    onChange={(e) => setDepTimeStart(e.target.value)}
                                />
                                <input
                                    type="time"
                                    className="form-control"
                                    value={depTimeEnd}
                                    onChange={(e) => setDepTimeEnd(e.target.value)}
                                />
                            </div>
                            <small className="text-muted">
                                e.g. 22:00 - 06:00 covers late night to early morning
                            </small>
                        </div>

                        {/* Duration range */}
                        <div className="mb-3">
                            <label className="form-label">Duration Range (minutes)</label>
                            <div className="d-flex gap-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Min"
                                    min={0}
                                    value={durationMin}
                                    onChange={(e) =>
                                        setDurationMin(e.target.value === "" ? "" : +e.target.value)
                                    }
                                />
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Max"
                                    min={0}
                                    value={durationMax}
                                    onChange={(e) =>
                                        setDurationMax(e.target.value === "" ? "" : +e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Sort options */}
                        <div>
                            <label htmlFor="sortType" className="form-label">
                                Sort By
                            </label>
                            <select
                                id="sortType"
                                className="form-select"
                                value={sortType}
                                onChange={(e) => setSortType(e.target.value)}
                            >
                                <option value="priceAsc">Price: Low to High</option>
                                <option value="priceDesc">Price: High to Low</option>
                                <option value="earlyDeparture">Departure Time: Earliest</option>
                                <option value="durationAsc">Duration: Shortest</option>
                                <option value="durationDesc">Duration: Longest</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Flights List */}
                <div className="col-lg-9 col-md-8 col-12">
                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading && <div className="text-center mb-3">Loading flights...</div>}

                    {displayedFlights.length === 0 && !loading && (
                        <div className="text-center my-5 text-muted">No flights found.</div>
                    )}

                    <div className="row gy-3">
                        {displayedFlights.map((flight) => {
                            const durationMinutes =
                                (new Date(flight.arrivalTime).getTime() -
                                    new Date(flight.departureTime).getTime()) /
                                60000;

                            return (
                                <div
                                    key={flight.flightId}
                                    className="col-12"
                                    onClick={() => navigate(`/checkout/${flight.flightId}`, { state: { flight } })}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="card shadow-sm h-100">
                                        <div className="row g-0 align-items-center">
                                            <div className="col-md-2 col-3 text-center p-2">
                                                <img
                                                    src={airlineLogos[flight.airline] || "/default-airline.png"}
                                                    alt={flight.airline}
                                                    style={{ maxWidth: "80px" }}
                                                    className="img-fluid"
                                                />
                                                <div className="small mt-1">{flight.airline}</div>
                                            </div>
                                            <div className="col-md-7 col-9 p-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <strong>
                                                            {flight.originAirportName} &rarr; {flight.destinationAirportName}
                                                        </strong>
                                                        <br />
                                                        <small className="text-muted">
                                                            {new Date(flight.departureTime).toLocaleString()} &ndash;{" "}
                                                            {new Date(flight.arrivalTime).toLocaleString()}
                                                        </small>
                                                    </div>
                                                    <div className="text-end">
                                                        <div>
                                                            Duration: {Math.floor(durationMinutes / 60)}h{" "}
                                                            {Math.floor(durationMinutes % 60)}m
                                                        </div>
                                                        <div className="fs-5 fw-bold text-primary">
                                                            ₹{flight.price.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 d-none d-md-block text-center p-2">
                                                <Button
                                                    className="btn w-50  fw-semibold "
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // prevent triggering the navigate on card click
                                                        navigate(`/checkout/${flight.flightId}`);
                                                    }}
                                                >
                                                    Book
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Loading more indicator */}
                    {displayedFlights.length < sortedFlights.length && (
                        <div className="text-center my-3">Loading more flights...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResultsPage;
