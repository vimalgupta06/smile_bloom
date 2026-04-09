import { FormEvent, useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import {
  AppointmentRecord,
  AuthUser,
  clinicApi,
  ClinicProfile,
  DashboardData,
  MedicineItem,
  PaymentRecord,
  ServiceItem
} from './api';

const fallbackProfile: ClinicProfile = {
  doctorName: 'Dr. Ujjwal Gupta',
  contactNumber: '7531004658',
  clinicName: 'Smile Bloom Dental Clinic',
  hours: 'Mon-Sat, 9:00 AM to 7:00 PM',
  supportLine: 'Call or message for urgent help'
};

const fallbackServices: ServiceItem[] = [
  { title: 'Preventive Care', text: 'Cleanings, exams, and early intervention for healthier smiles.' },
  { title: 'Cosmetic Dentistry', text: 'Whitening, veneers, and smile design tailored to you.' },
  { title: 'Restorative Treatments', text: 'Crowns, fillings, and implants that restore confidence.' },
  { title: 'Pediatric Dentistry', text: 'Friendly care for kids with a calm, welcoming experience.' },
  { title: 'Root Canal Therapy', text: 'Pain-relieving treatment with modern, precise endodontics.' },
  { title: 'Invisible Aligners', text: 'Discreet teeth alignment with guided progress tracking.' },
  { title: 'Laser Gum Care', text: 'Low-discomfort gum therapy and periodontal maintenance.' },
  { title: 'Emergency Dentistry', text: 'Same-day support for tooth pain, trauma, and urgent care.' }
];

const fallbackMedicines: MedicineItem[] = [
  { name: 'Amoxicillin', dose: '500 mg', timing: 'After meals, twice daily' },
  { name: 'Ibuprofen', dose: '400 mg', timing: 'As directed for pain relief' },
  { name: 'Mouth rinse', dose: '15 ml', timing: 'Morning and night' }
];

const testimonials = [
  { name: 'Ariana', text: 'The online booking and reminders made the whole visit painless.' },
  { name: 'Dev', text: 'Clear time slots, fast contact, and a team that actually follows up.' },
  { name: 'Mina', text: 'The medicine tracker was helpful after my procedure.' }
];

const faqItems = [
  { q: 'How do I book an appointment?', a: 'Use the booking form to choose a date, time slot, and preferred service.' },
  { q: 'Can I check available time slots first?', a: 'Yes. Available slots are shown in real time for the selected date.' },
  { q: 'Can I pay online?', a: 'Yes. Use the payment page to pay by UPI, card, or net banking.' }
];

const clinicHighlights = [
  { label: 'Years of care', value: '12+' },
  { label: 'Happy patients', value: '18k+' },
  { label: 'Successful procedures', value: '9k+' },
  { label: 'Emergency support', value: '24/7' }
];

const locationDoctors = [
  { locationValue: 'firozabad', locationLabel: 'Firozabad', doctorValue: 'Harshit Singh', doctorLabel: 'Dr. Harshit Singh' },
  { locationValue: 'agra', locationLabel: 'Agra', doctorValue: 'Ayush Katiyar', doctorLabel: 'Dr. Ayush Katiyar' },
  { locationValue: 'khurja', locationLabel: 'Khurja', doctorValue: 'Ujjwal Gupta', doctorLabel: 'Dr. Ujjwal Gupta' },
  { locationValue: 'hathras', locationLabel: 'Hathras', doctorValue: 'Abhimanyu Pratap', doctorLabel: 'Dr. Abhimanyu Pratap' }
];

const periodOptions = ['morning', 'afternoon', 'evening'] as const;
const profileTabs = ['overview', 'appointments', 'reminders', 'payments'] as const;
type ProfileTab = (typeof profileTabs)[number];

function App() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [services, setServices] = useState(fallbackServices);
  const [medicines, setMedicines] = useState(fallbackMedicines);
  const [medicineReminder, setMedicineReminder] = useState('Send medicine reminder notifications after treatment and show dosage guidance on the patient dashboard.');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('smileBloomUser');
    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved) as AuthUser;
    } catch {
      return null;
    }
  });
  const [dashboard, setDashboard] = useState<DashboardData>({ appointments: [], reminders: [], payments: [] });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTab>('overview');

  useEffect(() => {
    clinicApi.getProfile().then(setProfile).catch(() => undefined);
    clinicApi.getServices().then(setServices).catch(() => undefined);
    clinicApi
      .getMedicines()
      .then((payload) => {
        setMedicines(payload.items);
        setMedicineReminder(payload.reminder);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      localStorage.removeItem('smileBloomUser');
      setDashboard({ appointments: [], reminders: [], payments: [] });
      return;
    }

    localStorage.setItem('smileBloomUser', JSON.stringify(currentUser));

    clinicApi.getDashboard(currentUser.email).then(setDashboard).catch(() => undefined);
  }, [currentUser]);

  const openProfilePanel = (tab: ProfileTab) => {
    setActiveProfileTab(tab);
    setShowProfilePanel(true);
    setShowProfileMenu(false);
  };

  const handleAppointmentBooked = (appointment: AppointmentRecord) => {
    if (!currentUser) {
      return;
    }

    if (appointment.email === currentUser.email) {
      setDashboard((previous) => ({
        ...previous,
        appointments: [appointment, ...previous.appointments]
      }));
    }
  };

  return (
    <div className="shell">
      <div className="floating-brand-strip" role="region" aria-label="Brand strip">
        <div className="moving-strip-track">
          <div className="moving-strip-content">
            <img src="/images/smile-bloom-logo.svg" alt="Smile Bloom logo" />
            <span>Smile Bloom - dental and facial aesthtics</span>
            <a href="https://www.instagram.com/smile_bloom__?igsh=MWRiOWJrMHBmZjVh" target="_blank" rel="noreferrer">
              Instagram: @smile_bloom__
            </a>
          </div>
          <div className="moving-strip-content" aria-hidden="true">
            <img src="/images/smile-bloom-logo.svg" alt="" />
            <span>Smile Bloom - dental and facial aesthtics</span>
            <a href="https://www.instagram.com/smile_bloom__?igsh=MWRiOWJrMHBmZjVh" target="_blank" rel="noreferrer">
              Instagram: @smile_bloom__
            </a>
          </div>
          <div className="moving-strip-content" aria-hidden="true">
            <img src="/images/smile-bloom-logo.svg" alt="" />
            <span>Smile Bloom - dental and facial aesthtics</span>
            <a href="https://www.instagram.com/smile_bloom__?igsh=MWRiOWJrMHBmZjVh" target="_blank" rel="noreferrer">
              Instagram: @smile_bloom__
            </a>
          </div>
        </div>
      </div>

      <section className="contact-strip card">
        <p>
          <strong>Clinic:</strong> Smile Bloom
        </p>
        <p>
          <strong>Contact:</strong> {profile.contactNumber}
        </p>
        <p>
          <strong>Locations:</strong> Firozabad · Agra · Khurja · Hathras
        </p>
        <div className="contact-strip-actions">
          <a className="button primary" href={`tel:${profile.contactNumber}`}>
            Call Us
          </a>
          <NavLink className="button secondary" to="/appointments">
            Book Now
          </NavLink>
        </div>
      </section>

      <header className="topbar">
        <div>
          <p className="eyebrow">{profile.clinicName}</p>
          <div className="brand-head">
            <img src="/images/smile-bloom-logo.svg" alt="Smile Bloom logo" />
            <h1>Smile Bloom Dental & Facial Aesthetics</h1>
          </div>
          <p className="subtitle">
            {profile.supportLine} · {profile.contactNumber}
          </p>
        </div>
        <div className="header-right">
          <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/appointments">Book Appointment</NavLink>
            <NavLink to="/payments">Payments</NavLink>
            <NavLink to="/medicines">Medicines</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            {!currentUser && <NavLink to="/auth">Login</NavLink>}
          </nav>

          {currentUser && (
            <div className="profile-anchor">
              <button
                className="profile-chip"
                type="button"
                onClick={() => setShowProfileMenu((value) => !value)}
                aria-label="Open profile menu"
              >
                <span>{currentUser.name.charAt(0).toUpperCase()}</span>
                <strong>{currentUser.name}</strong>
              </button>

              {showProfileMenu && (
                <div className="profile-menu card">
                  <button type="button" onClick={() => openProfilePanel('overview')}>
                    My Profile
                  </button>
                  <button type="button" onClick={() => openProfilePanel('appointments')}>
                    My Appointments
                  </button>
                  <button type="button" onClick={() => openProfilePanel('reminders')}>
                    Medicine Reminders
                  </button>
                  <button type="button" onClick={() => openProfilePanel('payments')}>
                    Payment History
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUser(null);
                      setShowProfileMenu(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage profile={profile} services={services} />} />
          <Route path="/services" element={<ServicesPage services={services} />} />
          <Route
            path="/appointments"
            element={<AppointmentsPage currentUser={currentUser} services={services} onAppointmentBooked={handleAppointmentBooked} />}
          />
          <Route path="/payments" element={<PaymentsPage currentUser={currentUser} />} />
          <Route path="/medicines" element={<MedicinesPage medicines={medicines} reminder={medicineReminder} />} />
          <Route path="/contact" element={<ContactPage profile={profile} />} />
          <Route path="/auth" element={<AuthPage onAuthSuccess={setCurrentUser} />} />
        </Routes>
      </main>

      <footer className="footer card">
        <p>Mobile-friendly booking and follow-up for patients on phone or desktop.</p>
        <strong>Smile Bloom · {profile.contactNumber}</strong>
        <p>Copyright@2026 Smile Bloom. All rights reserved.</p>
      </footer>

      {showProfilePanel && currentUser && (
        <ProfilePanel
          user={currentUser}
          dashboard={dashboard}
          activeTab={activeProfileTab}
          onTabChange={setActiveProfileTab}
          onClose={() => setShowProfilePanel(false)}
        />
      )}
    </div>
  );
}

function HomePage({ profile, services }: { profile: ClinicProfile; services: ServiceItem[] }) {
  return (
    <>
      <section className="hero card float-in">
        <div>
          <p className="section-label">Welcome</p>
          <h2>Book, check, and manage dental care on your phone.</h2>
          <p>
            Patients can contact us, reserve appointments, check available time slots, review prescribed medicines,
            and sign up for a smoother care journey with Smile Bloom.
          </p>
          <div className="hero-actions">
            <NavLink className="button primary" to="/appointments">
              Book an appointment
            </NavLink>
            <a className="button secondary" href={`tel:${profile.contactNumber}`}>
              Call Us
            </a>
          </div>
        </div>
        <div className="hero-panel">
          <div>
            <span>Brand</span>
            <strong>Smile Bloom</strong>
          </div>
          <div>
            <span>Contact</span>
            <strong>{profile.contactNumber}</strong>
          </div>
          <div>
            <span>Hours</span>
            <strong>{profile.hours}</strong>
          </div>
        </div>
      </section>

      <section className="trust-strip card">
        {clinicHighlights.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="locations-strip card">
        {locationDoctors.map((entry) => (
          <article key={entry.locationValue}>
            <p className="section-label">{entry.locationLabel}</p>
            <h3>{entry.doctorLabel}</h3>
            <a className="button secondary" href={`tel:${profile.contactNumber}`}>
              Call Us
            </a>
          </article>
        ))}
      </section>

      <section className="grid two-up page-stack">
        <article className="card professional-highlight">
          <p className="section-label">Chief Consultant</p>
          <h3>Senior Dental Team</h3>
          <p>
            Experienced in preventive, cosmetic, restorative, and emergency dentistry with a structured, patient-first
            treatment process.
          </p>
        </article>
        <article className="card professional-highlight">
          <p className="section-label">Reach Us Fast</p>
          <h3>{profile.contactNumber}</h3>
          <p>
            Instant call support, online booking, and same-day slot checks for urgent consultations.
          </p>
          <div className="hero-actions">
            <a className="button primary" href={`tel:${profile.contactNumber}`}>
              Call Us
            </a>
            <NavLink className="button secondary" to="/contact">
              Contact Form
            </NavLink>
          </div>
        </article>
      </section>

      <section className="grid two-up page-stack">
        <article className="card doctor-feature">
          <img src="/images/doctor-profile.svg" alt={profile.doctorName} />
          <div>
            <p className="section-label">Lead Dentist</p>
            <h3>Smile Bloom Specialist Team</h3>
            <p>
              Personalized treatment planning, preventive diagnostics, and procedure-first hygiene standards for every
              patient visit.
            </p>
          </div>
        </article>
        <article className="card">
          <p className="section-label">Quick Access</p>
          <h3>Call, consult, and book in one place</h3>
          <p>
            Traditional dental websites focus on trust and visibility. We keep doctor details, contact support,
            and booking links always accessible.
          </p>
          <div className="hero-actions">
            <a className="button primary" href={`tel:${profile.contactNumber}`}>
              Call Us
            </a>
            <NavLink className="button secondary" to="/appointments">
              Appointment Desk
            </NavLink>
          </div>
        </article>
      </section>

      <section className="grid two-up stagger">
        {services.slice(0, 4).map((service) => (
          <article className="card service-card" key={service.title}>
            <img src={`/images/${service.title.toLowerCase().replace(/\s+/g, '-')}.svg`} alt={service.title} />
            <p className="section-label">Service</p>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </article>
        ))}
      </section>

      <section className="gallery-grid page-stack">
        <article className="card image-card">
          <img src="/images/clinic-lobby.svg" alt="Dental clinic reception" />
          <h3>Digital reception</h3>
          <p>Fast check-in and guided patient experience.</p>
        </article>
        <article className="card image-card">
          <img src="/images/chair-side-care.svg" alt="Chair-side consultation" />
          <h3>Chair-side consultations</h3>
          <p>Transparent treatment plans and clear follow-up instructions.</p>
        </article>
        <article className="card image-card">
          <img src="/images/smile-result.svg" alt="Confident smile result" />
          <h3>Smile outcomes</h3>
          <p>Long-term care plans for healthier smiles.</p>
        </article>
      </section>

      <section className="grid three-up stagger">
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

function ServicesPage({ services }: { services: ServiceItem[] }) {
  return (
    <section className="page-stack">
      <div className="card">
        <p className="section-label">Services</p>
        <h2>Complete care for preventive, cosmetic, and restorative needs.</h2>
      </div>
      <div className="grid two-up stagger">
        {services.map((service) => (
          <article className="card service-card" key={service.title}>
            <img src={`/images/${service.title.toLowerCase().replace(/\s+/g, '-')}.svg`} alt={service.title} />
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AppointmentsPage({
  currentUser,
  services,
  onAppointmentBooked
}: {
  currentUser: AuthUser | null;
  services: ServiceItem[];
  onAppointmentBooked: (appointment: AppointmentRecord) => void;
}) {
  const [location, setLocation] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [period, setPeriod] = useState<(typeof periodOptions)[number]>('morning');
  const [slot, setSlot] = useState('9:00 AM');
  const [name, setName] = useState(currentUser?.name ?? '');
  const [service, setService] = useState(services[0]?.title ?? 'Preventive Care');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [availableSlots, setAvailableSlots] = useState(['9:00 AM', '9:30 AM', '10:00 AM']);
  const [status, setStatus] = useState('Choose a date to see slots.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentsView, setAppointmentsView] = useState<AppointmentRecord[]>([]);

  useEffect(() => {
    setName(currentUser?.name ?? '');
  }, [currentUser]);

  const refreshAppointments = async (override?: { phone?: string; name?: string }) => {
    try {
      const payload = await clinicApi.getAppointments({
        email: currentUser?.email,
        phone: override?.phone ?? phone,
        name: override?.name ?? name
      });
      setAppointmentsView(payload.appointments);
    } catch {
      setAppointmentsView([]);
    }
  };

  useEffect(() => {
    refreshAppointments().catch(() => undefined);
  }, [currentUser]);

  useEffect(() => {
    if (services.length > 0 && !services.some((item) => item.title === service)) {
      setService(services[0].title);
    }
  }, [services, service]);

  const slotLabel = useMemo(() => `${period} slots`, [period]);
  const availableDoctors = useMemo(
    () => locationDoctors.filter((entry) => entry.locationValue === location),
    [location]
  );

  const checkSlots = async () => {
    if (!location || !doctor) {
      setStatus('Please select location and doctor first.');
      return;
    }

    if (!date) {
      setStatus('Please select a date first.');
      return;
    }

    try {
      const payload = await clinicApi.getSlots(date, period);
      setAvailableSlots(payload.availableSlots);
      if (payload.availableSlots.length === 0) {
        setSlot('');
        setStatus(`No ${slotLabel} available on ${date}. Try another date or period.`);
        return;
      }

      setSlot(payload.availableSlots[0]);
      setStatus(`Available ${slotLabel} on ${date}: ${payload.availableSlots.join(', ')}.`);
    } catch {
      setStatus('Unable to load slots right now.');
    }
  };

  const bookAppointment = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setStatus('Please enter patient name and phone number.');
      return;
    }

    if (!location || !doctor) {
      setStatus('Please select location and doctor before booking.');
      return;
    }

    if (!date) {
      setStatus('Please choose a date before booking.');
      return;
    }

    if (!slot) {
      setStatus('No slot selected. Please check slots first.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await clinicApi.bookAppointment({
        name: name.trim(),
        date,
        period,
        slot,
        service,
        location,
        doctor,
        phone: phone.trim(),
        notes,
        email: currentUser?.email ?? ''
      });
      setStatus(response.confirmation);
      setNotes('');
      onAppointmentBooked(response.appointment);
      await refreshAppointments({ phone: phone.trim(), name: name.trim() });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Booking failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="grid two-up page-stack">
      <form className="card form" onSubmit={bookAppointment}>
        <p className="section-label">Book Appointment</p>
        <h2>Reserve a visit in a few steps.</h2>
        <label>
          Select location first
          <select
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
              setDoctor('');
            }}
          >
            <option value="">Choose location</option>
            {locationDoctors.map((entry) => (
              <option key={entry.locationValue} value={entry.locationValue}>
                {entry.locationLabel}
              </option>
            ))}
          </select>
        </label>
        <label>
          Select doctor according to location
          <select value={doctor} onChange={(event) => setDoctor(event.target.value)} disabled={!location}>
            <option value="">Choose doctor</option>
            {availableDoctors.map((entry) => (
              <option key={entry.doctorValue} value={entry.doctorValue}>
                {entry.doctorLabel}
              </option>
            ))}
          </select>
        </label>
        <label>
          Patient name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            type="text"
            placeholder="Your name"
            disabled={!doctor}
          />
        </label>
        <label>
          Phone
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            type="tel"
            placeholder="Phone number"
            disabled={!doctor}
          />
        </label>
        <label>
          Service
          <select value={service} onChange={(event) => setService(event.target.value)} disabled={!doctor}>
            {services.map((entry) => (
              <option key={entry.title} value={entry.title}>
                {entry.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} disabled={!doctor} />
        </label>
        <label>
          Time of day
          <select value={period} onChange={(event) => setPeriod(event.target.value as typeof period)} disabled={!doctor}>
            {periodOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Available slot
          <select value={slot} onChange={(event) => setSlot(event.target.value)} disabled={!doctor}>
            {availableSlots.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </label>
        <label>
          Notes
          <textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Any special request?"
            disabled={!doctor}
          />
        </label>
        <div className="inline-actions">
          <button className="button secondary" type="button" onClick={checkSlots} disabled={!doctor}>
            Check time slot
          </button>
          <button className="button primary" type="submit" disabled={isSubmitting || !doctor}>
            {isSubmitting ? 'Booking...' : 'Confirm booking'}
          </button>
        </div>
      </form>

      <article className="card">
        <p className="section-label">Booking status</p>
        <h2>{status}</h2>
        <p>After booking, this shows confirmations, preparation instructions, and follow-up reminders.</p>

        <div className="recent-appointments">
          <h3>Recent Appointments</h3>
          {appointmentsView.length === 0 && <p>No appointments found yet.</p>}
          <ul className="data-list">
            {appointmentsView.slice(0, 5).map((entry) => (
              <li key={entry.id}>
                <strong>{entry.service}</strong>
                <span>
                  {entry.date} · {entry.slot} · {entry.location} · {entry.doctor} · {entry.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  );
}

function MedicinesPage({ medicines, reminder }: { medicines: MedicineItem[]; reminder: string }) {
  return (
    <section className="page-stack">
      <div className="card">
        <p className="section-label">Prescribed Medicines</p>
        <h2>Track aftercare medicine instructions and reminders.</h2>
      </div>
      <div className="grid three-up stagger">
        {medicines.map((item) => (
          <article className="card" key={item.name}>
            <h3>{item.name}</h3>
            <p>{item.dose}</p>
            <p>{item.timing}</p>
          </article>
        ))}
      </div>
      <article className="card">
        <p className="section-label">Reminder</p>
        <p>{reminder}</p>
      </article>
    </section>
  );
}

function ContactPage({ profile }: { profile: ClinicProfile }) {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [query, setQuery] = useState('');

  const submitContact = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await clinicApi.sendContact({ name, contact, message: query });
      setMessage(response.confirmation);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to send message.');
    }
  };

  return (
    <section className="grid two-up page-stack">
      <form className="card form" onSubmit={submitContact}>
        <p className="section-label">Contact Us</p>
        <h2>Ask a question or request a call back.</h2>
        <label>
          Name
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
        </label>
        <label>
          Phone or email
          <input type="text" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Contact detail" />
        </label>
        <label>
          Message
          <textarea rows={4} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="How can we help?" />
        </label>
        <button className="button primary" type="submit">
          Send message
        </button>
      </form>
      <article className="card">
        <p className="section-label">Clinic info</p>
        <h2>Visit, call, or book online anytime.</h2>
        <p>
          {profile.doctorName} · {profile.contactNumber}
        </p>
        <p>{profile.hours}</p>
        <p>{message}</p>
      </article>
    </section>
  );
}

function AuthPage({ onAuthSuccess }: { onAuthSuccess: (user: AuthUser) => void }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitAuth = async () => {
    try {
      const response =
        mode === 'signup'
          ? await clinicApi.signUp({ name, email, password })
          : await clinicApi.login({ email, password });

      const resolvedUser: AuthUser = response.user ?? {
        name: mode === 'signup' ? name : email.split('@')[0] || 'Patient',
        email
      };

      onAuthSuccess(resolvedUser);
      setFeedback(response.confirmation);
      navigate('/');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Authentication failed.');
    }
  };

  return (
    <section className="grid two-up page-stack">
      <article className="card form">
        <p className="section-label">Sign Up / Login</p>
        <div className="inline-tabs">
          <button className={mode === 'signup' ? 'tab active' : 'tab'} onClick={() => setMode('signup')} type="button">
            Sign up
          </button>
          <button className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => setMode('login')} type="button">
            Login
          </button>
        </div>
        {mode === 'signup' ? (
          <>
            <h2>Create your patient account.</h2>
            <label>
              Full name
              <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" />
            </label>
            <label>
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create password"
              />
            </label>
            <button className="button primary" type="button" onClick={submitAuth}>
              Create account
            </button>
          </>
        ) : (
          <>
            <h2>Welcome back.</h2>
            <label>
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
            </label>
            <button className="button primary" type="button" onClick={submitAuth}>
              Login
            </button>
          </>
        )}
      </article>
      <article className="card">
        <p className="section-label">Account</p>
        <h2>After login your profile appears in the top-right corner.</h2>
        <p>Click your profile to view dashboard features like appointments, reminders, and payment history.</p>
        <p>{feedback}</p>
      </article>
    </section>
  );
}

function PaymentsPage({ currentUser }: { currentUser: AuthUser | null }) {
  const [amount, setAmount] = useState('1000');
  const [method, setMethod] = useState('UPI');
  const [purpose, setPurpose] = useState('Dental consultation');
  const [status, setStatus] = useState('');

  const submitPayment = async (event: FormEvent) => {
    event.preventDefault();

    if (!currentUser) {
      setStatus('Please login first to continue with payment.');
      return;
    }

    try {
      const payload = await clinicApi.createPayment({
        email: currentUser.email,
        amount: Number(amount),
        method,
        purpose
      });
      setStatus(payload.confirmation);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Payment failed.');
    }
  };

  return (
    <section className="grid two-up page-stack">
      <form className="card form" onSubmit={submitPayment}>
        <p className="section-label">Payment Gateway</p>
        <h2>Pay securely for consultation and treatment.</h2>
        <label>
          Amount (INR)
          <input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <label>
          Payment method
          <select value={method} onChange={(event) => setMethod(event.target.value)}>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>
        </label>
        <label>
          Purpose
          <input type="text" value={purpose} onChange={(event) => setPurpose(event.target.value)} />
        </label>
        <button className="button primary" type="submit">
          Pay now
        </button>
      </form>

      <article className="card">
        <p className="section-label">Payment status</p>
        <h2>{status || 'Complete payment for appointments, procedures, and follow-up plans.'}</h2>
        <p>Gateway options are available on mobile and desktop, including UPI for quick checkout.</p>
      </article>
    </section>
  );
}

function ProfilePanel({
  user,
  dashboard,
  activeTab,
  onTabChange,
  onClose
}: {
  user: AuthUser;
  dashboard: DashboardData;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onClose: () => void;
}) {
  return (
    <div className="profile-overlay" role="dialog" aria-modal="true">
      <section className="profile-panel card">
        <div className="profile-panel-header">
          <div>
            <p className="section-label">Patient Profile</p>
            <h2>{user.name}</h2>
            <p>Welcome, {user.name}</p>
          </div>
          <button className="button secondary" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="inline-tabs">
          {profileTabs.map((tab) => (
            <button key={tab} type="button" className={activeTab === tab ? 'tab active' : 'tab'} onClick={() => onTabChange(tab)}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="profile-content">
            <article className="card compact">
              <h3>Total appointments</h3>
              <p>{dashboard.appointments.length}</p>
            </article>
            <article className="card compact">
              <h3>Medicine reminders</h3>
              <p>{dashboard.reminders.length}</p>
            </article>
            <article className="card compact">
              <h3>Payments made</h3>
              <p>{dashboard.payments.length}</p>
            </article>
          </div>
        )}

        {activeTab === 'appointments' && (
          <ul className="data-list">
            {dashboard.appointments.length === 0 && <li>No appointment history yet.</li>}
            {dashboard.appointments.map((entry: AppointmentRecord) => (
              <li key={entry.id}>
                <strong>{entry.service}</strong>
                <span>
                  {entry.date} · {entry.slot} · {entry.location} · {entry.doctor} · {entry.status}
                </span>
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'reminders' && (
          <ul className="data-list">
            {dashboard.reminders.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        )}

        {activeTab === 'payments' && (
          <ul className="data-list">
            {dashboard.payments.length === 0 && <li>No payments yet.</li>}
            {dashboard.payments.map((entry: PaymentRecord) => (
              <li key={entry.id}>
                <strong>
                  INR {entry.amount} · {entry.method}
                </strong>
                <span>
                  {entry.purpose} · {entry.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
