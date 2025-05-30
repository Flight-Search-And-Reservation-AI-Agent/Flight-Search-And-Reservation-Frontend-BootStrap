import { useEffect, useState } from 'react';
import {
    getAllReservations,
    createReservation,
    updateReservation,
    cancelReservation,
} from "../../api/api";
import type { Reservation, ReservationRequest } from '../../types';

const Reservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>('all');
    const [selectedFlightId, setSelectedFlightId] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const [form, setForm] = useState<ReservationRequest>({
        userId: '',
        flightId: '',
        passengers: [],
        status: 'CONFIRMED',
    });
    const [editId, setEditId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const data = await getAllReservations();
                setReservations(data);
                setFilteredReservations(data);
            } catch (error) {
                console.error('Failed to fetch reservations:', error);
            }
        };
        fetchReservations();
    }, []);

    useEffect(() => {
        let filtered = reservations;

        if (selectedUserId !== 'all') {
            filtered = filtered.filter(r => r.user.userId === selectedUserId);
        }
        if (selectedFlightId !== 'all') {
            filtered = filtered.filter(r => r.flight.flightId === selectedFlightId);
        }
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(r => r.status === selectedStatus);
        }

        setFilteredReservations(filtered);
    }, [selectedUserId, selectedFlightId, selectedStatus, reservations]);

    const uniqueUsers = Array.from(
        new Map(reservations.map(r => [r.user.userId, r.user])).values()
    );
    const uniqueFlights = Array.from(
        new Map(reservations.map(r => [r.flight.flightId, r.flight])).values()
    );

    const handleSubmit = async () => {
        if (!form.userId || !form.flightId) {
            alert('User ID and Flight ID are required');
            return;
        }

        try {
            if (editId) {
                const updated = await updateReservation(editId, form);
                setReservations(prev =>
                    prev.map(r => r.reservationId === editId ? { ...r, ...updated } : r)
                );
            } else {
                const created = await createReservation(form);
                setReservations(prev => [...prev, created]);
            }

            setForm({ userId: '', flightId: '', passengers: [], status: 'CONFIRMED' });
            setEditId(null);
            setShowForm(false);
        } catch (err) {
            console.error('Submit failed', err);
        }
    };

    const handleEdit = (r: Reservation) => {
        setForm({
            userId: r.user.userId,
            flightId: r.flight.flightId,
            passengers: r.passengers,
            status: r.status,
        });
        setEditId(r.reservationId);
        setShowForm(true);
    };

    const handleCancel = async (id: string) => {
        const confirm = window.confirm('Are you sure you want to cancel this reservation?');
        if (!confirm) return;

        try {
            await cancelReservation(id);
            setReservations(prev =>
                prev.map(r =>
                    r.reservationId === id ? { ...r, status: 'CANCELLED' } : r
                )
            );
        } catch (error) {
            console.error('Error cancelling reservation:', error);
        }
    };

    const handlePassengerChange = (index: number, field: string, value: any) => {
        const updatedPassengers = [...form.passengers];
        updatedPassengers[index] = {
            ...updatedPassengers[index],
            [field]: value,
        };
        setForm(f => ({ ...f, passengers: updatedPassengers }));
    };

    const addPassenger = () => {
        setForm(f => ({
            ...f,
            passengers: [...f.passengers, { name: '', age: 0, gender: 'MALE' }],
        }));
    };

    const removePassenger = (index: number) => {
        const updatedPassengers = [...form.passengers];
        updatedPassengers.splice(index, 1);
        setForm(f => ({ ...f, passengers: updatedPassengers }));
    };

    return (
        <div className="container py-5">
            <h2 className="h3 mb-4">Reservations</h2>

            <button
                className="btn btn-primary mb-4"
                onClick={() => {
                    setForm({ userId: '', flightId: '', passengers: [], status: 'CONFIRMED' });
                    setEditId(null);
                    setShowForm(true);
                }}
            >
                Create Reservation
            </button>

            {/* Filters */}
            <div className="d-flex flex-wrap gap-4 mb-4">
                <div className="w-25">
                    <label className="form-label">Filter by User:</label>
                    <select
                        className="form-select"
                        value={selectedUserId}
                        onChange={e => setSelectedUserId(e.target.value)}
                    >
                        <option value="all">All</option>
                        {uniqueUsers.map(user => (
                            <option key={user.userId} value={user.userId}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-25">
                    <label className="form-label">Filter by Flight:</label>
                    <select
                        className="form-select"
                        value={selectedFlightId}
                        onChange={e => setSelectedFlightId(e.target.value)}
                    >
                        <option value="all">All</option>
                        {uniqueFlights.map(flight => (
                            <option key={flight.flightId} value={flight.flightId}>
                                {flight.flightNumber}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-25">
                    <label className="form-label">Filter by Status:</label>
                    <select
                        className="form-select"
                        value={selectedStatus}
                        onChange={e => setSelectedStatus(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>Reservation ID</th>
                        <th>Username</th>
                        <th>Flight Number</th>
                        <th>Passengers</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReservations.map(r => (
                        <tr key={r.reservationId}>
                            <td>{r.reservationId}</td>
                            <td>{r.user.username}</td>
                            <td>{r.flight.flightNumber}</td>
                            <td>
                                {r.passengers.map((p, idx) => (
                                    <div key={idx}>
                                        {p.name} ({p.gender}, {p.age})
                                    </div>
                                ))}
                            </td>
                            <td>
                                <span
                                    className={`badge ${r.status === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}
                                >
                                    {r.status}
                                </span>
                            </td>
                            <td>{new Date(r.reservationTime).toLocaleString()}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => handleEdit(r)}
                                >
                                    Edit
                                </button>
                                {r.status === 'CONFIRMED' && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleCancel(r.reservationId)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Create/Edit Form Modal */}
            {showForm && (
                <div className="modal show d-block" tabIndex={-1} style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editId ? 'Edit Reservation' : 'Create Reservation'}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowForm(false)}
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">User ID</label>
                                    <input
                                        className="form-control"
                                        placeholder="User ID"
                                        value={form.userId}
                                        onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Flight ID</label>
                                    <input
                                        className="form-control"
                                        placeholder="Flight ID"
                                        value={form.flightId}
                                        onChange={e => setForm(f => ({ ...f, flightId: e.target.value }))}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Passengers</label>
                                    {form.passengers.map((p, index) => (
                                        <div key={index} className="d-flex gap-2 mb-2 align-items-center">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Name"
                                                value={p.name}
                                                onChange={e => handlePassengerChange(index, 'name', e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Age"
                                                value={p.age}
                                                onChange={e => handlePassengerChange(index, 'age', Number(e.target.value))}
                                            />
                                            <select
                                                className="form-select"
                                                value={p.gender}
                                                onChange={e => handlePassengerChange(index, 'gender', e.target.value)}
                                            >
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => removePassenger(index)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                    <button className="btn btn-outline-primary" onClick={addPassenger}>
                                        Add Passenger
                                    </button>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        value={form.status}
                                        onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                                    >
                                        <option value="CONFIRMED">CONFIRMED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowForm(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                >
                                    {editId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reservations;
