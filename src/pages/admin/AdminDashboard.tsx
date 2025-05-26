import { useEffect, useState } from 'react';
import {
    fetchAllUsers,
    getAllAircraft,
    getAllAirports,
    getAllFlights,
    getAllReservations,
} from '../../api/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

const COLORS = ['#28a745', '#dc3545', '#ffc107'];

const AdminDashboard = () => {
    const [totals, setTotals] = useState({
        flights: 0,
        users: 0,
        bookings: 0,
        airports: 0,
        aircrafts: 0,
    });
    const [bookingStatusCounts, setBookingStatusCounts] = useState<{
        [key: string]: number;
    }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [flightsRes, usersRes, bookingsRes, airportsRes, aircraftsRes] =
                    await Promise.all([
                        getAllFlights(),
                        fetchAllUsers(),
                        getAllReservations(),
                        getAllAirports(),
                        getAllAircraft(),
                    ]);

                // Count bookings by status
                const statusCounts: { [key: string]: number } = {};
                bookingsRes.forEach((res: any) => {
                    const status = res.status || 'UNKNOWN';
                    statusCounts[status] = (statusCounts[status] || 0) + 1;
                });

                setTotals({
                    flights: flightsRes.length,
                    users: usersRes.length,
                    bookings: bookingsRes.length,
                    airports: airportsRes.length,
                    aircrafts: aircraftsRes.length,
                });

                setBookingStatusCounts(statusCounts);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const entityChartData = [
        { name: 'Flights', value: totals.flights },
        { name: 'Users', value: totals.users },
        { name: 'Airports', value: totals.airports },
        { name: 'Aircrafts', value: totals.aircrafts },
    ];

    const bookingChartData = Object.entries(bookingStatusCounts).map(([status, count]) => ({
        name: status,
        value: count,
    }));

    if (loading) {
        return (
            <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid bg-light min-vh-100 py-4">
            <h1 className="display-4 text-dark mb-4 text-center">Admin Dashboard</h1>

            {/* Summary Cards */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-4 px-4">
                <DashboardCard title="Total Flights" value={totals.flights} />
                <DashboardCard title="Users" value={totals.users} />
                <DashboardCard title="Bookings" value={totals.bookings} />
                <DashboardCard title="Airports" value={totals.airports} />
                <DashboardCard title="Aircrafts" value={totals.aircrafts} />
            </div>

            {/* Charts */}
            <div className="row mt-5 px-4">
                {/* Entity Overview */}
                <div className="col-md-6 mb-4">
                    <h4 className="text-center">System Overview (Bar Chart)</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={entityChartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#007bff" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Booking Status */}
                <div className="col-md-6 mb-4">
                    <h4 className="text-center">Booking Status Distribution</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={bookingChartData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >
                                {bookingChartData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, value }: { title: string; value: number }) => (
    <div className="col">
        <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
                <h5 className="card-title">{title}</h5>
                <p className="card-text fs-4 fw-bold">{value}</p>
            </div>
        </div>
    </div>
);

export default AdminDashboard;
