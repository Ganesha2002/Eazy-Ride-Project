import { Bike, Booking, FleetStats } from '../types';

export const API_BASE = '/api';

export async function fetchBikes(params?: {
  category?: string;
  location?: string;
  search?: string;
  availableOnly?: boolean;
}): Promise<{ bikes: Bike[]; locations: string[] }> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'all') query.set('category', params.category);
  if (params?.location && params.location !== 'all') query.set('location', params.location);
  if (params?.search) query.set('search', params.search);
  if (params?.availableOnly) query.set('availableOnly', 'true');

  const res = await fetch(`${API_BASE}/bikes?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch bikes');
  return res.json();
}

export async function createBike(bikeData: Partial<Bike>): Promise<Bike> {
  const res = await fetch(`${API_BASE}/bikes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bikeData),
  });
  if (!res.ok) throw new Error('Failed to create bike');
  return res.json();
}

export async function updateBike(id: string, bikeData: Partial<Bike>): Promise<Bike> {
  const res = await fetch(`${API_BASE}/bikes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bikeData),
  });
  if (!res.ok) throw new Error('Failed to update bike');
  return res.json();
}

export async function toggleBikeStatus(id: string, available: boolean): Promise<Bike> {
  const res = await fetch(`${API_BASE}/bikes/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ available }),
  });
  if (!res.ok) throw new Error('Failed to update bike availability');
  return res.json();
}

export async function deleteBike(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/bikes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete bike');
  return res.json();
}

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/bookings`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function createBooking(bookingData: {
  bikeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  licenseNumber: string;
  pickupLocation: string;
  startDate: string;
  endDate: string;
  days: number;
  helmetAddon: boolean;
  insuranceAddon: boolean;
  totalAmount: number;
}): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit booking');
  }
  return res.json();
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update booking status');
  return res.json();
}

export async function fetchStats(): Promise<FleetStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function resetDatabase(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset database');
  return res.json();
}

export interface RealtimeEvent {
  type:
    | 'CONNECTED'
    | 'BIKE_ADDED'
    | 'BIKE_UPDATED'
    | 'BIKE_STATUS_CHANGED'
    | 'BIKE_DELETED'
    | 'BOOKING_CREATED'
    | 'BOOKING_STATUS_CHANGED'
    | 'DATABASE_RESET';
  payload: any;
}

export function subscribeToRealtimeUpdates(
  onEvent: (event: RealtimeEvent) => void,
  onStatusChange?: (connected: boolean) => void
): () => void {
  let eventSource: EventSource | null = null;
  let retryTimer: NodeJS.Timeout | null = null;
  let isClosed = false;

  function connect() {
    if (isClosed) return;

    try {
      eventSource = new EventSource(`${API_BASE}/events`);

      eventSource.onopen = () => {
        onStatusChange?.(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          onEvent(parsed);
        } catch (e) {
          // ignore heartbeats or non-JSON
        }
      };

      eventSource.onerror = () => {
        onStatusChange?.(false);
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        if (!isClosed) {
          retryTimer = setTimeout(connect, 3000);
        }
      };
    } catch {
      onStatusChange?.(false);
      if (!isClosed) {
        retryTimer = setTimeout(connect, 3000);
      }
    }
  }

  connect();

  return () => {
    isClosed = true;
    if (retryTimer) clearTimeout(retryTimer);
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    onStatusChange?.(false);
  };
}
