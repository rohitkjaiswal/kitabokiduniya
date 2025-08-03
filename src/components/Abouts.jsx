import React from "react";
import "./AboutUs.css"; // optional if you want custom styling
import DynamicHero from "./DynamicHero";

const AboutUs = () => {
  return (
    <> <DynamicHero />
      <div className="container mt-5 mb-5">
       

      <h1 className="text-center mb-4">📖 About Us – Kitabo ki Duniya</h1>

      <div className="mb-4">
        <h4>👋 Who are we?</h4>
        <p>
          Welcome to <strong>Kitabo ki Duniya</strong> – a virtual bookland where imagination runs wild,
          characters live rent-free in your head, and PDFs are your best friends (after chai, of course ☕).
        </p>
        <p>
          Created by a passionate bookworm (yes, that’s me 😎), this platform is a labor of love — love for
          literature, Indian classics, and the satisfaction of finishing a book at 3 AM.
        </p>
      </div>

      <div className="mb-4">
        <h4>📚 What do we offer?</h4>
        <ul>
          <li>✨ A collection of handpicked <strong>fiction & non-fiction</strong> books in PDF form</li>
          <li>🖋️ Featured sections on legendary authors like <strong>Kabir Sahab</strong> and <strong>Premchand</strong></li>
          <li>🔍 Genre-based exploration — so you find what fits your reading mood (even your 2-minute moods)</li>
          <li>🚪 Access-controlled PDFs (you gotta log in, we’re not a public library 😅)</li>
        </ul>
      </div>

      <div className="mb-4">
        <h4>🚀 Our Mission</h4>
        <p>
          To make reading fun again. Not just for toppers and literature majors, but for anyone who’s ever
          wanted to escape into another world, learn something new, or just feel smart while scrolling.
        </p>
        <p>
          We believe in <strong>free access to knowledge</strong>, but also believe in keeping bots, freeloaders,
          and sleepy readers accountable with a login wall 😴.
        </p>
      </div>

      <div className="mb-4">
        <h4>🔐 Why trust us?</h4>
        <p>
          We don’t collect your data. We don’t care what genre you like (even if it’s vampire romance 💔🧛). We just
          want you to find your next favorite book without distractions or pop-up ads promising free iPhones.
        </p>
      </div>

      <div className="mb-4">
        <h4>🧑‍💻 Behind the scenes</h4>
        <p>
          This site is built with React, heart, and a lot of caffeine. I’m a solo dev who loves good UI, good
          stories, and good memes.
        </p>
        <p>
          If you enjoy this platform, consider sharing it with a fellow book-lover or chai-drinker.
        </p>
      </div>

      <div className="mb-4">
        <h4>📮 Get in touch</h4>
        <p>
          Have feedback, book suggestions, or just want to say hi? Reach out at:{" "}
          <a href="mailto:rohitkumarj243@gmail..com">rohitkumarj243@gmail.com</a> <br />
          Or scream your favorite book quote into the void — I’ll probably hear it. 📢
        </p>
      </div>

      <div className="text-center mt-5">
        <p>Made with ❤️ for books, chai, and people who read till 4 AM.</p>
      </div>
    </div></>
  );
};

export default AboutUs;
