import React, { useState, useEffect } from 'react';
import PollsSection from './PollsSection';
import ChecklistPage from './CheckListSection';
import type { Group } from '../../types';
import EditTripModal from './EditTripModal';

const mockGroups: Group[] = [
    {
        id: 1,
        name: "Thailand Adventure",
        status: "Planning",
        destination: "Bangkok, Thailand",
        dates: "Aug 15–30, 2024",
        members: ["John", "Sarah", "Mike"],
        image: "https://source.unsplash.com/400x300/?thailand,beach,sunset",
        chat: ["Hey everyone!", "Can't wait for the trip!"],
        polls: {
            destinations: ["Bangkok", "Phuket", "Chiang Mai"],
            dates: ["Aug 15–30", "Sep 1–15"],
        },
        checklist: [
            { task: "Book Flights", done: false },
            { task: "Reserve Hotels", done: true },
        ],
    },
    {
        id: 2,
        name: "Europe Tour",
        status: "Ongoing",
        destination: "Paris, France",
        dates: "Jul 1–15, 2024",
        members: ["Emma", "David"],
        image: "https://source.unsplash.com/400x300/?paris,eiffel,sunset",
        chat: ["Meeting at the airport", "Got the tickets!"],
        polls: {
            destinations: ["Paris", "Rome", "Barcelona"],
            dates: ["Jul 1–15", "Jul 15–30"],
        },
        checklist: [
            { task: "Pack Essentials", done: true },
            { task: "Exchange Currency", done: false },
        ],
    },
];

const GroupTripDashboard = () => {
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'polls' | 'checklist'>('overview');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPollModal, setShowPollModal] = useState(false);
    const [showChecklistModal, setShowChecklistModal] = useState(false);
    const [newChecklistTask, setNewChecklistTask] = useState("");
    const [assignedUser, setAssignedUser] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [newPollQuestion, setNewPollQuestion] = useState("");
    const [newPollOptions, setNewPollOptions] = useState(["", ""]);

    useEffect(() => {
        const groupId = 1;
        const group = mockGroups.find((group) => group.id === groupId);
        setSelectedGroup(group || null);
    }, []);

    if (!selectedGroup) {
        return <div className="text-center my-5">Loading...</div>;
    }

    const handlePollOptionChange = (index: number, value: string) => {
        const updatedOptions = [...newPollOptions];
        updatedOptions[index] = value;
        setNewPollOptions(updatedOptions);
    };

    const addNewPoll = () => {
        if (newPollQuestion && newPollOptions.every(option => option.trim())) {
            selectedGroup.polls.destinations.push(newPollQuestion);
            selectedGroup.polls.dates.push(...newPollOptions);
            setShowPollModal(false);
        }
    };

    const addNewChecklistItem = () => {
        if (newChecklistTask.trim() && assignedUser && dueDate) {
            selectedGroup.checklist.push({
                task: newChecklistTask,
                assignedTo: assignedUser,
                dueDate,
                done: false,
            });
            setNewChecklistTask("");
            setAssignedUser("");
            setDueDate("");
            setShowChecklistModal(false);
        }
    };


    return (
        <main className="container py-5">
            {/* Trip Header */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2>{selectedGroup.name}</h2>
                            <div className="text-muted">
                                {selectedGroup.destination} &bull; {selectedGroup.dates}
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>Edit Trip</button>
                        {showEditModal && selectedGroup && (
                            <EditTripModal
                                group={selectedGroup}
                                onSave={(updatedGroup) => setSelectedGroup(updatedGroup)}
                                onClose={() => setShowEditModal(false)}
                            />
                        )}
                    </div>

                    {/* Tabs Navigation */}
                    <ul className="nav nav-tabs mb-4">
                        {['overview', 'chat', 'polls', 'checklist'].map((tab) => (
                            <li className="nav-item" key={tab}>
                                <button
                                    className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab as any)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Tabs Content */}
                    {activeTab === 'overview' && (
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6 mb-4">
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <h5 className="card-title">Trip Summary</h5>
                                        <p className="card-text text-muted">
                                            Join us for an unforgettable adventure! We'll be exploring beautiful
                                            destinations, creating memories, and sharing amazing experiences together.
                                        </p>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Group Members</h5>
                                        <div className="d-flex flex-wrap gap-2">
                                            {selectedGroup.members.map((member, index) => (
                                                <div key={index} className="d-flex align-items-center border rounded-pill px-3 py-2">
                                                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '30px', height: '30px' }}>
                                                        {member[0]}
                                                    </div>
                                                    <span>{member}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Quick Actions */}
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Quick Actions</h5>
                                        <div className="d-grid gap-2">
                                            <button className="btn btn-outline-secondary" onClick={() => setShowPollModal(true)}>Create New Poll</button>
                                            <button className="btn btn-outline-secondary" onClick={() => setShowChecklistModal(true)}>Add Checklist Item</button>
                                            <button className="btn btn-outline-secondary">Share Trip Details</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'polls' && (
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Polls</h3>
                                <PollsSection polls={selectedGroup.polls} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'checklist' && (
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Checklist</h3>
                                <ChecklistPage checklist={selectedGroup.checklist} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Group Chat</h5>
                                <ul className="list-group list-group-flush">
                                    {selectedGroup.chat.map((msg, idx) => (
                                        <li key={idx} className="list-group-item">{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Poll Modal */}
            {showPollModal && (
                <div className="modal fade show" tabIndex="-1" aria-hidden="true" style={{ display: "block", backdropFilter: "blur(5px)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create Poll</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPollModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="pollQuestion" className="form-label">Poll Question</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="pollQuestion"
                                        value={newPollQuestion}
                                        onChange={(e) => setNewPollQuestion(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="pollOptions" className="form-label">Options</label>
                                    {newPollOptions.map((option, index) => (
                                        <div className="input-group mb-2" key={index}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={option}
                                                onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                            />
                                            {index === newPollOptions.length - 1 && (
                                                <button className="btn btn-outline-secondary" onClick={() => setNewPollOptions([...newPollOptions, ""])}>+</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowPollModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={addNewPoll}>Save Poll</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Checklist Modal */}
            {showChecklistModal && (
                <div className="modal fade show" tabIndex="-1" aria-hidden="true" style={{ display: "block", backdropFilter: "blur(5px)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Checklist Item</h5>
                                <button type="button" className="btn-close" onClick={() => setShowChecklistModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="checklistTask" className="form-label">Task</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="checklistTask"
                                        value={newChecklistTask}
                                        onChange={(e) => setNewChecklistTask(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="assignedTo" className="form-label">Assign To</label>
                                    <select
                                        className="form-select"
                                        id="assignedTo"
                                        value={assignedUser}
                                        onChange={(e) => setAssignedUser(e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        {selectedGroup.members.map((member, index) => (
                                            <option key={index} value={member}>{member}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="dueDate" className="form-label">Due Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dueDate"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowChecklistModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={addNewChecklistItem}>Add Task</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </main >
    );
};

export default GroupTripDashboard;
