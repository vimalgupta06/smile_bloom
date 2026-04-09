import express from 'express';
import cors from 'cors';

const app = express();
const port = Number(process.env.PORT ?? 4000);

const clinic = {
  clinicName: 'Smile Bloom Dental Clinic',
  doctorName: 'Dr. Ujjwal Gupta',
  contactNumber: '7531004658',
  hours: 'Mon-Sat, 9:00 AM to 7:00 PM',
  supportLine: 'Call or message for urgent help'
};

const services = [
  { title: 'Preventive Care', text: 'Cleanings, exams, and early intervention for healthier smiles.' },
  { title: 'Cosmetic Dentistry', text: 'Whitening, veneers, and smile design tailored to you.' },
  { title: 'Restorative Treatments', text: 'Crowns, fillings, and implants that restore confidence.' },
  { title: 'Pediatric Dentistry', text: 'Friendly care for kids with a calm, welcoming experience.' },
  { title: 'Root Canal Therapy', text: 'Pain-relieving treatment with modern, precise endodontics.' },
  { title: 'Invisible Aligners', text: 'Discreet teeth alignment with guided progress tracking.' },
  { title: 'Laser Gum Care', text: 'Low-discomfort gum therapy and periodontal maintenance.' },
  { title: 'Emergency Dentistry', text: 'Same-day support for tooth pain, trauma, and urgent care.' }
];

const medicines = {
  reminder: 'Send medicine reminder notifications after treatment and show dosage guidance on the patient dashboard.',
  items: [
    { name: 'Amoxicillin', dose: '500 mg', timing: 'After meals, twice daily' },
    { name: 'Ibuprofen', dose: '400 mg', timing: 'As directed for pain relief' },
    { name: 'Mouth rinse', dose: '15 ml', timing: 'Morning and night' }
  ]
};

const slotTemplate = {
  morning: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM'],
  afternoon: ['1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM'],
  evening: ['5:00 PM', '5:30 PM', '6:00 PM']
};

const doctorByLocation = {
  firozabad: 'Harshit Singh',
  agra: 'Ayush Katiyar',
  khurja: 'Ujjwal Gupta',
  hathras: 'Abhimanyu Pratap'
};

const appointments = [];
const messages = [];
const users = [];
const payments = [];

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.get('/api/clinic', (_request, response) => {
  response.json(clinic);
});

app.get('/api/services', (_request, response) => {
  response.json(services);
});

app.get('/api/medicines', (_request, response) => {
  response.json(medicines);
});

app.get('/api/doctors', (_request, response) => {
  const entries = Object.entries(doctorByLocation).map(([location, doctor]) => ({ location, doctor }));
  response.json(entries);
});

app.get('/api/slots', (request, response) => {
  const date = String(request.query.date ?? '');
  const period = String(request.query.period ?? 'morning');

  if (!date) {
    response.status(400).json({ message: 'Date is required.' });
    return;
  }

  const booked = appointments
    .filter((entry) => entry.date === date && entry.period === period)
    .map((entry) => entry.slot);

  const availableSlots = (slotTemplate[period] ?? slotTemplate.morning).filter((slot) => !booked.includes(slot));

  response.json({ availableSlots });
});

app.get('/api/appointments', (request, response) => {
  const email = String(request.query.email ?? '');
  const phone = String(request.query.phone ?? '');
  const name = String(request.query.name ?? '').toLowerCase();

  let filtered = [...appointments];

  if (email) {
    filtered = filtered.filter((entry) => entry.email === email);
  }

  if (phone) {
    filtered = filtered.filter((entry) => entry.phone === phone);
  }

  if (name) {
    filtered = filtered.filter((entry) => String(entry.name).toLowerCase().includes(name));
  }

  response.json({ appointments: filtered });
});

