function CTA() {
  return (
    <section className="cta-section">
      <div className="container cta-container">
        <div className="cta-content">
          <span className="section-tag">MAKE A DIFFERENCE</span>

          <h2>Ready to Save a Life?</h2>

          <p>
            Your one donation can help someone in need. Join BD Blood Hub
            and become a part of our lifesaving community.
          </p>

          <div className="cta-buttons">
            <a href="/become-donor" className="cta-primary">
              Become a Donor
            </a>

            <a href="/find-donors" className="cta-secondary">
              Find a Donor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;