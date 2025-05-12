export type Flight = {
  flightId: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  originAirportId: string;
  originAirportName: string;
  destinationAirportName:string;
  destinationAirportId: string;
  aircraftId: string;
  price: number;
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};

export interface FlightRequest {
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  originAirportId: string;
  destinationAirportId: string;
  aircraftId: string;
  price: number;
}

export type Airport = {
  airportId: string;
  name: string;
  city: string;
  country: string;
  code: string;
};

export type Aircraft = {
  aircraftId: string;
  model: string;
  capacity: number;
};

export type User = {
  userId: string;
  username: string;
  email: string;
  role: string;
};

export type Reservation = {
  reservationId: string;
  user: {
    userId: string;
    username: string;
  };
  flight: {
    flightId: string;
    flightNumber: string;
  };
  seatNumber: string;
  status: "BOOKED" | "CANCELLED";
  reservationTime: string;
};

export type ReservationRequest = {
  userId: string;
  flightId: string;
  seatNumber?: string;
  status: "BOOKED" | "CANCELLED";
};



export interface Group {
    tripGroupId: string;
    tripName: string;
    tripDescription?: string;
    status?: string;
    tripAvatarUrl?: string;
    createdBy?: User;
    members: User[];
    polls?: any[]; // Update when Poll interface is defined
    tripNotes?: any[]; // Update when TripNote is defined
    checklistItems?: any[];
}
