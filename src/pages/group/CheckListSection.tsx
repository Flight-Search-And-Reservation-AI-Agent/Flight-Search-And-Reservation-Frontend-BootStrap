import React, { useState } from 'react';

type ChecklistItem = {
    title: string;
    assignedTo: string;
    due: string;
    done: boolean;
};

const ChecklistPage: React.FC = () => {
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
        { title: 'Book Flights', assignedTo: 'Alice', due: 'May 20', done: true },
        { title: 'Apply for Visa', assignedTo: 'Bob', due: 'May 25', done: false },
        { title: 'Reserve Hotel', assignedTo: 'Charlie', due: 'June 1', done: false },
    ]);

    const [newItem, setNewItem] = useState<ChecklistItem>({
        title: '',
        assignedTo: '',
        due: '',
        done: false,
    });

    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleCheckboxToggle = (index: number) => {
        const updatedItems = [...checklistItems];
        updatedItems[index].done = !updatedItems[index].done;
        setChecklistItems(updatedItems);
    };

    const handleDelete = (index: number) => {
        const updatedItems = checklistItems.filter((_, i) => i !== index);
        setChecklistItems(updatedItems);
    };

    const handleEdit = (index: number) => {
        setNewItem(checklistItems[index]);
        setEditingIndex(index);
    };

    const handleSave = () => {
        if (editingIndex !== null) {
            const updatedItems = [...checklistItems];
            updatedItems[editingIndex] = newItem;
            setChecklistItems(updatedItems);
            setEditingIndex(null);
        } else {
            setChecklistItems([...checklistItems, newItem]);
        }

        setNewItem({ title: '', assignedTo: '', due: '', done: false });
    };

    const completedCount = checklistItems.filter(item => item.done).length;
    const totalCount = checklistItems.length;
    const progressPercent = (completedCount / totalCount) * 100;

    return (
        <div className="container py-5">
            <h2 className="mb-4 h4">Trip Checklist</h2>

            <div className="card shadow-sm border">
                <div className="card-body">
                    <div className="mb-3">
                        {checklistItems.map((item, index) => (
                            <div
                                key={index}
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
                                        <p className="mb-1 fw-semibold">{item.title}</p>
                                        <small className="text-muted">
                                            Assigned to: {item.assignedTo} • Due: {item.due}
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
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Task Title"
                                    value={newItem.title}
                                    onChange={(e) =>
                                        setNewItem({ ...newItem, title: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-4">
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
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Due Date"
                                    value={newItem.due}
                                    onChange={(e) =>
                                        setNewItem({ ...newItem, due: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-1">
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
