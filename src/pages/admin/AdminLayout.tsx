import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="d-flex min-vh-100" style={{ overflow: 'hidden' }}>
            <aside className="bg-dark text-white p-4" style={{ width: '250px' }}>
                <h2 className="h4 mb-4">Admin Panel</h2>
                <nav className="nav flex-column">
                    <NavLink to="/admin" className="nav-link text-white mb-2">
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/flights" className="nav-link text-white mb-2">
                        Flights
                    </NavLink>
                    <NavLink to="/admin/airports" className="nav-link text-white mb-2">
                        Airports
                    </NavLink>
                    <NavLink to="/admin/aircrafts" className="nav-link text-white mb-2">
                        Aircrafts
                    </NavLink>
                    <NavLink to="/admin/users" className="nav-link text-white mb-2">
                        Users
                    </NavLink>
                    <NavLink to="/admin/reservations" className="nav-link text-white mb-2">
                        Reservations
                    </NavLink>
                </nav>
            </aside>

            <main className="flex-grow-1 bg-light p-4 overflow-auto" style={{ height: '100vh' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
