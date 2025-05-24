import React, { useEffect, useState } from 'react';
import { updateUser } from '../../api/api';
import type { User } from '../../types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/userSlice';

const EditProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User & { password?: string }>>({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Authentication token not found.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('https://flightapp-backend-new.uc.r.appspot.com/api/v1/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to load user data (${response.status})`);
                }

                const data: User = await response.json();
                setUser(data);
                setFormData({ username: data.username, email: data.email });
            } catch (error) {
                console.error('Fetch error:', error);
                setMessage('An error occurred while fetching user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Authentication token not found.');
            return;
        }

        try {
            // Avoid sending blank password
            const dataToSend = { ...formData };
            if (!formData.password) {
                delete dataToSend.password;
            }

            const updatedUser = await updateUser(user.userId, dataToSend);
            setMessage('Profile updated successfully!');
            setUser(updatedUser);
            setFormData({ ...formData, password: '' }); 
            dispatch(logout()); // Clears token + user
            navigate('/login'); 
            window.location.replace(window.location.href);
        } catch (error: any) {
            console.error('Update error:', error);
            setMessage(error.message || 'An error occurred while updating the profile');
        }
    };

    if (loading) return <div className="container mt-5">Loading...</div>;

    return (
        <div className="container mt-5">
            <h2>Edit Profile</h2>

            {message && (
                <div className="alert alert-info" role="alert">
                    {message}
                </div>
            )}

            {user && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="form-control"
                            value={formData.username || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="form-control"
                            value={formData.email || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">New Password (optional)</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="form-control"
                            value={formData.password || ''}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
            )}
        </div>
    );
};

export default EditProfile;
