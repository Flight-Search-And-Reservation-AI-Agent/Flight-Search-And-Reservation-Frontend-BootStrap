import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FlightSearchForm from '../components/ui/FlightSearchForm';
import Footer from '../components/ui/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function MyComponent() {
    const destinations = [
        { city: "Paris", image: "/pic2.jpg" },
        { city: "Tokyo", image: "/pic1.jpg" },
        { city: "New York", image: "/pic2.jpg" },
    ];

    const features = [
        { title: "Best Price Guarantee", icon: "💸" },
        { title: "24/7 Customer Support", icon: "📞" },
        { title: "Secure Booking", icon: "🔒" },
    ];

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    useEffect(() => {
        if (location.state?.fromLogin) {
            navigate(location.pathname, { replace: true, state: {} });
            window.location.reload();
        }
    }, [location, navigate]);

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <main className="flex-grow-1">

                {/* Hero Section */}
                <section className=" bg-white" data-aos="fade-up">
                        <FlightSearchForm />
                </section>

                {/* Group Trip Planner Section */}
                <section className="py-5 bg-light text-center" data-aos="fade-up">
                    <div className="container">
                        <h2 className="display-6 text-primary mb-3">🧑‍🤝‍🧑 Group Trip Sync Planner</h2>
                        <p className="text-muted fs-5 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                            Plan your trips seamlessly with friends and family! Create shared dashboards, vote on destinations, and coordinate travel with ease.
                        </p>
                        <Link to="/group" className="btn btn-primary btn-lg">Plan a Group Trip</Link>
                    </div>
                </section>

                {/* Popular Destinations Carousel */}
                <section className="py-5 bg-white text-center" data-aos="fade-up">
                    <div className="container">
                        <h2 className="display-6 text-primary mb-4">🌍 Explore Top Destinations</h2>
                        <div id="destinationCarousel" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-inner rounded shadow">
                                {destinations.map((dest, i) => (
                                    <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                                        <img
                                            src={dest.image}
                                            className="d-block w-100"
                                            alt={dest.city}
                                            style={{ height: '400px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                        <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded">
                                            <h5>{dest.city}</h5>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#destinationCarousel"
                                data-bs-slide="prev"
                            >
                                <span className="carousel-control-prev-icon" aria-hidden="true" />
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#destinationCarousel"
                                data-bs-slide="next"
                            >
                                <span className="carousel-control-next-icon" aria-hidden="true" />
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-5 bg-light text-center" data-aos="fade-up">
                    <div className="container">
                        <h2 className="display-6 text-primary mb-4">✨ Why Choose Us</h2>
                        <div className="row g-4 justify-content-center">
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
