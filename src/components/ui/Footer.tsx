const Footer = () => (
    <footer className="bg-primary text-light py-4 mt-auto">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-md-6 mb-3 mb-md-0">
                    <h5 className="fw-bold mb-2">
                        <span role="img" aria-label="plane">✈️</span> SkySky
                    </h5>
                    <p className="mb-0 small text-muted">
                        Seamless travel planning for solo and group adventures. Book smarter, fly better.
                    </p>
                </div>
                <div className="col-md-6 text-md-end">
                    <div className="mb-2">
                        <a href="#" className="text-light me-3 text-decoration-none">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-light text-decoration-none">
                            Terms of Service
                        </a>
                    </div>
                    <small className="text-muted">
                        © {new Date().getFullYear()} Flight Booking App. All rights reserved.
                    </small>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
