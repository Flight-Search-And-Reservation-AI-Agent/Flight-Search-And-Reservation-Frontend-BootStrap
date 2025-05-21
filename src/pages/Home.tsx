// import  { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/ui/Footer';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FlightSearchForm from '../components/ui/FlightSearchForm';

export default function MyComponent() {
    // const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

    const destinations = [
        { city: "Paris", image: "src/assets/pic2.jpg" },
        { city: "Tokyo", image: "src/assets/pic1.jpg" },
        { city: "New York", image: "src/assets/pic2.jpg" },
    ];

    const features = [
        { title: "Best Price Guarantee", icon: "💸" },
        { title: "24/7 Customer Support", icon: "📞" },
        { title: "Secure Booking", icon: "🔒" },
    ];
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.fromLogin) {
            // Clear state to avoid infinite reload loop
            navigate(location.pathname, { replace: true, state: {} });

            // Trigger a hard reload
            window.location.reload();
        }
    }, [location, navigate]);
    
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <main className="flex-grow-1">
                {/* Hero Section */}
                <FlightSearchForm/>

                {/* Group Trip Planner Section */}
                <section className="py-5 bg-light text-center">
                    <div className="container">
                        <h2 className="display-6 text-primary mb-3">🧑‍🤝‍🧑 Group Trip Sync Planner</h2>
                        <p className="text-muted fs-5 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                            Plan your trips seamlessly with friends and family! Create shared dashboards, vote on destinations, and coordinate travel with ease.
                        </p>
                        <Link to="/group" className="btn btn-primary btn-lg">Plan a Group Trip</Link>
                    </div>
                </section>

                {/* Popular Destinations */}
                <section className="py-5 bg-white">
                    <div className="container text-center">
                        <h2 className="display-6 text-primary mb-4">🌍 Popular Destinations</h2>
                        <div className="row g-4">
                            {destinations.map((dest, i) => (
                                <div key={i} className="col-md-4">
                                    <div className="card shadow h-100">
                                        <img src={dest.image} className="card-img-top" alt={dest.city} style={{ height: '200px', objectFit: 'cover' }} />
                                        <div className="card-body">
                                            <h5 className="card-title">{dest.city}</h5>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-5 bg-light text-center">
                    <div className="container">
                        <h2 className="display-6 text-primary mb-4">✨ Why Choose Us</h2>
                        <div className="row g-4">
                            {features.map((feature, i) => (
                                <div key={i} className="col-md-4">
                                    <div className="card p-4 h-100 shadow-sm">
                                        <div className="fs-1 mb-3">{feature.icon}</div>
                                        <h5 className="card-title">{feature.title}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
