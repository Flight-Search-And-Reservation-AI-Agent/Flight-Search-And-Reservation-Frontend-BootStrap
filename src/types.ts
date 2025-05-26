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
  airline: string;
  price: number;
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  role: string;
};

export interface FlightRequest {
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  originAirportId: string;
  origin:{
    name: string;
  };
  destination:{
    name:string;
  };
  aircraft:{
    airline: string;
  };
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
  airline: string;
};

// export type User = {
//   userId: string;
//   username: string;
//   email: string;
//   role: string;
// };

export type Reservation = {
  reservationId: string;
  user: {
    userId: string;
    username: string;
  };
  flight: {
    flightId: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    origin: {
      code: string;
      city: string;
      name: string;
    };
    destination: {
      code: string;
      city: string;
      name: string;
    };
    aircraft: {
      aircraftId: string;
      model: string;
      airline: string;
    };
    price: number;
  };
  seatNumber: string;
  status: "CONFIRMED" | "CANCELLED";
  reservationTime: string;
  passengers: {
    name: string;
    age: number;
    gender: string;
  }[];
};


export type ReservationRequest = {
  userId: string;
  flightId: string;
  passengers: { name: string; age: number; gender: string }[];
  status: "CONFIRMED" | "CANCELLED";
};



export interface Group {
    tripGroupId: string;
    tripName: string;
    tripDescription?: string;
    status?: string;
    tripAvatarUrl?: string;
    dates?: string;
    createdBy?: User;
    members: User[];
    polls?: any[]; // Update when Poll interface is defined
    tripNotes?: any[]; // Update when TripNote is defined
    checklistItems?: any[];
}


export interface User {
    userId: string;
    username: string;
    email: string;
    role: "USER" | "ADMIN";
    // add any other fields like phoneNumber, createdAt, etc.
}

export interface ChatMessage {
  id?: number;
  groupId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  timestamp?: string;
}

export type ChecklistItem = {
    itemId?: number;
    task: string;
    assignedTo: string;
    done: boolean;
};

export type CreateTripGroupPayload = {
  tripName: string;
  tripDescription: string;
  tripDestination: string;
  tripStartDate: string;
  tripEndDate: string;
  tripAvatarUrl: string;
};


