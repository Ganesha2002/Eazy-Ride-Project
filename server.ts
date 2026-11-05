import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

app.use(express.json());

// Database Types
export interface Bike {
  id: string;
  name: string;
  category: 'scooter' | 'cruiser' | 'sports' | 'electric';
  pricePerDay: number;
  description: string;
  engineCc: string;
  fuelType: 'Petrol' | 'Electric';
  transmission: 'Auto' | 'Manual';
  imageUrl: string;
  available: boolean;
  location: string;
  rating: number;
  totalTrips: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  bikeId: string;
  bikeName: string;
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
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface DatabaseSchema {
  bikes: Bike[];
  bookings: Booking[];
  locations: string[];
}

const DEFAULT_LOCATIONS = [
  'City Center Hub',
  'Airport Terminal 2',
  'Metro Hub - North',
  'Tech Park Station',
  'Beach Promenade',
];

const INITIAL_BIKES: Bike[] = [
  {
    id: 'bike-1',
    name: 'Urban Scooter',
    category: 'scooter',
    pricePerDay: 500,
    description: 'Perfect for quick and agile city commuting with supreme mileage.',
    engineCc: '110cc',
    fuelType: 'Petrol',
    transmission: 'Auto',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    available: true,
    location: 'City Center Hub',
    rating: 4.8,
    totalTrips: 184,
  },
  {
    id: 'bike-2',
    name: 'Harley Street',
    category: 'cruiser',
    pricePerDay: 1500,
    description: 'A classic American cruiser tuned for effortless long highway rides.',
    engineCc: '750cc',
    fuelType: 'Petrol',
    transmission: 'Manual',
    imageUrl: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=800&q=80',
    available: true,
    location: 'Airport Terminal 2',
    rating: 4.9,
    totalTrips: 92,
  },
  {
    id: 'bike-3',
    name: 'Ninja Sport',
    category: 'sports',
    pricePerDay: 2000,
    description: 'High performance sports bike designed for adrenaline and precision.',
    engineCc: '650cc',
    fuelType: 'Petrol',
    transmission: 'Manual',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    available: true,
    location: 'Metro Hub - North',
    rating: 4.9,
    totalTrips: 120,
  },
  {
    id: 'bike-4',
    name: 'Royal Hunter 350',
    category: 'cruiser',
    pricePerDay: 900,
    description: 'Distinctive thump with iconic road presence and comfortable seating.',
    engineCc: '350cc',
    fuelType: 'Petrol',
    transmission: 'Manual',
    imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
    available: true,
    location: 'City Center Hub',
    rating: 4.7,
    totalTrips: 215,
  },
  {
    id: 'bike-5',
    name: 'Ather 450X Electric',
    category: 'electric',
    pricePerDay: 600,
    description: 'Smart high-speed electric scooter with Google Maps & Warp mode.',
    engineCc: '3.7 kWh',
    fuelType: 'Electric',
    transmission: 'Auto',
    imageUrl: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&w=800&q=80',
    available: true,
    location: 'Tech Park Station',
    rating: 4.8,
    totalTrips: 165,
  },
  {
    id: 'bike-6',
    name: 'KTM Duke 250',
    category: 'sports',
    pricePerDay: 1200,
    description: 'Lightweight naked streetfighter with punchy torque and sharp agility.',
    engineCc: '250cc',
    fuelType: 'Petrol',
    transmission: 'Manual',
    imageUrl: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
    available: false,
    location: 'Beach Promenade',
    rating: 4.6,
    totalTrips: 88,
  },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-101',
    bookingCode: 'EZR-98421',
    bikeId: 'bike-6',
    bikeName: 'KTM Duke 250',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.s@example.com',
    customerPhone: '+91 98765 12345',
    licenseNumber: 'DL-04-202200192',
    pickupLocation: 'Beach Promenade',
    startDate: '2026-11-05',
    endDate: '2026-11-07',
    days: 2,
    helmetAddon: true,
    insuranceAddon: true,
    totalAmount: 2800,
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'bkg-102',
    bookingCode: 'EZR-77219',
    bikeId: 'bike-2',
    bikeName: 'Harley Street',
    customerName: 'Priya Patel',
    customerEmail: 'priya.p@example.com',
    customerPhone: '+91 98234 56789',
    licenseNumber: 'MH-12-202100843',
    pickupLocation: 'Airport Terminal 2',
    startDate: '2026-11-01',
    endDate: '2026-11-03',
    days: 2,
    helmetAddon: true,
    insuranceAddon: false,
    totalAmount: 3100,
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

// In-Memory & File persistence helper
function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading database, restoring defaults:', err);
  }

  const initialDb: DatabaseSchema = {
    bikes: INITIAL_BIKES,
    bookings: INITIAL_BOOKINGS,
    locations: DEFAULT_LOCATIONS,
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

let db = loadDatabase();

// SSE Real-Time Clients Registry
const sseClients: Response[] = [];

function broadcast(event: { type: string; payload: any }) {
  const message = `data: ${JSON.stringify(event)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(message);
    } catch {
      // client disconnected
    }
  });
}

// SSE Endpoint for Live Updates
app.get('/api/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);

  // Send initial ping and sync
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', payload: { clientCount: sseClients.length } })}\n\n`);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) {
      sseClients.splice(idx, 1);
    }
  });
});

// Periodic SSE heartbeat (keeps connections alive)
setInterval(() => {
  sseClients.forEach((client) => {
    try {
      client.write(': heartbeat\n\n');
    } catch {}
  });
}, 25000);

