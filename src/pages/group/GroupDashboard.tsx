import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Group } from '../../types';

const mockGroups: Group[] = [
    {
        id: 1,
        name: 'Thailand Adventure',
        status: 'Planning',
        destination: 'Bangkok, Thailand',
        dates: 'Aug 15–30, 2024',
        members: ['John', 'Sarah', 'Mike'],
        image: 'src/assets/pic1.jpg',
        chat: ['Hey everyone!', "Can't wait for the trip!"],
        polls: {
            destinations: ['Bangkok', 'Phuket', 'Chiang Mai'],
            dates: ['Aug 15–30', 'Sep 1–15']
        },
        checklist: [
            { task: 'Book Flights', done: false },
            { task: 'Reserve Hotels', done: true }
        ]
    },
    {
        id: 2,
        name: 'Europe Tour',
        status: 'Ongoing',
        destination: 'Paris, France',
        dates: 'Jul 1–15, 2024',
        members: ['Emma', 'David'],
        image: 'src/assets/pic2.jpg',
        chat: ['Meeting at the airport', 'Got the tickets!'],
        polls: {
            destinations: ['Paris', 'Rome', 'Barcelona'],
            dates: ['Jul 1–15', 'Jul 15–30']
        },
        checklist: [
            { task: 'Pack Essentials', done: true },
            { task: 'Exchange Currency', done: false }
        ]
    }
];

const GroupDashboard: React.FC = () => {
    const [groups] = useState<Group[]>(mockGroups);
    const navigate = useNavigate();

    const handleGroupClick = (groupId: number) => {
        const group = groups.find((group) => group.id === groupId);
        if (group) {
            navigate(`/group/${groupId}`, { state: group });
        }
    };

    return (
        <div className="container py-4">
            <div className="row g-4">
                {/* Create New Group Button */}
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

                {/* Group Cards */}
                {groups.map((group) => (
                    <div className="col-md-4 col-sm-6" key={group.id}>
                        <div className="card h-100" role="button" onClick={() => handleGroupClick(group.id)}>
                            <img
                                src={group.image}
                                className="card-img-top"
                                alt={group.name}
                                style={{ height: '160px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title mb-2">{group.name}</h5>
                                <p className="card-text text-muted mb-1">{group.destination}</p>
                                <p className="card-text text-muted">{group.dates}</p>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className={`badge ${group.status === 'Planning' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                        {group.status}
                                    </span>
                                    <small className="text-muted">{group.members.length} members</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupDashboard;
