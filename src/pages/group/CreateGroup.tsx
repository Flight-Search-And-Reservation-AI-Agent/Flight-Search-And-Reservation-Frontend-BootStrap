import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTripGroup } from '../../api/api';
import type { CreateTripGroupPayload } from '../../types';

const CreateGroup: React.FC = () => {
    const [tripName, setTripName] = useState('');
    const [tripDescription, setTripDescription] = useState('');
    const [tripDestination, setTripDestination] = useState('');
    const [tripStartDate, setTripStartDate] = useState('');
    const [tripEndDate, setTripEndDate] = useState('');
    const [tripAvatarUrl, setTripAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            alert("User not logged in");
            return;
        }

        const payload: CreateTripGroupPayload = {
            tripName,
            tripDescription,
            tripDestination,
            tripStartDate,
            tripEndDate,
            tripAvatarUrl,
        };

        try {
            setLoading(true);
            await createTripGroup(userId, payload);
            navigate('/group', { state: { groupCreated: true } });
        } catch (error) {
            console.error('Failed to create group:', error);
            alert('Error creating group. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="mb-4">Create New Trip Group</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Trip Name</label>
                    <input type="text" className="form-control" value={tripName} onChange={e => setTripName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows={3} value={tripDescription} onChange={e => setTripDescription(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Destination</label>
                    <input type="text" className="form-control" value={tripDestination} onChange={e => setTripDestination(e.target.value)} required />
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Start Date</label>
                        <input type="date" className="form-control" value={tripStartDate} onChange={e => setTripStartDate(e.target.value)} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">End Date</label>
                        <input type="date" className="form-control" value={tripEndDate} onChange={e => setTripEndDate(e.target.value)} required />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Trip Avatar URL (optional)</label>
                    <input type="text" className="form-control" value={tripAvatarUrl} onChange={e => setTripAvatarUrl(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Group'}
                </button>
            </form>
        </div>
    );
};

export default CreateGroup;
