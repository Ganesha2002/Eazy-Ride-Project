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

export interface FleetStats {
  totalBikes: number;
  availableBikes: number;
  activeBookings: number;
  totalRevenue: number;
  locationsCount: number;
}

export interface SearchFilter {
  location: string;
  date: string;
  type: string;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  isAdmin: boolean;
}
