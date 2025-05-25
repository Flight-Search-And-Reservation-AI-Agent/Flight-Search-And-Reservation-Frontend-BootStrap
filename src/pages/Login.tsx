import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api"; // adjust path
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../redux/userSlice";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await loginUser(form);

            // Save token and user info in Redux store
            dispatch(setToken(res.token));
            localStorage.setItem("token", res.token);
            localStorage.setItem("user", form.username);
            localStorage.setItem("role", res.role);

            // Fetch current user details with token
            const response = await fetch(`http://localhost:8080/api/v1/users/me`, {
                headers: {
                    Authorization: `Bearer ${res.token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

            const userData = await response.json();

            // Update Redux user state with full user data
            dispatch(setUser(userData));

            // Optionally store userId in localStorage
            localStorage.setItem("userId", userData.userId);

            navigate("/", { state: { fromLogin: true } });
        } catch (err: any) {
            const errMsg =
                err.response?.data?.message ||
                err.response?.data ||
                "Login failed. Please check your credentials.";
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="bg-white shadow-lg rounded-3 p-4 w-100" style={{ maxWidth: "400px" }}>
                <h2 className="text-center text-dark mb-4">Log In</h2>

                {error && (
                    <div className="alert alert-danger">{typeof error === "string" ? error : JSON.stringify(error)}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            name="username"
                            placeholder="Username"
                            autoComplete="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="form-control"
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="form-control"
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-muted mt-4">
                    Don’t have an account?{" "}
                    <span onClick={() => navigate("/register")} className="text-primary cursor-pointer">
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
