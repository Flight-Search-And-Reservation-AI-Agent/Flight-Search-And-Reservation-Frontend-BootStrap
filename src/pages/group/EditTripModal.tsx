import React, { useState } from 'react';
import type { Group } from '../../types';

interface Props {
    group: Group;
    onSave: (updatedGroup: Group) => void;
    onClose: () => void;
}

const EditTripModal: React.FC<Props> = ({ group, onSave, onClose }) => {
    const [name, setName] = useState(group.name);
    const [destination, setDestination] = useState(group.destination);
    const [dates, setDates] = useState(group.dates);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...group, name, destination, dates });
        onClose();
    };

    return (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Trip</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Trip Name</label>
                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Destination</label>
                                <input type="text" className="form-control" value={destination} onChange={(e) => setDestination(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Dates</label>
                                <input type="text" className="form-control" value={dates} onChange={(e) => setDates(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTripModal;
