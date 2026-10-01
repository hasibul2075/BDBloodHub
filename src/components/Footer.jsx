function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <img
            src="/logo.png"
            alt="BDBloodHub"
            className="footer-logo"
          />

          <p>
            Connecting blood donors with people in need.
            <br />
            Together, we can save more lives.
          </p>
        </div>


        {/* QUICK LINKS */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <a href="/">Home</a>

          <a href="/find-donors">
            Find Donors
          </a>

          <a href="/become-donor">
            Become a Donor
          </a>

          <a href="/about">
            About Us
          </a>
        </div>


        {/* GET INVOLVED */}
        <div className="footer-column">
          <h3>Get Involved</h3>

          <a href="/become-donor">
            Register as Donor
          </a>

          <a href="/find-donors">
            Find Blood
          </a>

          <a href="/find-donors">
            Emergency Request
          </a>

          <a href="mailto:support@bdbloodhub.com">
            Contact Us
          </a>
        </div>


        {/* CONTACT */}
        <div className="footer-column">
          <h3>Contact</h3>

          <p>📍 Bangladesh</p>

          <p>
            📧 support@bdbloodhub.com
          </p>

          <p>
            📞 +880 1XXX-XXXXXX
          </p>
        </div>

      </div>


      <div className="footer-bottom">
        © 2026 BD Blood Hub. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;