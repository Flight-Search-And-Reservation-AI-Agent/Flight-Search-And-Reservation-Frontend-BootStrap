import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
    username: string;
    email: string;
    fullName?: string;
    createdAt?: string;
}

const EditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile>({
        username: "",
        email: "",
        fullName: "",
    });

    useEffect(() => {
        // Simulated fetch of current user data
        const dummyUser: UserProfile = {
            username: "john_doe",
            email: "john.doe@example.com",
            fullName: "John Doe",
        };
        setUser(dummyUser);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would send a PUT/PATCH request to the backend
        navigate("/dashboard"); // Redirect after save
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Edit Profile</h2>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit} className="card p-4 shadow-sm rounded-4">
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={user.username}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="fullName"
                                value={user.fullName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary px-4">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
