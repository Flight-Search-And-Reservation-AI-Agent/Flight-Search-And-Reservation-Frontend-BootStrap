const AdminDashboard = () => {
    return (
        <div className="container-fluid bg-light min-vh-100 py-4">
            <h1 className="display-4 text-dark mb-4 text-center">Admin Dashboard</h1>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-4 px-4">
                <div className="col">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Flights</h5>
                            <p className="card-text fs-4 fw-bold">42</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title">Users</h5>
                            <p className="card-text fs-4 fw-bold">200</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title">Bookings</h5>
                            <p className="card-text fs-4 fw-bold">115</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title">Airports</h5>
                            <p className="card-text fs-4 fw-bold">12</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title">Aircrafts</h5>
                            <p className="card-text fs-4 fw-bold">25</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
