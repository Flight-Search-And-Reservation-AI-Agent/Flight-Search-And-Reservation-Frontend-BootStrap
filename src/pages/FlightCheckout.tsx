import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { FlightRequest } from '../types';
import { bookReservation, getFlightById } from '../api/api';

type PassengerInput = {
    name: string;
    age: string;
    gender: string;
};

const FlightCheckoutPage: React.FC = () => {
    const { flightId } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [flight, setFlight] = useState<FlightRequest | null>(null);
    const [passengers, setPassengers] = useState<PassengerInput[]>([
        { name: '', age: '', gender: '' },
    ]);

    useEffect(() => {
        if (flightId) {
            getFlightById(flightId).then(setFlight).catch(console.error);
        }
    }, [flightId]);

    const handlePassengerChange = (
        index: number,
        field: keyof PassengerInput,
        value: string
    ) => {
        const updated = [...passengers];
        updated[index][field] = value;
        setPassengers(updated);
    };

    const addPassenger = () => {
        setPassengers([...passengers, { name: '', age: '', gender: '' }]);
    };

    const handleConfirmBooking = async () => {
        if (!userId || !flightId) return alert('Please log in to book a flight.');

        try {
            const formattedPassengers = passengers.map((p) => ({
                name: p.name,
                age: Number(p.age),
                gender: p.gender,
            }));

            await bookReservation(flightId, userId, formattedPassengers);
            navigate('/reservationPage');
        } catch (error) {
            alert('Booking failed');
            console.error(error);
        }
    };
    console.log(userId)

    // If user is not logged in, show prompt to log in
    if (!userId) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">
                    <h5>Please log in to continue</h5>
                    <p>You need to be logged in to book a flight.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // If user is logged in, show booking UI
    return (
        <div className="container mt-4">
            <h3>Flight Summary</h3>
            {flight ? (
                <div className="card p-3 mb-4">
                    <p><strong>{flight.flightNumber}</strong> - {flight.aircraft.airline}</p>
                    <p>{flight.origin.name} → {flight.destination.name}</p>
                    <p>Departure: {new Date(flight.departureTime).toLocaleString()}</p>
                    <p>Arrival: {new Date(flight.arrivalTime).toLocaleString()}</p>
                    <p>Price: {flight.price}</p>
                </div>
            ) : (
                <p>Loading flight...</p>
            )}

            <h4>Passenger Details</h4>
            {passengers.map((p, idx) => (
                <div key={idx} className="row mb-2">
                    <div className="col-md-4">
                        <input
                            className="form-control"
                            placeholder="Name"
                            value={p.name}
                            onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            className="form-control"
                            placeholder="Age"
                            type="number"
                            value={p.age}
                            onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={p.gender}
                            onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                </div>
            ))}

            <button className="btn btn-link" onClick={addPassenger}>+ Add Passenger</button>
            <br />
            <button className="btn btn-primary mt-3" onClick={handleConfirmBooking}>
                Confirm Booking
            </button>
        </div>
    );
};

export default FlightCheckoutPage;
