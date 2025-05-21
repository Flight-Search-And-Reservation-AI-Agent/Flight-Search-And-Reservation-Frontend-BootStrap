import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ChecklistItem } from '../../types';
import {
    fetchChecklistItems,
    toggleChecklistItem,
    deleteChecklistItem,
    updateChecklistItem,
    createChecklistItem,
} from '../../api/api';

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

    const fetchChecklist = async () => {
        try {
            const items = await fetchChecklistItems(groupId!);

            // Normalize 'completed' to 'done'
            const normalizedItems = items.map((item: any)=> ({
                ...item,
                done: item.done || item.completed || false, // ✅ fallback for both cases
            }));

            setChecklistItems(normalizedItems);
        } catch (err) {
            console.error('Error fetching checklist:', err);
        }
    };


    const handleCheckboxToggle = async (index: number) => {
        const item = checklistItems[index];
        if (!item.itemId) return;

        const updatedItems = [...checklistItems];
        updatedItems[index] = { ...item, done: !item.done };
        setChecklistItems(updatedItems);

        try {
            await toggleChecklistItem(groupId!, item.itemId);
        } catch (err) {
            console.error('Toggle error:', err);
            updatedItems[index] = item;
            setChecklistItems(updatedItems);
        }
    };

    const handleDelete = async (index: number) => {
        const item = checklistItems[index];
        if (!item.itemId) return;

        try {
            await deleteChecklistItem(groupId!, item.itemId);
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

                const updated = await updateChecklistItem(groupId!, itemId, newItem);
                const updatedItems = checklistItems.map((item, index) =>
                    index === editingIndex ? updated : item
                );
                setChecklistItems(updatedItems);
                setEditingIndex(null);
            } else {
                const created = await createChecklistItem(groupId!, newItem);
                setChecklistItems([...checklistItems, created]);
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
            <div className="card shadow-sm border">
                <div className="card-body">
                    <div className="mb-3">
                        {checklistItems.map((item, index) => (
                            <div
                                key={item.itemId ?? index}
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