// API Routes
app.get('/api/bikes', (req: Request, res: Response) => {
  const { category, location, search, availableOnly } = req.query;
  let results = [...db.bikes];

  if (category && category !== 'all') {
    results = results.filter((b) => b.category === category);
  }
  if (location && location !== 'all') {
    results = results.filter((b) => b.location === location);
  }
  if (availableOnly === 'true') {
    results = results.filter((b) => b.available);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }

  res.json({ bikes: results, locations: db.locations });
});

app.post('/api/bikes', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.name || !body.pricePerDay) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const newBike: Bike = {
    id: `bike-${Date.now()}`,
    name: body.name,
    category: body.category || 'scooter',
    pricePerDay: Number(body.pricePerDay),
    description: body.description || 'Reliable rental bike.',
    engineCc: body.engineCc || '150cc',
    fuelType: body.fuelType || 'Petrol',
    transmission: body.transmission || 'Manual',
    imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    available: body.available !== undefined ? Boolean(body.available) : true,
    location: body.location || db.locations[0],
    rating: 5.0,
    totalTrips: 0,
  };

  db.bikes.unshift(newBike);
  saveDatabase(db);
  broadcast({ type: 'BIKE_ADDED', payload: newBike });
  res.status(201).json(newBike);
});

app.put('/api/bikes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = db.bikes.findIndex((b) => b.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Bike not found' });
  }

  db.bikes[idx] = {
    ...db.bikes[idx],
    ...req.body,
    pricePerDay: req.body.pricePerDay !== undefined ? Number(req.body.pricePerDay) : db.bikes[idx].pricePerDay,
  };
  saveDatabase(db);
  broadcast({ type: 'BIKE_UPDATED', payload: db.bikes[idx] });
  res.json(db.bikes[idx]);
});

app.patch('/api/bikes/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = db.bikes.findIndex((b) => b.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Bike not found' });
  }

  db.bikes[idx].available = Boolean(req.body.available);
  saveDatabase(db);
  broadcast({ type: 'BIKE_STATUS_CHANGED', payload: db.bikes[idx] });
  res.json(db.bikes[idx]);
});

app.delete('/api/bikes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = db.bikes.findIndex((b) => b.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Bike not found' });
  }

  const removed = db.bikes.splice(idx, 1)[0];
  saveDatabase(db);
  broadcast({ type: 'BIKE_DELETED', payload: { id: removed.id } });
  res.json({ success: true, removed });
});

// Bookings
app.get('/api/bookings', (req: Request, res: Response) => {
  res.json(db.bookings);
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    bikeId,
    customerName,
    customerEmail,
    customerPhone,
    licenseNumber,
    pickupLocation,
    startDate,
    endDate,
    days,
    helmetAddon,
    insuranceAddon,
    totalAmount,
  } = req.body;

  if (!bikeId || !customerName || !customerPhone || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const bike = db.bikes.find((b) => b.id === bikeId);
  if (!bike) {
    return res.status(404).json({ error: 'Selected bike not found' });
  }

  const codeNumber = Math.floor(10000 + Math.random() * 90000);
  const newBooking: Booking = {
    id: `bkg-${Date.now()}`,
    bookingCode: `EZR-${codeNumber}`,
    bikeId,
    bikeName: bike.name,
    customerName,
    customerEmail: customerEmail || 'customer@eazyride.com',
    customerPhone,
    licenseNumber: licenseNumber || 'DL-PENDING',
    pickupLocation: pickupLocation || bike.location,
    startDate,
    endDate,
    days: Math.max(1, Number(days) || 1),
    helmetAddon: Boolean(helmetAddon),
    insuranceAddon: Boolean(insuranceAddon),
    totalAmount: Number(totalAmount) || bike.pricePerDay,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  // Mark bike as booked
  bike.available = false;
  bike.totalTrips += 1;

  db.bookings.unshift(newBooking);
  saveDatabase(db);

  // Broadcast both bike update and new booking
  broadcast({ type: 'BOOKING_CREATED', payload: newBooking });
  broadcast({ type: 'BIKE_STATUS_CHANGED', payload: bike });

  res.status(201).json(newBooking);
});

app.patch('/api/bookings/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = db.bookings.find((b) => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const prevStatus = booking.status;
  booking.status = status;

  // If completed or cancelled, make the bike available again
  if ((status === 'completed' || status === 'cancelled') && (prevStatus === 'active' || prevStatus === 'confirmed')) {
    const bike = db.bikes.find((b) => b.id === booking.bikeId);
    if (bike) {
      bike.available = true;
      broadcast({ type: 'BIKE_STATUS_CHANGED', payload: bike });
    }
  }

  saveDatabase(db);
  broadcast({ type: 'BOOKING_STATUS_CHANGED', payload: booking });
  res.json(booking);
});

// Analytics & Stats
app.get('/api/stats', (req: Request, res: Response) => {
  const totalBikes = db.bikes.length;
  const availableBikes = db.bikes.filter((b) => b.available).length;
  const activeBookings = db.bookings.filter((b) => b.status === 'active' || b.status === 'confirmed').length;
  const totalRevenue = db.bookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + b.totalAmount : sum), 0);

  res.json({
    totalBikes,
    availableBikes,
    activeBookings,
    totalRevenue,
    locationsCount: db.locations.length,
  });
});

// Reset database route
app.post('/api/reset', (req: Request, res: Response) => {
  db = {
    bikes: [...INITIAL_BIKES],
    bookings: [...INITIAL_BOOKINGS],
    locations: [...DEFAULT_LOCATIONS],
  };
  saveDatabase(db);
  broadcast({ type: 'DATABASE_RESET', payload: db });
  res.json({ success: true, message: 'Database reset to initial demo state' });
});

// Full-Stack Server Integration with Vite
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (http://localhost:${PORT})`);
  });
}

startServer();
