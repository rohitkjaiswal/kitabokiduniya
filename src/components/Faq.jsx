// src/components/Faq.jsx

import React, { useState } from "react";
import faqData from "../data/faqData";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">📚 Frequently Asked Questions</h2>
      <div className="accordion" id="faqAccordion">
        {faqData.map((faq, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header" id={`heading${index}`}>
              <button
                className={`accordion-button ${activeIndex === index ? "" : "collapsed"}`}
                type="button"
                onClick={() => toggle(index)}
              >
                {faq.question}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className={`accordion-collapse collapse ${activeIndex === index ? "show" : ""}`}
              aria-labelledby={`heading${index}`}
            >
              <div className="accordion-body">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
