function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Search for a Donor",
      text: "Select your required blood group and enter your location to find nearby donors.",
    },
    {
      number: "02",
      title: "Choose a Donor",
      text: "Browse available donors and check their blood group, location and availability.",
    },
    {
      number: "03",
      title: "Contact & Donate",
      text: "Contact the donor directly and coordinate the blood donation process.",
    },
  ];

  return (
    <section className="how-it-works">
      <div className="container">

        <span className="section-tag">HOW IT WORKS</span>

        <h2 className="section-title">
          Get Blood in 3 Simple Steps
        </h2>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>

              <div className="step-number">
                {step.number}
              </div>

              <h3>{step.title}</h3>

              <p>{step.text}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;