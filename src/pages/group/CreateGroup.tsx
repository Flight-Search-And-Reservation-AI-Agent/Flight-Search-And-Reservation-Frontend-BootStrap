import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGroup: React.FC = () => {
    const [name, setName] = useState('');
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // You'd normally send this to backend
        alert(`Group Created: ${name}`);
        navigate('/dashboard/groups'); // or wherever your dashboard is
    };

    return (
        <div className="container mt-5">
            <h3>Create New Group</h3>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label className="form-label">Group Name</label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Destination</label>
                    <input type="text" className="form-control" value={destination} onChange={e => setDestination(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Travel Dates</label>
                    <input type="text" className="form-control" value={dates} onChange={e => setDates(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Create Group</button>
            </form>
        </div>
    );
};

export default CreateGroup;
