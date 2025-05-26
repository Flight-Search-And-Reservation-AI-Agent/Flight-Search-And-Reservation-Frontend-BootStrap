import { useEffect, useState } from "react";
import {
    addAircraft,
    deleteAircraft,
    getAllAircraft,
    updateAircraft,
} from "../../api/api";
import type { Aircraft } from "../../types";

const Aircrafts = () => {
    const [aircraftList, setAircraftList] = useState<Aircraft[]>([]);
    const [newAircraft, setNewAircraft] = useState({ model: "", capacity: 0, airline: "" });
    const [editingAircraftId, setEditingAircraftId] = useState<string | null>(null);
    const [isCustomModel, setIsCustomModel] = useState(false);
    const [isCustomAirline, setIsCustomAirline] = useState(false);

    const fetchAircraft = async () => {
        const data = await getAllAircraft();
        setAircraftList(data);
    };

    useEffect(() => {
        fetchAircraft();
    }, []);

    const handleAdd = async () => {
        await addAircraft(newAircraft);
        setNewAircraft({ model: "", capacity: 0, airline: "" });
        setIsCustomModel(false);
        setIsCustomAirline(false);
        fetchAircraft();
    };

    const handleUpdate = async (id: string) => {
        await updateAircraft(id, newAircraft);
        setEditingAircraftId(null);
        setNewAircraft({ model: "", capacity: 0, airline: "" });
        setIsCustomModel(false);
        setIsCustomAirline(false);
        fetchAircraft();
    };

    const handleDelete = async (id: string) => {
        await deleteAircraft(id);
        fetchAircraft();
    };

    const uniqueModels = Array.from(new Set(aircraftList.map((a) => a.model)));
    const uniqueAirlines = Array.from(new Set(aircraftList.map((a) => a.airline)));

    return (
        <div className="container py-4">
            <h2 className="display-4 mb-4">Aircraft Management</h2>

            <div className="mb-4">
                {/* Model select/input */}
                <div className="form-group">
                    <label>Model</label>
                    <select
                        className="form-control"
                        value={isCustomModel ? "__custom__" : newAircraft.model}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "__custom__") {
                                setIsCustomModel(true);
                                setNewAircraft({ ...newAircraft, model: "" });
                            } else {
                                setNewAircraft({ ...newAircraft, model: value });
                                setIsCustomModel(false);
                            }
                        }}
                    >
                        <option value="">Select Aircraft Model</option>
                        {uniqueModels.map((model) => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))}
                        <option value="__custom__">➕ Add new model...</option>
                    </select>

                    {isCustomModel && (
                        <input
                            type="text"
                            placeholder="Enter New Model"
                            className="form-control mt-2"
                            value={newAircraft.model}
                            onChange={(e) => setNewAircraft({ ...newAircraft, model: e.target.value })}
                            required
                        />
                    )}
                </div>

                {/* Capacity input */}
                <div className="form-group mt-2">
                    <label>Capacity</label>
                    <input
                        type="number"
                        placeholder="Capacity"
                        className="form-control w-25"
                        value={newAircraft.capacity.toString()}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) {
                                setNewAircraft({ ...newAircraft, capacity: Number(val) });
                            }
                        }}
                        required
                    />
                </div>

                {/* Airline select/input */}
                <div className="form-group mt-2">
                    <label>Airline</label>
                    <select
                        className="form-control"
                        value={isCustomAirline ? "__custom__" : newAircraft.airline}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "__custom__") {
                                setIsCustomAirline(true);
                                setNewAircraft({ ...newAircraft, airline: "" });
                            } else {
                                setNewAircraft({ ...newAircraft, airline: value });
                                setIsCustomAirline(false);
                            }
                        }}
                    >
                        <option value="">Select Airline</option>
                        {uniqueAirlines.map((airline) => (
                            <option key={airline} value={airline}>
                                {airline}
                            </option>
                        ))}
                        <option value="__custom__">➕ Add new airline...</option>
                    </select>

                    {isCustomAirline && (
                        <input
                            type="text"
                            placeholder="Enter New Airline"
                            className="form-control mt-2"
                            value={newAircraft.airline}
                            onChange={(e) => setNewAircraft({ ...newAircraft, airline: e.target.value })}
                            required
                        />
                    )}
                </div>

                {editingAircraftId ? (
                    <button
                        onClick={() => handleUpdate(editingAircraftId)}
                        className="btn btn-warning text-white mt-3"
                    >
                        Update Aircraft
                    </button>
                ) : (
                    <button
                        onClick={handleAdd}
                        className="btn btn-primary text-white mt-3"
                    >
                        Add Aircraft
                    </button>
                )}
            </div>

            <table className="table table-bordered mt-4">
                <thead className="thead-light">
                    <tr>
                        <th>Model</th>
                        <th>Capacity</th>
                        <th>Airline</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {aircraftList.map((aircraft) => (
                        <tr key={aircraft.aircraftId}>
                            <td>{aircraft.model}</td>
                            <td>{aircraft.capacity}</td>
                            <td>{aircraft.airline}</td>
                            <td>
                                <button
                                    onClick={() => {
                                        setNewAircraft({
                                            model: aircraft.model,
                                            capacity: aircraft.capacity,
                                            airline: aircraft.airline,
                                        });
                                        setEditingAircraftId(aircraft.aircraftId);
                                        setIsCustomModel(false);
                                        setIsCustomAirline(false);
                                    }}
                                    className="btn btn-warning btn-sm mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(aircraft.aircraftId)}
                                    className="btn btn-danger btn-sm"
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

export default Aircrafts;
