import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Header = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");


    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleNav = () => setIsNavOpen(!isNavOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUsername("");
        navigate("/login");
    };
    
    const isTokenExpired = (token: string): boolean => {
        try {
            const [, payload] = token.split('.');
            const decodedPayload = JSON.parse(atob(payload));
            const currentTime = Math.floor(Date.now() / 1000);
            return decodedPayload.exp < currentTime;
        } catch (error) {
            return true; // Treat malformed tokens as expired
        }
    };


    // Scroll visibility logic
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setIsVisible(currentY < lastScrollY || currentY < 100);
            setLastScrollY(currentY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Auth check
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        const userRole = localStorage.getItem("role");

        if (token && user) {
            if (isTokenExpired(token)) {
                logout();
            } else {
                setIsLoggedIn(true);
                setUsername(user || "User");
                setRole(userRole || ""); // Set role
            }
        }
    }, []);



    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !(dropdownRef.current as HTMLElement).contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <header className={`bg-white shadow-sm sticky-top border-bottom transition-all ${isVisible ? "top-0" : "-top-100"} z-1030`}>
            <nav className="navbar navbar-expand-lg px-4 px-lg-5">
                <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fs-3 fw-bold text-primary">
                    ✈️ <span className="text-dark">SkySync</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleNav}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}>
                    <ul className="navbar-nav ms-auto align-items-center gap-lg-4 fw-medium">
                        {role === "ADMIN" && (
                            <li className="nav-item">
                                <Link to="/admin" className="nav-link text-dark">Admin</Link>
                            </li>
                        )}
                        {role === "USER" && (
                        <li className="nav-item">
                            <Link to="/reservationPage" className="nav-link text-dark">Reservations</Link>
                            </li>)}
                        {role === "USER" && (
                        <li className="nav-item">
                            <Link to="/group" className="nav-link text-dark">Group-Trip</Link>
                        </li>
                        )}
                        

                        {!isLoggedIn ? (
                            <li className="nav-item ms-3">
                                <Link to="/login">
                                    <button className="btn btn-primary px-4">Sign In</button>
                                </Link>
                            </li>
                        ) : (
                            <li className="nav-item dropdown position-relative ms-3" ref={dropdownRef}>
                                <button
                                    className="btn d-flex align-items-center border-0 bg-transparent"
                                    onClick={toggleDropdown}
                                >
                                    <img
                                        src={'src/assets/userimage.jpg'}
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
                                            <button
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    navigate("/dashboard");
                                                }}
                                            >
                                                Profile
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    navigate("/settings");
                                                }}
                                            >
                                                Settings
                                            </button>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button
                                                className="dropdown-item text-danger"
                                                onClick={logout}
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
