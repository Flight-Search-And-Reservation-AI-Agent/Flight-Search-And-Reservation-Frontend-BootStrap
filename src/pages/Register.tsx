import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api"; // adjust path if needed

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
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
            await registerUser(form); // no role being sent here
            navigate("/login");
        } catch (err: any) {
            const errMsg =
                err.response?.data?.message ||
                err.response?.data ||
                "Registration failed. Try again.";
            setError(errMsg);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="bg-white shadow-lg rounded-3 p-4 w-100" style={{ maxWidth: "400px" }}>
                <h2 className="text-center text-dark mb-4">Register</h2>
                {error && (
                    <div className="alert alert-danger">
                        {typeof error === "string" ? error : JSON.stringify(error)}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            name="email"
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            value={form.email}
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
                            autoComplete="new-password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-success w-100 py-2"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-muted mt-4">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-success cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
