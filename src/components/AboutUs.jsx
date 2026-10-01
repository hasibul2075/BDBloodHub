import {
  FaTint,
  FaSearch,
  FaUserPlus,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

function AboutUs() {
  return (
    <main className="about-page">

      {/* PAGE HEADER */}
      <section className="about-header">
        <div className="container">
          <span className="section-tag">ABOUT US</span>

          <h1>Connecting People Through Blood</h1>

          <p>
            BDBloodHub is a simple platform that helps people
            find blood donors and makes it easier for donors to
            help someone in need.
          </p>
        </div>
      </section>


      {/* ABOUT SECTION */}
      <section className="about-main">
        <div className="container">

          <div className="about-grid">

            <div className="about-content">
              <span className="section-tag">
                WHO WE ARE
              </span>

              <h2>
                Making Blood Donation
                <span> Easier & Faster</span>
              </h2>

              <p>
                BDBloodHub is a blood donor platform designed to
                connect people who need blood with available
                donors across Bangladesh.
              </p>

              <p>
                Our goal is to make the process of finding a
                blood donor simple, accessible and convenient.
                Instead of searching through different sources,
                people can use one platform to find donors based
                on blood group and location.
              </p>

              <p>
                At the same time, people who are willing to donate
                blood can register themselves and become part of
                a community that helps others when they need it
                most.
              </p>
            </div>


            <div className="about-highlight">
              <div className="about-highlight-icon">
                <FaHeart />
              </div>

              <h3>
                Every Donor Can Make a Difference
              </h3>

              <p>
                A simple connection between a donor and someone
                in need can make a meaningful difference.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* MISSION SECTION */}
      <section className="mission-section">
        <div className="container">

          <div className="about-section-heading">
            <span className="section-tag">
              OUR MISSION
            </span>

            <h2>
              Helping People Find Blood When They Need It
            </h2>

            <p>
              We want to make blood donor discovery easier by
              bringing donors and people in need together through
              a simple digital platform.
            </p>
          </div>


          <div className="mission-grid">

            <div className="mission-card">
              <div className="mission-icon">
                <FaSearch />
              </div>

              <h3>Find Donors Easily</h3>

              <p>
                Search for donors using blood group and location
                to quickly discover available donors.
              </p>
            </div>


            <div className="mission-card">
              <div className="mission-icon">
                <FaUserPlus />
              </div>

              <h3>Become a Donor</h3>

              <p>
                Register as a blood donor and make yourself
                available to people who may need your help.
              </p>
            </div>


            <div className="mission-card">
              <div className="mission-icon">
                <FaMapMarkerAlt />
              </div>

              <h3>Connect Locally</h3>

              <p>
                Find blood donors based on their district or
                location across Bangladesh.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* WHY BDBLOODHUB */}
      <section className="why-about-section">
        <div className="container">

          <div className="about-section-heading">
            <span className="section-tag">
              WHY BDBLOODHUB
            </span>

            <h2>
              Simple. Accessible. Community Driven.
            </h2>

            <p>
              BDBloodHub is designed with a simple goal:
              make blood donor connections easier for everyone.
            </p>
          </div>


          <div className="why-about-grid">

            <div className="why-about-card">
              <FaTint />

              <div>
                <h3>Blood Group Focused</h3>

                <p>
                  Easily identify donors based on the blood
                  group you need.
                </p>
              </div>
            </div>


            <div className="why-about-card">
              <FaMapMarkerAlt />

              <div>
                <h3>Location Based</h3>

                <p>
                  Search for donors according to their district
                  or location.
                </p>
              </div>
            </div>


            <div className="why-about-card">
              <FaHeart />

              <div>
                <h3>Built for Community</h3>

                <p>
                  Encourage people to donate and support others
                  when help is needed.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="about-cta">
        <div className="container">

          <div className="about-cta-content">

            <span className="section-tag">
              MAKE A DIFFERENCE
            </span>

            <h2>
              Be Part of the Community
            </h2>

            <p>
              Whether you need blood or want to help someone
              through donation, BDBloodHub is here to connect you.
            </p>

            <div className="about-cta-buttons">

              <a
                href="/become-donor"
                className="about-cta-primary"
              >
                Become a Donor
              </a>

              <a
                href="/find-donors"
                className="about-cta-secondary"
              >
                Find a Donor
              </a>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default AboutUs;