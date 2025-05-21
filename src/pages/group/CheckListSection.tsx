import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

type ChecklistItem = {
    itemId?: number;
    task: string;
    assignedTo: string;
    done: boolean;
};

const ChecklistPage: React.FC = () => {
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
    const [newItem, setNewItem] = useState<ChecklistItem>({
        task: '',
        assignedTo: '',
        done: false,
    });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const { groupId } = useParams();

    useEffect(() => {
        fetchChecklist();
    }, [groupId]);

    const fetchChecklist = () => {
        axios
            .get(`http://localhost:8080/api/v1/trip-groups/${groupId}/checklist`)
            .then((res) => setChecklistItems(res.data))
            .catch((err) => console.error('Error fetching checklist:', err));
    };

    const handleCheckboxToggle = async (index: number) => {
        const item = checklistItems[index];
        if (!item.itemId) return;

        // Optimistically update local state
        const updatedItems = [...checklistItems];
        updatedItems[index] = { ...item, done: !item.done };
        setChecklistItems(updatedItems);

        try {
            await axios.patch(
                `http://localhost:8080/api/v1/trip-groups/${groupId}/checklist/toggle/${item.itemId}`
            );
        } catch (err) {
            console.error('Toggle error:', err);
            // Revert change on failure
            updatedItems[index] = item;
            setChecklistItems(updatedItems);
        }
    };

    const handleDelete = async (index: number) => {
        const item = checklistItems[index];
        if (!item.itemId) return;

        try {
            await axios.delete(
                `http://localhost:8080/api/v1/trip-groups/${groupId}/checklist/${item.itemId}`
            );
            setChecklistItems(checklistItems.filter((_, i) => i !== index));
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleEdit = (index: number) => {
        setNewItem(checklistItems[index]);
        setEditingIndex(index);
    };

    const handleSave = async () => {
        try {
            if (editingIndex !== null) {
                const itemId = checklistItems[editingIndex].itemId;
                if (!itemId) return;

                const res = await axios.put(
                    `http://localhost:8080/api/v1/trip-groups/${groupId}/checklist/${itemId}`,
                    newItem
                );

                const updatedItems = checklistItems.map((item, index) =>
                    index === editingIndex ? res.data : item
                );
                setChecklistItems(updatedItems);
                setEditingIndex(null);
            } else {
                const res = await axios.post(
                    `http://localhost:8080/api/v1/trip-groups/${groupId}/checklist`,
                    newItem
                );
                setChecklistItems([...checklistItems, res.data]);
            }

            setNewItem({ task: '', assignedTo: '', done: false });
        } catch (err) {
            console.error('Save error:', err);
        }
    };

    const completedCount = checklistItems.filter((item) => item.done).length;
    const totalCount = checklistItems.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="container py-5">
            <h2 className="mb-4 h4">Trip Checklist</h2>

            <div className="card shadow-sm border">
                <div className="card-body">
                    <div className="mb-3">
                        {checklistItems.map((item, index) => (
                            <div
                                key={item.itemId || index}
                                className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-2"
                            >
                                <div className="d-flex align-items-start gap-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input mt-1"
                                        checked={item.done}
                                        onChange={() => handleCheckboxToggle(index)}
                                    />
                                    <div>
                                        <p className="mb-1 fw-semibold">{item.task}</p>
                                        <small className="text-muted">
                                            Assigned to: {item.assignedTo}
                                        </small>
                                    </div>
                                </div>
                                <div className="d-flex gap-2 text-muted">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => handleEdit(index)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(index)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="progress mb-1" style={{ height: '8px' }}>
                            <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${progressPercent}%` }}
                                aria-valuenow={progressPercent}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                        <small className="text-muted">
                            {completedCount}/{totalCount} completed
                        </small>
                    </div>

                    {/* Add/Edit Form */}
                    <div className="mt-4">
                        <h5 className="mb-3">{editingIndex !== null ? 'Edit Item' : 'Add Item'}</h5>
                        <div className="row g-2 mb-2">
                            <div className="col-md-5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Task"
                                    value={newItem.task}
                                    onChange={(e) =>
                                        setNewItem({ ...newItem, task: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Assigned To"
                                    value={newItem.assignedTo}
                                    onChange={(e) =>
                                        setNewItem({ ...newItem, assignedTo: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-success w-100" onClick={handleSave}>
                                    ✅
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChecklistPage;
