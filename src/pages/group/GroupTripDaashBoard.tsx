import React, { useState, useEffect } from 'react';
import PollsSection from './PollsSection';
import ChecklistPage from './CheckListSection';
import EditTripModal from './EditTripModal';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { addUserToGroup } from '../../api/api';
import type { Group, User } from '../../types';

const GroupTripDashboard = () => {
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'polls' | 'checklist'>('overview');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPollModal, setShowPollModal] = useState(false);
    const [showChecklistModal, setShowChecklistModal] = useState(false);

    const [newChecklistTask, setNewChecklistTask] = useState("");
    const [assignedUser, setAssignedUser] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [newPollQuestion, setNewPollQuestion] = useState("");
    const [newPollOptions, setNewPollOptions] = useState(["", ""]);

    const [selectedUserId, setSelectedUserId] = useState("");

    const { groupId } = useParams<{ groupId: string }>();
    const userId = localStorage.getItem('userId');

    const fetchGroup = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/trip-groups/${groupId}`);
            setSelectedGroup(res.data);
        } catch (error) {
            console.error("Failed to fetch group", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/v1/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        fetchGroup();
        fetchUsers();
    }, [groupId]);

    const handlePollOptionChange = (index: number, value: string) => {
        const updatedOptions = [...newPollOptions];
        updatedOptions[index] = value;
        setNewPollOptions(updatedOptions);
    };

    const addNewPoll = async () => {
        try {
            await axios.post(`http://localhost:8080/api/v1/trip-groups/${groupId}/polls`, {
                question: newPollQuestion,
                options: newPollOptions,
            });
            await fetchGroup();
            setShowPollModal(false);
            setNewPollQuestion("");
            setNewPollOptions(["", ""]);
        } catch (error) {
            console.error("Failed to add poll", error);
        }
    };

    const addNewChecklistItem = async () => {
        try {
            await axios.post(`http://localhost:8080/api/v1/trip-groups/${groupId}/checklist`, {
                task: newChecklistTask,
                assignedTo: assignedUser,
                dueDate,
            });
            await fetchGroup();
            setShowChecklistModal(false);
            setNewChecklistTask("");
            setAssignedUser("");
            setDueDate("");
        } catch (error) {
            console.error("Failed to add checklist item", error);
        }
    };

    const handleSaveEdit = async (updatedGroup: Group) => {
        try {
            await axios.put(`http://localhost:8080/api/v1/trip-groups/${groupId}`, updatedGroup);
            await fetchGroup();
            setShowEditModal(false);
        } catch (error) {
            console.error("Failed to update group", error);
        }
    };

    const handleAddUserToGroup = async () => {
        if (!selectedUserId) return alert("Please select a user");
        try {
            await addUserToGroup(groupId!, selectedUserId);
            alert("User added successfully");
            setSelectedUserId("");
            await fetchGroup();
        } catch (error) {
            alert("Failed to add user");
        }
    };

    if (!selectedGroup) return <div className="text-center mt-5">Loading...</div>;

    return (
        <main className="container py-5">
            <div className="card mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2>{selectedGroup.tripName}</h2>
                            <div className="text-muted">{selectedGroup.dates} &bull; {selectedGroup.status || 'Active'}</div>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>Edit Trip</button>
                        {showEditModal && (
                            <EditTripModal
                                group={selectedGroup}
                                onSave={handleSaveEdit}
                                onClose={() => setShowEditModal(false)}
                            />
                        )}
                    </div>

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

                    {activeTab === 'overview' && (
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <h5 className="card-title">Trip Summary</h5>
                                        <p className="card-text text-muted">{selectedGroup.tripDescription || 'No description available.'}</p>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Group Members</h5>
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            {selectedGroup.members.map((member, index) => (
                                                <div key={index} className="d-flex align-items-center border rounded-pill px-3 py-2">
                                                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '30px', height: '30px' }}>
                                                        {member.username[0]}
                                                    </div>
                                                    <span>{member.username}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="input-group">
                                            <select
                                                className="form-select"
                                                value={selectedUserId}
                                                onChange={(e) => setSelectedUserId(e.target.value)}
                                            >
                                                <option value="">Select a user to add</option>
                                                {users.map((user) => (
                                                    <option key={user.userId} value={user.userId}>
                                                        {user.username} ({user.email})
                                                    </option>
                                                ))}
                                            </select>
                                            <button className="btn btn-success" onClick={handleAddUserToGroup}>Add User</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                <PollsSection tripGroupId={selectedGroup.tripGroupId} userId={userId} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'checklist' && (
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Checklist</h3>
                                <ChecklistPage />
                            </div>
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Group Chat</h5>
                                <ul className="list-group list-group-flush">
                                    {selectedGroup.tripNotes?.map((msg, idx) => (
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
                <div className="modal fade show" style={{ display: "block", backdropFilter: "blur(5px)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create Poll</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPollModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Poll Question</label>
                                    <input type="text" className="form-control" value={newPollQuestion} onChange={(e) => setNewPollQuestion(e.target.value)} />
                                </div>
                                {newPollOptions.map((option, index) => (
                                    <div className="input-group mb-2" key={index}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={`Option ${index + 1}`}
                                            value={option}
                                            onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                        />
                                    </div>
                                ))}
                                <button className="btn btn-primary" onClick={addNewPoll}>Create Poll</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Checklist Modal */}
            {showChecklistModal && (
                <div className="modal fade show" style={{ display: "block", backdropFilter: "blur(5px)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Checklist Item</h5>
                                <button type="button" className="btn-close" onClick={() => setShowChecklistModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Task</label>
                                    <input type="text" className="form-control" value={newChecklistTask} onChange={(e) => setNewChecklistTask(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Assign To</label>
                                    <select className="form-select" value={assignedUser} onChange={(e) => setAssignedUser(e.target.value)}>
                                        <option value="">Select User</option>
                                        {selectedGroup.members.map((member) => (
                                            <option key={member.userId} value={member.userId}>{member.username}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Due Date</label>
                                    <input type="date" className="form-control" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                                </div>
                                <button className="btn btn-primary" onClick={addNewChecklistItem}>Add Item</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default GroupTripDashboard;
