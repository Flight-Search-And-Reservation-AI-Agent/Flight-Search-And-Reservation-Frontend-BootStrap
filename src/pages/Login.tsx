import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api"; // adjust path based on your structure

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await loginUser(form);
            // Save token or user info here if needed
            localStorage.setItem("token", res.token); // optional, depending on your backend
            localStorage.setItem("user", form.username)
            navigate('/', { state: { fromLogin: true } });
        } catch (err: any) {
            const errMsg =
                err.response?.data?.message ||
                err.response?.data ||
                "Login failed. Please check your credentials.";
            setError(errMsg);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="bg-white shadow-lg rounded-3 p-4 w-100" style={{ maxWidth: "400px" }}>
                <h2 className="text-center text-dark mb-4">Log In</h2>
                {error && (
                    <div className="alert alert-danger">
                        {typeof error === "string" ? error : JSON.stringify(error)}
                    </div>
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
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-muted mt-4">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-primary cursor-pointer"
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
