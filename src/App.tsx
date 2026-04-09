import { FormEvent, useMemo, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';

const services = [
  { title: 'Preventive Care', text: 'Cleanings, exams, and early intervention for healthier smiles.' },
  { title: 'Cosmetic Dentistry', text: 'Whitening, veneers, and smile design tailored to you.' },
  { title: 'Restorative Treatments', text: 'Crowns, fillings, and implants that restore confidence.' },
  { title: 'Pediatric Dentistry', text: 'Friendly care for kids with a calm, welcoming experience.' }
];

const testimonials = [
  { name: 'Ariana', text: 'The online booking and reminders made the whole visit painless.' },
  { name: 'Dev', text: 'Clear time slots, fast contact, and a team that actually follows up.' },
  { name: 'Mina', text: 'The medicine tracker was helpful after my procedure.' }
];

const faqItems = [
  { q: 'How do I book an appointment?', a: 'Use the booking form to choose a date, time slot, and preferred service.' },
  { q: 'Can I check available time slots first?', a: 'Yes. Available slots are shown in real time for the selected date.' },
  { q: 'Do you provide medicine guidance after treatment?', a: 'Yes. The medicines section outlines prescribed medicines and reminders.' }
];

const medicinePlan = [
  { name: 'Amoxicillin', dose: '500 mg', timing: 'After meals, twice daily' },
  { name: 'Ibuprofen', dose: '400 mg', timing: 'As directed for pain relief' },
  { name: 'Mouth rinse', dose: '15 ml', timing: 'Morning and night' }
];

const slotMap: Record<string, string[]> = {
  morning: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM'],
  afternoon: ['1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM'],
  evening: ['5:00 PM', '5:30 PM', '6:00 PM']
};

function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Smile Bloom Dental Clinic</p>
          <h1>Modern dental care for everyday life.</h1>
        </div>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/appointments">Book Appointment</NavLink>
          <NavLink to="/medicines">Medicines</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/auth">Sign Up</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Open daily with flexible time slots, appointment reminders, and patient-friendly support.</p>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero card">
        <div>
          <p className="section-label">Welcome</p>
          <h2>Book, check, and manage dental care in one place.</h2>
          <p>
            Patients can contact us, reserve appointments, check available time slots, review prescribed medicines,
            and sign up for a smoother care journey.
          </p>
          <div className="hero-actions">
            <NavLink className="button primary" to="/appointments">Book an appointment</NavLink>
            <NavLink className="button secondary" to="/contact">Contact us</NavLink>
          </div>
        </div>
        <div className="hero-panel">
          <div>
            <span>Today</span>
            <strong>22 open slots</strong>
          </div>
          <div>
            <span>Average response</span>
            <strong>Under 10 minutes</strong>
          </div>
          <div>
            <span>Patient support</span>
            <strong>24/7 online forms</strong>
          </div>
        </div>
      </section>

      <section className="grid two-up">
        {services.map((service) => (
          <article className="card" key={service.title}>
            <p className="section-label">Service</p>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </article>
        ))}
      </section>

      <section className="grid two-up">
        <article className="card">
          <p className="section-label">Why patients choose us</p>
          <h3>Fast booking, clear timing, and follow-up support.</h3>
          <p>
            The site is designed around the tasks people need most: appointment booking, slot selection, contact,
            and treatment follow-up.
          </p>
        </article>
        <article className="card">
          <p className="section-label">Hours</p>
          <h3>Mon-Sat, 9:00 AM to 7:00 PM</h3>
          <p>Emergency contact options and same-day availability are shown in the booking flow.</p>
        </article>
      </section>

      <section className="grid three-up">
        {testimonials.map((item) => (
          <article className="card" key={item.name}>
            <p className="quote">"{item.text}"</p>
            <strong>{item.name}</strong>
          </article>
        ))}
      </section>

      <section className="card faq">
        <p className="section-label">FAQ</p>
        <div className="faq-list">
          {faqItems.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function ServicesPage() {
  return (
    <section className="page-stack">
      <div className="card">
        <p className="section-label">Services</p>
        <h2>Complete care for preventive, cosmetic, and restorative needs.</h2>
      </div>
      <div className="grid two-up">
        {services.map((service) => (
          <article className="card" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AppointmentsPage() {
  const [date, setDate] = useState('');
  const [period, setPeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [slot, setSlot] = useState('9:00 AM');
  const [status, setStatus] = useState('Choose a date to see slots.');
  const availableSlots = useMemo(() => slotMap[period], [period]);

  const handleCheckSlots = (event: FormEvent) => {
    event.preventDefault();
    if (!date) {
      setStatus('Please select a date first.');
      return;
    }
    setStatus(`Available ${period} slots on ${date}: ${availableSlots.join(', ')}.`);
  };

  const handleBook = (event: FormEvent) => {
    event.preventDefault();
    if (!date) {
      setStatus('Please choose a date before booking.');
      return;
    }
    setStatus(`Appointment reserved for ${date} at ${slot}. We will send a confirmation message.`);
  };

  return (
    <section className="grid two-up page-stack">
      <form className="card form" onSubmit={handleBook}>
        <p className="section-label">Book Appointment</p>
        <h2>Reserve a visit in a few steps.</h2>
        <label>
          Date
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          Time of day
          <select value={period} onChange={(event) => setPeriod(event.target.value as typeof period)}>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </label>
        <label>
          Available slot
          <select value={slot} onChange={(event) => setSlot(event.target.value)}>
            {availableSlots.map((entry) => (
              <option key={entry} value={entry}>{entry}</option>
            ))}
          </select>
        </label>
        <div className="inline-actions">
          <button className="button secondary" type="button" onClick={handleCheckSlots}>Check time slot</button>
          <button className="button primary" type="submit">Confirm booking</button>
        </div>
      </form>

      <article className="card">
        <p className="section-label">Booking status</p>
        <h2>{status}</h2>
        <p>
          After booking, the clinic can use this space to display confirmations, preparation instructions, and
          follow-up reminders.
        </p>
      </article>
    </section>
  );
}

function MedicinesPage() {
  return (
    <section className="page-stack">
      <div className="card">
        <p className="section-label">Prescribed Medicines</p>
        <h2>Track aftercare medicine instructions and reminders.</h2>
      </div>
      <div className="grid three-up">
        {medicinePlan.map((item) => (
          <article className="card" key={item.name}>
            <h3>{item.name}</h3>
            <p>{item.dose}</p>
            <p>{item.timing}</p>
          </article>
        ))}
      </div>
      <article className="card">
        <p className="section-label">Reminder</p>
        <p>Send medicine reminder notifications after treatment and show dosage guidance on the patient dashboard.</p>
      </article>
    </section>
  );
}

function ContactPage() {
  const [message, setMessage] = useState('');

  return (
    <section className="grid two-up page-stack">
      <form className="card form" onSubmit={(event) => {
        event.preventDefault();
        setMessage('Thanks for reaching out. The clinic will contact you shortly.');
      }}>
        <p className="section-label">Contact Us</p>
        <h2>Ask a question or request a call back.</h2>
        <label>
          Name
          <input type="text" placeholder="Your name" />
        </label>
        <label>
          Phone or email
          <input type="text" placeholder="Contact detail" />
        </label>
        <label>
          Message
          <textarea rows={4} placeholder="How can we help?" />
        </label>
        <button className="button primary" type="submit">Send message</button>
      </form>
      <article className="card">
        <p className="section-label">Clinic info</p>
        <h2>Visit, call, or book online anytime.</h2>
        <p>Open daily, fast follow-up, and digital appointment handling for busy patients.</p>
        <p>{message}</p>
      </article>
    </section>
  );
}

function AuthPage() {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  return (
    <section className="grid two-up page-stack">
      <article className="card form">
        <p className="section-label">Sign Up / Login</p>
        <div className="inline-tabs">
          <button className={mode === 'signup' ? 'tab active' : 'tab'} onClick={() => setMode('signup')} type="button">Sign up</button>
          <button className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => setMode('login')} type="button">Login</button>
        </div>
        {mode === 'signup' ? (
          <>
            <h2>Create your patient account.</h2>
            <label>
              Full name
              <input type="text" placeholder="Full name" />
            </label>
            <label>
              Email
              <input type="email" placeholder="Email address" />
            </label>
            <label>
              Password
              <input type="password" placeholder="Create password" />
            </label>
            <button className="button primary" type="button">Create account</button>
          </>
        ) : (
          <>
            <h2>Welcome back.</h2>
            <label>
              Email
              <input type="email" placeholder="Email address" />
            </label>
            <label>
              Password
              <input type="password" placeholder="Password" />
            </label>
            <button className="button primary" type="button">Login</button>
          </>
        )}
      </article>
      <article className="card">
        <p className="section-label">Patient dashboard</p>
        <h2>Account access keeps bookings, reminders, and medicine plans in one place.</h2>
        <p>Use this area later for appointment history, saved family members, and treatment documents.</p>
      </article>
    </section>
  );
}

export default App;