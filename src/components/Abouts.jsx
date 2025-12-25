import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="container-fluid mt-5 mb-5 p-5 about-us">
      {/* Title */}
      <h1 className="text-center mb-5 fw-bold">About Us – Kitabo ki Duniya</h1>

      {/* Who we are */}
      <section className="mb-5">
        <h3 className="fw-semibold">Who We Are</h3>
        <p>
          Welcome to <strong>Kitabo ki Duniya</strong> – a digital library built
          for readers who value imagination, knowledge, and accessibility. This
          platform was created by a passionate developer and book enthusiast,
          with the vision of bringing literature closer to everyone in a modern,
          user-friendly way.
        </p>
        <p>
          We are more than just a repository of PDFs. We are a growing
          community, a place where stories meet technology, and where readers
          can discover, share, and enjoy books without distractions.
        </p>
      </section>

      {/* What we offer */}
      <section className="mb-5">
        <h3 className="fw-semibold">What We Offer</h3>
        <ul>
          <li>A curated collection of fiction and non-fiction books in digital format</li>
          <li>Featured sections on legendary authors such as Kabir and Premchand</li>
          <li>Genre-based exploration for personalized reading experiences</li>
          <li>Access-controlled resources to ensure quality and accountability</li>
          <li>Educational materials for students and lifelong learners</li>
          <li>Community-driven recommendations and reviews</li>
        </ul>
      </section>

      {/* Mission */}
      <section className="mb-5">
        <h3 className="fw-semibold">Our Mission</h3>
        <p>
          Our mission is to make reading enjoyable and accessible for everyone —
          from casual readers to dedicated scholars. We aim to revive the joy of
          reading by combining timeless literature with modern technology.
        </p>
      </section>

      {/* Vision */}
      <section className="mb-5">
        <h3 className="fw-semibold">Our Vision</h3>
        <p>
          To become India’s most trusted and loved digital library, bridging the
          gap between traditional literature and modern digital platforms. We
          envision a space where every reader finds something that inspires,
          educates, or entertains.
        </p>
      </section>

      {/* Values */}
      <section className="mb-5">
        <h3 className="fw-semibold">Our Core Values</h3>
        <ul>
          <li><strong>Knowledge:</strong> Books are the foundation of learning.</li>
          <li><strong>Community:</strong> Readers grow together through shared experiences.</li>
          <li><strong>Creativity:</strong> Every story is a spark for imagination.</li>
          <li><strong>Trust:</strong> We respect your privacy and ensure a safe environment.</li>
          <li><strong>Innovation:</strong> Constantly evolving with modern technology.</li>
        </ul>
      </section>

      {/* Community */}
      <section className="mb-5">
        <h3 className="fw-semibold">Our Community</h3>
        <p>
          Kitabo ki Duniya is not just a platform, but a community of readers,
          writers, and learners. We encourage discussions, host recommendations,
          and celebrate the joy of reading together. Future plans include forums,
          contests, and book clubs to connect readers worldwide.
        </p>
      </section>

      {/* Roadmap */}
      <section className="mb-5">
        <h3 className="fw-semibold">Future Roadmap</h3>
        <ul>
          <li>Mobile application for seamless reading on the go</li>
          <li>Audio versions of selected books</li>
          <li>Gamified reading challenges and achievement badges</li>
          <li>Multilingual support for regional and global literature</li>
          <li>Personalized analytics for tracking reading habits</li>
        </ul>
      </section>

      {/* Contact */}
      <section className="mb-5">
        <h3 className="fw-semibold">Get in Touch</h3>
        <p>
          We welcome feedback, suggestions, and collaborations. Reach out to us:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:kitabiTouch@gmail.com">kitabiTouch@gmail.com</a>
          <br />
          <strong>Instagram:</strong> <a href="#">kitabiOfficial</a>
          <br />
          <strong>WhatsApp:</strong> <a href="#">kitabiTouchCommunity</a>
        </p>
      </section>

      {/* Acknowledgements */}
      <section className="mb-5">
        <h3 className="fw-semibold">Acknowledgements</h3>
        <p>
          We extend our gratitude to every reader who has joined us on this
          journey. Your support fuels our growth. Special thanks to the
          open-source community, fellow developers, and everyone who believes in
          the power of books.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center mt-5">
        <p>
          Made with dedication for readers and learners. <br />
          © {new Date().getFullYear()} Kitabo ki Duniya. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AboutUs;