app.post('/api/appointments', (request, response) => {
  const { name, phone, date, period, slot, service, notes, email, location, doctor } = request.body ?? {};

  if (!name || !phone || !date || !period || !service || !location || !doctor) {
    response.status(400).json({ message: 'Please fill every required appointment field.' });
    return;
  }

  const normalizedLocation = String(location).toLowerCase();
  const expectedDoctor = doctorByLocation[normalizedLocation];
  if (!expectedDoctor) {
    response.status(400).json({ message: 'Selected location is invalid.' });
    return;
  }

  if (String(doctor).toLowerCase() !== expectedDoctor.toLowerCase()) {
    response.status(400).json({ message: 'Please select doctor according to chosen location.' });
    return;
  }

  const requestedPeriod = String(period);
  const periodSlots = slotTemplate[requestedPeriod] ?? slotTemplate.morning;
  const bookedSlots = appointments
    .filter((entry) => entry.date === date && entry.period === requestedPeriod)
    .map((entry) => entry.slot);
  const firstFreeSlot = periodSlots.find((entry) => !bookedSlots.includes(entry));
  const finalSlot = slot || firstFreeSlot;

  if (!finalSlot) {
    response.status(409).json({ message: 'No slots left for the selected date and time period.' });
    return;
  }

  const alreadyBooked = appointments.some((entry) => entry.date === date && entry.period === requestedPeriod && entry.slot === finalSlot);
  if (alreadyBooked) {
    response.status(409).json({ message: 'That time slot is already booked.' });
    return;
  }

  const createdAppointment = {
    id: `apt-${Date.now()}`,
    name,
    location: normalizedLocation,
    doctor: expectedDoctor,
    phone,
    date,
    period: requestedPeriod,
    slot: finalSlot,
    service,
    email: email ?? '',
    notes: notes ?? '',
    status: 'Confirmed'
  };

  appointments.push(createdAppointment);

  response.json({
    confirmation: `Appointment reserved for ${date} at ${finalSlot}. Dr. Ujjwal Gupta will see you for ${service}.`,
    appointment: createdAppointment
  });
});

app.post('/api/contact', (request, response) => {
  const { name, contact, message } = request.body ?? {};

  if (!name || !contact || !message) {
    response.status(400).json({ message: 'Please fill all contact fields.' });
    return;
  }

  messages.push({ name, contact, message });

  response.json({ confirmation: `Thanks ${name}. We will contact you shortly at ${contact}.` });
});

app.post('/api/auth/signup', (request, response) => {
  const { name, email, password } = request.body ?? {};

  if (!name || !email || !password) {
    response.status(400).json({ message: 'Please complete the sign up form.' });
    return;
  }

  const alreadyExists = users.some((entry) => entry.email === email);
  if (alreadyExists) {
    response.status(409).json({ message: 'Account already exists for this email.' });
    return;
  }

  users.push({ name, email, password });
  response.json({ confirmation: `Account created for ${name}.`, user: { name, email } });
});

app.post('/api/auth/login', (request, response) => {
  const { email, password } = request.body ?? {};

  if (!email || !password) {
    response.status(400).json({ message: 'Email and password are required.' });
    return;
  }

  const matchedUser = users.find((entry) => entry.email === email && entry.password === password);
  if (!matchedUser) {
    response.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  response.json({
    confirmation: `Welcome back. Logged in as ${email}.`,
    user: { name: matchedUser.name, email: matchedUser.email }
  });
});

app.get('/api/dashboard', (request, response) => {
  const email = String(request.query.email ?? '');
  const userAppointments = appointments.filter((entry) => entry.email === email || (!email && entry.email === ''));
  const userPayments = payments.filter((entry) => entry.email === email || (!email && entry.email === ''));

  const reminders = [
    'Take medicine after meals as prescribed by Dr. Ujjwal Gupta.',
    'Rinse gently before bedtime for 5 days after procedure.',
    'Book your follow-up check in 7 to 10 days.'
  ];

  response.json({
    appointments: userAppointments,
    reminders,
    payments: userPayments
  });
});

app.post('/api/payments', (request, response) => {
  const { email, amount, method, purpose } = request.body ?? {};

  if (!email || !amount || !method || !purpose) {
    response.status(400).json({ message: 'Please complete all payment details.' });
    return;
  }

  const payment = {
    id: `pay-${Date.now()}`,
    email,
    amount: Number(amount),
    method,
    purpose,
    status: 'Paid',
    createdAt: new Date().toISOString()
  };

  payments.push(payment);

  response.json({
    confirmation: `Payment successful via ${method}. Receipt id ${payment.id}.`,
    payment
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Smile Bloom backend running on http://localhost:${port}`);
});