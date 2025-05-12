import { Link } from "react-router-dom";
import { useState } from "react";

// Replace with actual auth logic later
const isLoggedIn = false;
const username = "Divay";
const avatarImg = "/avatar.png"; // placeholder image

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const logout = () => {
        console.log("Logging out...");
        // Add logout logic here
    };

    return (
        <header className="bg-white shadow-sm sticky-top border-bottom">
            <div className="container-fluid d-flex justify-content-between align-items-center py-3 px-3 px-md-5">
                {/* Brand */}
                <Link
                    to="/"
                    className="navbar-brand d-flex align-items-center gap-2 fs-4 fw-bold text-primary text-decoration-none"
                >
                    ✈️ <span className="text-dark">SkySync</span>
                </Link>

                {/* Navigation */}
                <ul className="nav d-flex align-items-center gap-3 mb-0">
                    <li className="nav-item">
                        <Link to="/dashboard" className="nav-link text-dark fw-medium">
                            Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin" className="nav-link text-dark fw-medium">
                            Admin
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/reservationPage" className="nav-link text-dark fw-medium">
                            Reservations
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/group" className="nav-link text-dark fw-medium">
                            Group Trip
                        </Link>
                    </li>

                    {/* Right Side: Sign In or Avatar */}
                    {!isLoggedIn ? (
                        <li className="nav-item ms-2">
                            <Link to="/login">
                                <button className="btn btn-primary px-4">Sign In</button>
                            </Link>
                        </li>
                    ) : (
                        <li className="nav-item dropdown position-relative ms-2">
                            <button
                                className="btn d-flex align-items-center border-0 bg-transparent"
                                onClick={toggleDropdown}
                            >
                                <img
                                    src={avatarImg}
                                    alt="Avatar"
                                    className="rounded-circle me-2"
                                    width="32"
                                    height="32"
                                />
                                <span className="fw-semibold text-dark">{username}</span>
                            </button>

                            {isDropdownOpen && (
                                <ul className="dropdown-menu show position-absolute end-0 mt-2">
                                    <li>
                                        <Link className="dropdown-item" to="/dashboard">
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/settings">
                                            Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={logout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Header;
