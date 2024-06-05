import React, { useState, useEffect, useRef } from 'react';
import './Faq.scss';
import { Link } from 'react-router-dom';

const faqSections = [
  {
    title: 'Understanding the Bartering System',
    id: 'understanding-bartering',
    questions: [
      {
        question: 'What is the Bartering System?',
        answer: (
          <>
  
            Our bartering system allows users to exchange skills and services without the need for monetary transactions. It's a unique way to leverage your talents and receive services in return.
          </>
        ),
      },
    ],
  },
  {
    title: 'Calculating Equivalency',
    id: 'calculating-equivalency',
    questions: [
      {
        question: 'How do we calculate equivalency?',
        answer: (
          <>
            Equivalency is calculated based on several factors:
            <br />
            <ul>
              <li><strong>User Ratings:</strong> The average rating of both the buyer and the seller.</li>
              <li><strong>Skill Ratings:</strong> The average rating of the skills being exchanged.</li>
              <li><strong>Category Weightage:</strong> Different categories have different weightages, reflecting their demand and complexity.</li>
              <li><strong>Price:</strong> The listed price of the skills.</li>
            </ul>
            <br />
            <p>The formula used is:</p>
            <pre>
              <code>
                Equivalency = (min(Skill Value 1, Skill Value 2) / max(Skill Value 1, Skill Value 2)) * 100
              </code>
            </pre>
            <br />
            <p>Where:</p>
            <pre>
              <code>
                Skill Value = Price * Category Weightage * User Rating * Skill Rating
              </code>
            </pre>
          </>
        ),
      },
    ],
  },
  {
    title: 'System Operation',
    id: 'system-operation',
    questions: [
      {
        question: 'How does the system work?',
        answer: (
          <ol>
            <li><strong>Selection:</strong> Choose the skill you want to barter.</li>
            <li><strong>Match:</strong> Find a matching skill from another user.</li>
            <li><strong>Equivalency Calculation:</strong> The system calculates the equivalency score to ensure a fair trade.</li>
            <li><strong>Agreement:</strong> Both parties agree to the terms of the trade.</li>
            <li><strong>Exchange:</strong> Complete the exchange of services.</li>
          </ol>
        ),
      },
    ],
  },
  {
    title: 'Category Weightage',
    id: 'category-weightage',
    questions: [
      {
        question: 'Why is there a category weightage?',
        answer: (
          <>
            Different categories have varying levels of demand and complexity. Category weightage ensures that the value of skills in high-demand categories is appropriately reflected.
          </>
        ),
      },
    ],
  },
  {
    title: 'Equivalency Score',
    id: 'equivalency-score',
    questions: [
      {
        question: 'What if the equivalency score is low?',
        answer: (
          <>
            If the equivalency score is below the 80% threshold, the user with the lower skill value will have to pay compensation to the other party.
          </>
        ),
      },
    ],
  },
  {
    title: 'Multiple Skills',
    id: 'multiple-skills',
    questions: [
      {
        question: 'Can I barter multiple skills at once?',
        answer: (
          <>
            Currently, the system supports one-to-one bartering. For multiple skills, separate exchanges would need to be initiated.
          </>
        ),
      },
    ],
  },
  {
    title: 'Skill Availability',
    id: 'skill-availability',
    questions: [
      {
        question: 'How do I know if a skill is available for barter?',
        answer: (
          <>
            Skills available for barter are listed in the marketplace. You can browse and select from the available options.
          </>
        ),
      },
    ],
  },
  {
    title: 'Disputes',
    id: 'disputes',
    questions: [
      {
        question: 'Is there any support for disputes?',
        answer: (
          <>
            Yes, our support team is available to assist with any disputes or issues that arise during the bartering process.
          </>
        ),
      },
    ],
  },
];

const Faq = () => {
  const [activeSection, setActiveSection] = useState(faqSections[0].id);
  const sectionRefs = useRef(faqSections.map(() => React.createRef()));

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sectionRefs.current.map(ref => ref.current.offsetTop);
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const activeIndex = offsets.findIndex((offset, index) => scrollPosition < offsets[index + 1] && scrollPosition >= offset);
      setActiveSection(faqSections[activeIndex]?.id);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const section = sectionRefs.current.find(ref => ref.current.id === id);
    section.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="faq-page">

      <div className="containerfaqall">
      <div className="sidebar">
        <ul>
          {faqSections.map(section => (
            <li
              key={section.id}
              className={activeSection === section.id ? 'active' : ''}
              onClick={() => scrollToSection(section.id)}
            >
              {section.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="faq">
        <div className="container">
          <span className="breadcrumbs"><Link className='link' to="/">USMTALENT</Link> {'>'} FAQ</span>
          <h1>FAQs - Bartering System</h1>
          <div className="faqcontainer">
            {faqSections.map((section, index) => (
              <div key={section.id} id={section.id} ref={sectionRefs.current[index]} className="faq-section">
                <h2>{section.title}</h2>
                <br />
                {section.questions.map((q, i) => (
                  <div key={i} className="faq-question">
                    <h3>{q.question}</h3>
                    <p>{q.answer}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Faq;
