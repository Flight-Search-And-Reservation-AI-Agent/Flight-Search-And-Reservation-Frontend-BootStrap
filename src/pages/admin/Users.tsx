import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import type { User } from "../../types";
import { deleteUserById, fetchAllUsers } from "../../api/api";

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [usernameFilter, setUsernameFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    useEffect(() => {
        fetchAllUsers()
            .then((data) => {
                setUsers(data);
                setFilteredUsers(data);
            })
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    useEffect(() => {
        filterUsers();
    }, [usernameFilter, roleFilter, users]);

    const filterUsers = () => {
        let updated = [...users];

        if (usernameFilter) {
            updated = updated.filter(user =>
                user.username.toLowerCase().includes(usernameFilter.toLowerCase())
            );
        }

        if (roleFilter) {
            updated = updated.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(updated);
    };

    const handleDeleteUser = async (userId: string) => {
        const confirm = window.confirm("Are you sure you want to delete this user?");
        if (!confirm) return;

        try {
            await deleteUserById(userId);
            const updated = users.filter(user => user.userId !== userId);
            setUsers(updated);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="fw-bold text-center mb-4">Admin - Manage Users</h3>

            {/* Filter Form */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Username"
                        value={usernameFilter}
                        onChange={(e) => setUsernameFilter(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center">No users found.</td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.userId}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge bg-${user.role === "ADMIN" ? "primary" : "secondary"}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteUser(user.userId)}
                                        >
                                            <FaTrashAlt /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
