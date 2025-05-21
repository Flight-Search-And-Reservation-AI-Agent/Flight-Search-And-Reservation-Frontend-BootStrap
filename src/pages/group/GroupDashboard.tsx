import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Group } from '../../types';
import { getUserTripGroups, deleteTripGroup } from '../../api/api';

const GroupDashboard: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchGroups = async () => {
            if (!userId) return;
            try {
                const data = await getUserTripGroups(userId);
                setGroups(data);
            } catch (error) {
                alert('Error fetching groups');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [userId]);

    const handleGroupClick = (groupId: string | number) => {
        const group = groups.find((g) => g.tripGroupId === groupId);
        if (group) {
            navigate(`/group/${groupId}`, { state: group });
        }
    };

    const handleDeleteGroup = async (groupId: string) => {
        if (!userId) {
            alert("User not logged in");
            return;
        }

        if (!window.confirm('Are you sure you want to delete this group?')) return;

        try {
            await deleteTripGroup(groupId, userId);
            setGroups(groups.filter((group) => group.tripGroupId !== groupId));
        } catch (error) {
            alert('Failed to delete group.');
            console.error(error);
        }
    };


    return (
        <div className="container py-4">
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-md-4 col-sm-6">
                        <div
                            className="card h-100 text-center border-primary border-2"
                            role="button"
                            onClick={() => navigate('/group/create')}
                        >
                            <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center mb-3" style={{ width: '50px', height: '50px', fontSize: '24px' }}>
                                    +
                                </div>
                                <h6 className="text-primary">Create New Group</h6>
                            </div>
                        </div>
                    </div>

                    {groups.map((group) => (
                        <div className="col-md-4 col-sm-6" key={group.tripGroupId}>
                            <div className="card h-100 position-relative">
                                <img
                                    src={group.tripAvatarUrl || 'src/assets/pic1.jpg'}
                                    className="card-img-top"
                                    alt={group.tripName}
                                    style={{ height: '160px', objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => handleGroupClick(group.tripGroupId)}
                                />
                                <div className="card-body">
                                    <h5 className="card-title mb-2">{group.tripName}</h5>
                                    <p className="card-text text-muted mb-1">{group.tripDescription || 'No description provided'}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className={`badge ${group.status === 'Planning' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                            {group.status || 'Active'}
                                        </span>
                                        <small className="text-muted">{group.members?.length || 0} members</small>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                    onClick={() => handleDeleteGroup(group.tripGroupId.toString())}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupDashboard;
