import { useEffect, useState } from "react";
import { addAirport, deleteAirport, getAllAirports, updateAirport } from "../../api/api";
import type { Airport } from "../../types";

const Airports = () => {
    const [airports, setAirports] = useState<Airport[]>([]);
    const [form, setForm] = useState<Omit<Airport, "airportId">>({ name: "", city: "", country: "", code: "" });
    const [editingId, setEditingId] = useState<string | null>(null);

    const [isCustom, setIsCustom] = useState({
        name: false,
        city: false,
        country: false,
        code: false,
    });

    const loadAirports = async () => {
        const data = await getAllAirports();
        setAirports(data);
    };

    useEffect(() => {
        loadAirports();
    }, []);

    const handleSelectChange = (field: keyof typeof form, value: string) => {
        if (value === "__custom__") {
            setIsCustom({ ...isCustom, [field]: true });
            setForm({ ...form, [field]: "" });
        } else {
            setForm({ ...form, [field]: value });
            setIsCustom({ ...isCustom, [field]: false });
        }
    };

    const getUniqueOptions = (key: keyof Airport) => {
        const unique = new Set(airports.map((a) => a[key]));
        return Array.from(unique);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateAirport(editingId, form);
            } else {
                await addAirport(form);
            }
            setForm({ name: "", city: "", country: "", code: "" });
            setEditingId(null);
            setIsCustom({ name: false, city: false, country: false, code: false });
            loadAirports();
        } catch (err) {
            alert("Failed to save airport.");
        }
    };

    const handleEdit = (airport: Airport) => {
        setForm({
            name: airport.name,
            city: airport.city,
            country: airport.country,
            code: airport.code,
        });
        setEditingId(airport.airportId);
        setIsCustom({ name: false, city: false, country: false, code: false });
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this airport?")) {
            await deleteAirport(id);
            loadAirports();
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-dark display-4 mb-4">Airport Management</h2>

            <form onSubmit={handleSubmit} className="mb-6">
                {(["name", "city", "country", "code"] as (keyof Omit<Airport, "airportId">)[]).map((field) => (
                    <div key={field} className="mb-3">
                        <label htmlFor={field} className="form-label">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <select
                            id={field}
                            className="form-select"
                            value={isCustom[field] ? "__custom__" : form[field]}
                            onChange={(e) => handleSelectChange(field, e.target.value)}
                        >
                            <option value="">Select {field}</option>
                            {getUniqueOptions(field).map((val) => (
                                <option key={val} value={val}>
                                    {val}
                                </option>
                            ))}
                            <option value="__custom__">➕ Add new...</option>
                        </select>
                        {isCustom[field] && (
                            <input
                                type="text"
                                placeholder={`Enter new ${field}`}
                                value={form[field]}
                                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                                className="form-control mt-2"
                                required
                            />
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    {editingId ? "Update" : "Add"} Airport
                </button>
            </form>

            <table className="table table-bordered table-striped">
                <thead className="table-light">
                    <tr>
                        <th>Name</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Code</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {airports.map((airport) => (
                        <tr key={airport.airportId}>
                            <td>{airport.name}</td>
                            <td>{airport.city}</td>
                            <td>{airport.country}</td>
                            <td>{airport.code}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleEdit(airport)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(airport.airportId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Airports;
