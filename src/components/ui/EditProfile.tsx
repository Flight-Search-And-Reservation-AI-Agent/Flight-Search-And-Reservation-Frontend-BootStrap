import React, { useEffect, useState } from 'react';

interface User {
    id: string;
    username: string;
    email: string;
    // Add more fields if needed
}

const EditProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

    // Fetch current user data
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Authentication token not found.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/v1/users/me', {
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

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Authentication token not found.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/v1/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Update failed: ${errorText}`);
            }

            const updatedUser: User = await response.json();
            setUser(updatedUser);
            setMessage('Profile updated successfully!');
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

                    {/* Add more fields as needed */}

                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
            )}
        </div>
    );
};

export default EditProfile;
