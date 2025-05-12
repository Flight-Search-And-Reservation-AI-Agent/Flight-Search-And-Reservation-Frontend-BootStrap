import { useState } from "react";
import { FaSearch, FaRegEdit, FaTrashAlt } from "react-icons/fa";

export default function UserReservationPage() {
    // Sample mock data for user's reservations
    const [reservations, setReservations] = useState([
        {
            id: "1",
            userId: "U123",
            flightNumber: "AI202",
            departureTime: "2025-05-20T10:00:00",
            status: "Pending",
        },
        {
            id: "2",
            userId: "U123", // Same userId for all, as it's user-specific
            flightNumber: "AI303",
            departureTime: "2025-05-22T14:30:00",
            status: "Confirmed",
        },
        {
            id: "3",
            userId: "U123",
            flightNumber: "AI404",
            departureTime: "2025-05-23T09:15:00",
            status: "Cancelled",
        },
    ]);

    // Simulate a user with a specific `userId`
    const currentUser = "U123";  // This would be dynamically set based on the logged-in user

    // Filter reservations for the current user
    const userReservations = reservations.filter((res) => res.userId === currentUser);

    const handleCancelReservation = (id: string) => {
        const updatedReservations = reservations.map((res) =>
            res.id === id ? { ...res, status: "Cancelled" } : res
        );
        setReservations(updatedReservations);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setReservations([...reservations]); // Reset or apply filters here
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="container mt-4">
            <h3 className="fw-bold text-center mb-4">My Reservations</h3>

            {/* Filter Form */}
            <form onSubmit={handleSearch} className="row g-3 mb-4">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Flight Number"
                        name="flightId"
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        name="status"
                        onChange={handleFilterChange}
                    >
                        <option value="">All Statuses</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <button type="submit" className="btn btn-primary w-100">
                        <FaSearch /> Search
                    </button>
                </div>
            </form>

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
                        {userReservations.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center">
                                    No reservations found.
                                </td>
                            </tr>
                        ) : (
                            userReservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.flightNumber}</td>
                                    <td>{new Date(reservation.departureTime).toLocaleString()}</td>
                                    <td>
                                        <span
                                            className={`badge bg-${reservation.status === "Confirmed" ? "success" : reservation.status === "Pending" ? "warning" : "danger"}`}
                                        >
                                            {reservation.status}
                                        </span>
                                    </td>
                                    <td>
                                        {/* Actions for the user */}
                                        {reservation.status === "Confirmed" && (
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleCancelReservation(reservation.id)}
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
