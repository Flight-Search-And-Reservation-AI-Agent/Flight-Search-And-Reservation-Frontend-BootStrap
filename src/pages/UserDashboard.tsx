import { useEffect, useState } from "react";

interface UserProfile {
    username: string;
    email: string;
    fullName?: string;
    createdAt?: string;
}

// const UserDashboard = () => {
//     const [user, setUser] = useState<UserProfile | null>(null);

//     useEffect(() => {
//         // Replace with your actual API call
//         const fetchUser = async () => {
//             try {
//                 const res = await fetch("/api/user/profile", {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 });
//                 const data = await res.json();
//                 setUser(data);
//             } catch (error) {
//                 console.error("Failed to fetch user profile:", error);
//             }
//         };
//         fetchUser();
//     }, []);

const UserDashboard = () => {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        // Dummy data for the user profile
        const fetchUser = async () => {
            const dummyUser: UserProfile = {
                username: "john_doe",
                email: "john.doe@example.com",
                fullName: "John Doe",
                createdAt: "2021-05-15T10:00:00Z",
            };
            setUser(dummyUser);
        };

        fetchUser();
    }, []);

    return (
        <div className="container py-5">
            <h1 className="display-4 text-center text-dark mb-5">Welcome to Your Dashboard</h1>

            <div className="row justify-content-center">
                {/* Profile Card */}
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-5">
                            {/* Profile Header */}
                            <div className="text-center mb-4">
                                <div className="mb-3">
                                    <img
                                        src="src/assets/userimage.jpg"
                                        alt="Profile"
                                        className="rounded-circle border border-4 border-primary"
                                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                    />
                                </div>
                                <h3 className="text-dark mb-1">{user?.fullName || user?.username}</h3>
                                <p className="text-muted">{user?.email}</p>
                            </div>

                            {/* Profile Details */}
                            <div className="mb-3">
                                <h5 className="text-dark">Account Information</h5>
                                <ul className="list-unstyled">
                                    <li>
                                        <strong>Username: </strong>
                                        {user?.username}
                                    </li>
                                    <li>
                                        <strong>Email: </strong>
                                        {user?.email}
                                    </li>
                                    {user?.fullName && (
                                        <li>
                                            <strong>Full Name: </strong>
                                            {user?.fullName}
                                        </li>
                                    )}
                                    {user?.createdAt && (
                                        <li>
                                            <strong>Joined: </strong>
                                            {new Date(user?.createdAt).toLocaleDateString()}
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Edit Profile Button */}
                            <div className="text-center">
                                <a
                                    href="/user/profile/edit"
                                    className="btn btn-primary px-4 py-2 mt-3 fw-semibold"
                                >
                                    Edit Profile
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Placeholder for future sections */}
            <div className="row g-4 mt-5">
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title">Your Bookings</h5>
                            <p className="card-text">Manage your flight bookings</p>
                            <a href="/reservationPage" className="btn btn-outline-primary">View Bookings</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title">Search Flights</h5>
                            <p className="card-text">Start a new flight search</p>
                            <a href="/" className="btn btn-outline-primary">Search Flights</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
