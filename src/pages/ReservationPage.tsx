import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { cancelReservation, fetchUserReservations } from "../api/api";
import type { Reservation } from "../types";

export default function UserReservationPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filtered, setFiltered] = useState<Reservation[]>([]);
    const [flightIdFilter, setFlightIdFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Fetch reservations on load
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.error("User ID not found in localStorage");
            return;
        }

        fetchUserReservations(userId)
            .then((data) => {
                setReservations(data);
                setFiltered(data);
            })
            .catch((err) => {
                console.error("Error fetching reservations", err);
            });
    }, []);

    // Filter when filters change
    useEffect(() => {
        handleFilterChange();
    }, [flightIdFilter, statusFilter, reservations]);

    const handleFilterChange = () => {
        let updated = [...reservations];

        if (flightIdFilter) {
            updated = updated.filter((res) =>
                res.flight.flightNumber.toLowerCase().includes(flightIdFilter.toLowerCase())
            );
        }

        if (statusFilter) {
            updated = updated.filter((res) => res.status === statusFilter);
        }

        setFiltered(updated);
    };

    const handleCancelReservation = async (id: string) => {
        if (!confirm) return;

        try {
            await cancelReservation(id);

            const updateFn = (list: Reservation[]) =>
                list.map((r) =>
                    r.reservationId === id ? { ...r, status: "CANCELLED" as "CANCELLED" } : r
                );

            setReservations((prev) => updateFn(prev));
            setFiltered((prev) => updateFn(prev));
        } catch (error) {
            console.error("Error cancelling reservation:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="fw-bold text-center mb-4">My Reservations</h3>

            {/* Filter Form */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Flight Number"
                        value={flightIdFilter}
                        onChange={(e) => setFlightIdFilter(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="BOOKED">BOOKED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </div>
            </div>

            {/* Reservations Table */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Flight Number</th>
                            <th>Departure Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center">
                                    No reservations found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((reservation) => (
                                <tr key={reservation.reservationId}>
                                    <td>{reservation.flight.flightNumber}</td>
                                    <td>{new Date(reservation.flight.departureTime).toLocaleString()}</td>
                                    <td>
                                        <span
                                            className={`badge bg-${reservation.status === "BOOKED"
                                                ? "success"
                                                : "secondary"
                                                }`}
                                        >
                                            {reservation.status}
                                        </span>
                                    </td>
                                    <td>
                                        {reservation.status === "BOOKED" && (
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleCancelReservation(reservation.reservationId)}
                                            >
                                                <FaTrashAlt /> Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
