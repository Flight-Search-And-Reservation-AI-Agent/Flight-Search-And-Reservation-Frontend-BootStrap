const Footer = () => (
    <footer className="bg-primary text-white py-5">
        <div className="container text-center text-md-left">
            <div className="row">
                <div className="col-md-6">
                    <h3 className="h4 font-weight-bold mb-2">✈️ Flight Booking</h3>
                    <p className="text-muted">Seamless travel planning for solo and group adventures.</p>
                </div>
                <div className="col-md-6 mt-4 mt-md-0 text-md-right">
                    <p className="text-muted mb-0">© {new Date().getFullYear()} Flight Booking App. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
