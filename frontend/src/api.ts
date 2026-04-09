export type ClinicProfile = {
  doctorName: string;
  contactNumber: string;
  clinicName: string;
  hours: string;
  supportLine: string;
};

export type ServiceItem = {
  title: string;
  text: string;
};

export type MedicineItem = {
  name: string;
  dose: string;
  timing: string;
};

export type AuthUser = {
  name: string;
  email: string;
};

export type AppointmentRecord = {
  id: string;
  name: string;
  email: string;
  location: string;
  doctor: string;
  date: string;
  period: string;
  slot: string;
  service: string;
  status: string;
};

export type PaymentRecord = {
  id: string;
  amount: number;
  method: string;
  purpose: string;
  status: string;
  createdAt: string;
};

export type DashboardData = {
  appointments: AppointmentRecord[];
  reminders: string[];
  payments: PaymentRecord[];
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(payload?.message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}

export const clinicApi = {
  getProfile: () => request<ClinicProfile>('/clinic'),
  getServices: () => request<ServiceItem[]>('/services'),
  getMedicines: () => request<{ reminder: string; items: MedicineItem[] }>('/medicines'),
  getSlots: (date: string, period: string) => request<{ availableSlots: string[] }>(`/slots?date=${encodeURIComponent(date)}&period=${encodeURIComponent(period)}`),
  bookAppointment: (payload: Record<string, string>) => request<{ confirmation: string; appointment: AppointmentRecord }>('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getAppointments: (params: { email?: string; phone?: string; name?: string }) => {
    const search = new URLSearchParams();
    if (params.email) search.set('email', params.email);
    if (params.phone) search.set('phone', params.phone);
    if (params.name) search.set('name', params.name);
    return request<{ appointments: AppointmentRecord[] }>(`/appointments?${search.toString()}`);
  },
  sendContact: (payload: Record<string, string>) => request<{ confirmation: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  signUp: (payload: Record<string, string>) => request<{ confirmation: string; user: AuthUser }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  login: (payload: Record<string, string>) => request<{ confirmation: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getDashboard: (email: string) => request<DashboardData>(`/dashboard?email=${encodeURIComponent(email)}`),
  createPayment: (payload: { email: string; amount: number; method: string; purpose: string }) =>
    request<{ confirmation: string; payment: PaymentRecord }>('/payments', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};