import { useEffect, useRef, useState } from "react";
import {
    FaTrashAlt,
    FaPlaneDeparture,
    FaPlaneArrival,
    FaUser,
    FaDownload,
} from "react-icons/fa";
import { cancelReservation, fetchUserReservations } from "../api/api";
import type { Reservation } from "../types";
import QRCode from "react-qr-code";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function UserReservationPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filtered, setFiltered] = useState<Reservation[]>([]);
    const [flightIdFilter, setFlightIdFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Refs keyed by reservationId to printable divs
    const printRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.error("User ID not found in localStorage");
            return;
        }

        fetchUserReservations(userId)
            .then((data) => {
                setReservations(data);
                setFiltered(data);
            })
            .catch((err) => {
                console.error("Error fetching reservations", err);
            });
    }, []);

    useEffect(() => {
        handleFilterChange();
    }, [flightIdFilter, statusFilter, reservations]);

    const handleFilterChange = () => {
        let updated = [...reservations];

        if (flightIdFilter) {
            updated = updated.filter((res) =>
                res.flight.flightNumber
                    .toLowerCase()
                    .includes(flightIdFilter.toLowerCase())
            );
        }

        if (statusFilter) {
            updated = updated.filter((res) => res.status === statusFilter);
        }

        setFiltered(updated);
    };

    const handleCancelReservation = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this reservation?")) return;

        try {
            await cancelReservation(id);
            const updateFn = (list: Reservation[]) =>
                list.map((r) =>
                    r.reservationId === id ? { ...r, status: "CANCELLED" as const } : r
                );

            setReservations((prev) => updateFn(prev));
            setFiltered((prev) => updateFn(prev));
        } catch (error) {
            console.error("Error cancelling reservation:", error);
        }
    };

    // New: Generate PDF from hidden div
    const handleDownloadPdf = async (reservationId: string) => {
        const element = printRefs.current[reservationId];
        if (!element) return;

        try {
            // Use html2canvas to capture the element as a canvas
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            // Create a jsPDF instance - A4 size
            const pdf = new jsPDF({
                unit: "mm",
                format: "a4",
            });

            // Calculate width and height for image to fit A4 page
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

            // Save the PDF
            pdf.save(`reservation-${reservationId}.pdf`);
        } catch (error) {
            console.error("Error generating PDF", error);
        }
    };

    return (
        <div className="container my-4">
            <h2>Your Reservations</h2>

            {/* Filters */}
            <div className="mb-3 d-flex gap-3">
                <input
                    type="text"
                    placeholder="Filter by Flight Number"
                    value={flightIdFilter}
                    onChange={(e) => setFlightIdFilter(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: "200px" }}
                />

                <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ maxWidth: "200px" }}
                >
                    <option value="">All Statuses</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="PENDING">Pending</option>
                </select>
            </div>

            {filtered.length === 0 && <p>No reservations found.</p>}

            {filtered.map((res) => (
                <div
                    key={res.reservationId}
                    className="card mb-3"
                    style={{ position: "relative" }}
                >
                    {/* Hidden printable section */}
                    {/* Hidden printable section */}
                    <div
                        ref={(el) => {
                            printRefs.current[res.reservationId] = el;
                        }}
                        style={{
                            position: "fixed",
                            left: "-9999px",
                            top: 0,
                            width: "210mm",
                            height: "297mm",
                            padding: "30px 40px",
                            backgroundColor: "white",
                            color: "#333",
                            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            fontSize: "14px",
                            boxSizing: "border-box",
                        }}
                    >
                        <header
                            style={{
                                borderBottom: "3px solid #007bff",
                                paddingBottom: "10px",
                                marginBottom: "20px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ fontWeight: "700", fontSize: "24px", color: "#007bff" }}>
                                Flight Booking Confirmation
                            </div>
                            <img
                                src="/pic6.png" // Replace with your logo URL or local path
                                alt="Company Logo"
                                style={{ height: "50px" }}
                            />
                        </header>

                        <section style={{ marginBottom: "25px" }}>
                            <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: "6px" }}>
                                Reservation Details
                            </h3>
                            <p>
                                <strong>Reservation ID:</strong> {res.reservationId}
                            </p>
                            <p>
                                <strong>Booking Date:</strong>{" "}
                                {new Date(Date.now()).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    style={{
                                        padding: "4px 10px",
                                        borderRadius: "12px",
                                        color: "white",
                                        backgroundColor:
                                            res.status === "CONFIRMED"
                                                ? "#28a745"
                                                : res.status === "CANCELLED"
                                                    ? "#dc3545"
                                                    : "#6c757d",
                                    }}
                                >
                                    {res.status}
                                </span>
                            </p>
                        </section>

                        <section style={{ marginBottom: "25px" }}>
                            <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: "6px" }}>
                                Passenger Information
                            </h3>

                            {res.passengers && res.passengers.length > 0 ? (
                                res.passengers.map((passenger, index) => (
                                    <div key={index} style={{ marginBottom: "12px" }}>
                                        <p><strong>Name:</strong> {passenger.name}</p>
                                        {passenger.age && <p><strong>Age:</strong> {passenger.age}</p>}
                                        {passenger.gender && <p><strong>Gender:</strong> {passenger.gender}</p>} {index !== res.passengers.length - 1 && <hr style={{ borderColor: "#eee" }} />}
                                    </div>
                                ))
                            ) : (
                                <p>No passenger details available.</p>
                            )}
                        </section>


                        <section style={{ marginBottom: "25px" }}>
                            <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: "6px" }}>
                                Flight Information
                            </h3>
                            <p>
                                <strong>Flight Number:</strong> {res.flight.flightNumber}
                            </p>
                            <p>
                                <strong>From:</strong> {res.flight.origin.name} (
                                {res.flight.origin.code})
                            </p>
                            <p>
                                <strong>To:</strong> {res.flight.destination.name} (
                                {res.flight.destination.code})
                            </p>
                            <p>
                                <strong>Departure:</strong>{" "}
                                {new Date(res.flight.departureTime).toLocaleString()}
                            </p>
                            <p>
                                <strong>Arrival:</strong> {new Date(res.flight.arrivalTime).toLocaleString()}
                            </p>
                            <p>
                                <strong>Aircraft:</strong> {res.flight.aircraft.model} (
                                {res.flight.aircraft.aircraftId})
                            </p>
                        </section>

                        <section style={{ textAlign: "center", marginTop: "40px" }}>
                            <QRCode value={res.reservationId} size={150} />
                            <p style={{ marginTop: "10px", fontStyle: "italic", color: "#666" }}>
                                Scan this QR code to view your reservation details
                            </p>
                        </section>

                        <footer
                            style={{
                                position: "absolute",
                                bottom: "20px",
                                width: "calc(100% - 80px)",
                                borderTop: "1px solid #ddd",
                                paddingTop: "10px",
                                textAlign: "center",
                                fontSize: "12px",
                                color: "#999",
                            }}
                        >
                            Thank you for booking with FlightBooking Inc. Have a safe trip!
                        </footer>
                    </div>


                    {/* Visible reservation info */}
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <p className="mb-1">
                                <FaUser /> {res.user.username}
                            </p>
                            <p className="mb-1">
                                <FaPlaneDeparture /> {res.flight.origin.name} &rarr;{" "}
                                <FaPlaneArrival /> {res.flight.destination.name}
                            </p>
                            <p className="mb-1">
                                <strong>Flight Number:</strong> {res.flight.flightNumber}
                            </p>
                            <p className="mb-1">
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`badge ${res.status === "CONFIRMED"
                                        ? "bg-success"
                                        : res.status === "CANCELLED"
                                            ? "bg-danger"
                                            : "bg-secondary"
                                        }`}
                                >
                                    {res.status}
                                </span>
                            </p>
                        </div>

                        <div className="d-flex gap-2">
                            {res.status !== "CANCELLED" && (
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => handleCancelReservation(res.reservationId)}
                                    title="Cancel Reservation"
                                >
                                    <FaTrashAlt />
                                </button>
                            )}

                            <button
                                className="btn btn-outline-primary"
                                onClick={() => handleDownloadPdf(res.reservationId)}
                                title="Download PDF"
                            >
                                <FaDownload />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
