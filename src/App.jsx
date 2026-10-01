import Navbar from "./components/Navbar";

import Hero from "./components/Hero";
import Stats from "./components/Stats";
import BloodGroups from "./components/BloodGroups";
import Donors from "./components/Donors";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

import FindDonors from "./components/FindDonors";
import BecomeDonor from "./components/BecomeDonor";
import AboutUs from "./components/AboutUs";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import MyDonorProfile from "./components/MyDonorProfile";

function App() {
  if (window.location.pathname === "/my-profile") {
  return (
    <>
      <Navbar />
      <div className="page-transition">
        <MyDonorProfile />
        <Footer />
      </div>
    </>
  );
}
  if (window.location.pathname === "/forgot-password") {
    return (
      <>
        <Navbar />

        <div className="page-transition">
          <ForgotPassword />
          <Footer />
        </div>
      </>
    );
  }

  if (window.location.pathname === "/reset-password") {
    return (
      <>
        <Navbar />

        <div className="page-transition">
          <ResetPassword />
          <Footer />
        </div>
      </>
    );
  }

  if (window.location.pathname === "/register") {
    return (
      <>
        <Navbar />

        <div className="page-transition">
          <Register />
          <Footer />
        </div>
      </>
    );
  }

  if (window.location.pathname === "/login") {
    return (
      <>
        <Navbar />

        <div className="page-transition">
          <Login />
          <Footer />
        </div>
      </>
    );
  }

  if (window.location.pathname === "/about") {
    return (
      <>
        <Navbar />

        <div className="page-transition">
          <AboutUs />
          <Footer />
        </div>
      </>
    );
  }

  if (window.location.pathname === "/become-donor") {
    return (
      <>
        <Navbar />

        <div className="page-transition">
          <BecomeDonor />
          <Footer />
        </div>
      </>
    );
  }

  if (window.location.pathname === "/find-donors") {
    return (
      <>
        <Navbar />

        <div className="page-transition">
          <FindDonors />
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="page-transition">
        <Hero />
        <Stats />
        <BloodGroups />
        <Donors />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>
    </>
  );
}

export default App;