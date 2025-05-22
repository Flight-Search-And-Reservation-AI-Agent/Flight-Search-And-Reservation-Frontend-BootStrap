
import axios from "axios";
import type { Aircraft, Airport, AuthResponse, Flight, FlightRequest, Reservation, ReservationRequest, User, Group, ChecklistItem, CreateTripGroupPayload } from "../types";
const API_BASE_URL = "https://flightapp-backend-new.uc.r.appspot.com/api/v1";
const USER_BASE_URL = "https://flightapp-backend-new.uc.r.appspot.com/api";

const getAuthToken = () => {
  return localStorage.getItem("token"); // or sessionStorage based on your login setup
};

// const authHeader = () => {
//   const token = getAuthToken();
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
   withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});


axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Converts input datetime string (e.g. "2025-04-06T10:00") to ISO 8601 without Z
 * Ensures compatibility with Spring Boot's LocalDateTime parsing
 */
const toISOLocalDateTime = (datetime: string): string => {
  const date = new Date(datetime);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:MM:SS"
};


// Helper for handling fetch errors
// async function handleResponse(response: Response) {
//     if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || "Something went wrong");
//     }
//     return response.json();
// }


// GET /api/v1/users - Get all users (admin only)
export async function fetchAllUsers(): Promise<User[]> {
    const res = await axiosInstance.get<User[]>(`${API_BASE_URL}/users`);
    return res.data;
}

// GET /api/v1/users/{userId} - Get user by ID
export async function fetchUserById(userId: string): Promise<User> {
    const res = await axiosInstance.get<User>(`${API_BASE_URL}/users/${userId}`);
    return res.data;
}

// PUT /api/v1/users/{userId} - Update user (admin or user)
export async function updateUser(userId: string, updatedData: Partial<User>): Promise<User> {
    const res = await axiosInstance.put<User>(`${API_BASE_URL}/users/${userId}`, updatedData);
    return res.data;
}

// DELETE /api/v1/users/{userId} - Delete user (admin only)
export async function deleteUserById(userId: string): Promise<void> {
    try {
        await axiosInstance.delete(`${API_BASE_URL}/users/${userId}`);
    } catch (err: any) {
        const errorText = err.response?.data || "Failed to delete user";
        throw new Error(errorText);
    }
}


export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${USER_BASE_URL}/auth/register`, userData);
  
  return response.data;
};

export const loginUser = async (credentials: {
  username: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${USER_BASE_URL}/auth/login`,
    credentials,{
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// ✈️ Flights

export const searchFlights = async (
  origin: string,
  destination: string,
  departureDate: string // Expected format: "2025-04-06T10:00"
): Promise<Flight[]> => {
  const formattedDate = toISOLocalDateTime(departureDate);
  const url = `${API_BASE_URL}/flights/search?origin=${origin}&destination=${destination}&departureDate=${formattedDate}`;
  
  const response = await axiosInstance.get<Flight[]>(url);
  return response.data;
};

export const getAllFlights = async (): Promise<Flight[]> => {
  const response = await axiosInstance.get<Flight[]>(`${API_BASE_URL}/flights`);
  return response.data;
};

export const deleteFlightById = async (id: string) => {
  await axiosInstance.delete(`${API_BASE_URL}/flights/${id}`);
};

export const createFlight = async (flight: FlightRequest): Promise<void> => {
  await axiosInstance.post(`${API_BASE_URL}/flights/add`, flight);
};

export const updateFlightById = async (
  id: string,
  flight: FlightRequest
): Promise<void> => {
  await axiosInstance.put(`${API_BASE_URL}/flights/${id}`, flight);
};

export const getFlightById = async (id: string): Promise<FlightRequest> => {
  const response = await axiosInstance.get<FlightRequest>(`${API_BASE_URL}/flights/${id}`);
  return response.data;
};

// 🛬 Airports
export const getAllAirports = async (): Promise<Airport[]> => {
  const response = await axiosInstance.get<Airport[]>(`${API_BASE_URL}/airports`);
  return response.data;
};

export const addAirport = async (airport: {
  name: string;
  city: string;
  country: string;
  code: string;
}) => {
  const response = await axiosInstance.post(`${API_BASE_URL}/airports`, airport);
  return response.data;
};

export const updateAirport = async (
  id: string,
  airport: { name: string; city: string; country: string; code: string }
) => {
  const response = await axiosInstance.put(`${API_BASE_URL}/airports/${id}`, airport);
  return response.data;
};

export const deleteAirport = async (id: string) => {
  const response = await axiosInstance.delete(`${API_BASE_URL}/airports/${id}`);
  return response.data;
};

// ✈️ Aircraft
export const getAllAircraft = async (): Promise<Aircraft[]> => {
  const response = await axiosInstance.get<Aircraft[]>(`${API_BASE_URL}/aircrafts`);
  return response.data;
};

export const addAircraft = async (aircraft: {
  model: string;
  capacity: number;
}) => {
  const response = await axiosInstance.post(`${API_BASE_URL}/aircrafts`, aircraft);
  return response.data;
};

export const updateAircraft = async (
  id: string,
  aircraft: { model: string; capacity: number }
) => {
  const response = await axiosInstance.put(`${API_BASE_URL}/aircrafts/${id}`, aircraft);
  return response.data;
};

export const deleteAircraft = async (id: string) => {
  const response = await axiosInstance.delete(`${API_BASE_URL}/aircrafts/${id}`);
  return response.data;
};


// Reservations
export const getAllReservations = async (): Promise<Reservation[]> => {
  const res = await axiosInstance.get<Reservation[]>(`${API_BASE_URL}/reservations`);
  return res.data;
};

export const createReservation = async (data: ReservationRequest): Promise<Reservation> => {
  const res = await axiosInstance.post<Reservation>(`${API_BASE_URL}/reservations`, data);
  return res.data;
};

export const updateReservation = async (
  id: string,
  data: ReservationRequest
): Promise<Reservation> => {
  const res = await axiosInstance.put<Reservation>(`${API_BASE_URL}/reservations/${id}`, data);
  return res.data;
};

export const cancelReservation = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_BASE_URL}/reservations/${id}`);
};

export const fetchUserReservations = async (userId: string) => {
  const response = await axiosInstance.get(`${API_BASE_URL}/reservations/${userId}`, {
    params: { userId },
  });
  return response.data;
};


// //polls

export const createPolls = async (groupId: string, question: string, options: string[]) => {
  await axiosInstance.post(`${API_BASE_URL}/trip-groups/${groupId}/polls`, {
    question,
    options,
  });
};

// Get all polls for a specific trip group
export const fetchPollsForTripGroup = (tripGroupId: number) => {
  return axiosInstance.get(`${API_BASE_URL}/trip-groups/${tripGroupId}/polls`);
};

// Create a new poll in a trip group
export const createPollForTripGroup = (
  tripGroupId: number,
  pollData: {
    question: string;
    options: string[];
  }
) => {
  return axiosInstance.post(`${API_BASE_URL}/trip-groups/${tripGroupId}/polls/create`, pollData);
};

// Vote in a specific poll
export const voteInPoll = (pollId: number, optionId: number) => {
  return axiosInstance.post(`${API_BASE_URL}/trip-groups/polls/${pollId}/vote`, { optionId });
};

// Delete a poll by its ID
export const deletePoll = (pollId: number) => {
  return axiosInstance.delete(`${API_BASE_URL}/trip-groups/polls/${pollId}`);
};

// Update a poll
export const updatePoll = (
  pollId: number,
  pollData: {
    question: string;
    options: {
      optionId: number;
      optionText: string;
    }[];
  }
) => {
  return axiosInstance.put(`${API_BASE_URL}/trip-groups/polls/${pollId}`, pollData);
};


export const fetchPollsByTripGroup = (tripGroupId: string) => {
    return axiosInstance.get(`${API_BASE_URL}/trip-groups/${tripGroupId}/polls`);
};

export const fetchUserVotes = (userId: string) => {
    return axiosInstance.get(`${API_BASE_URL}/user-vote/${userId}/votes`);
};

export const createNewPoll = (tripGroupId: string, poll: { question: string; options: string[]; anonymous: boolean }) => {
    return axiosInstance.post(`${API_BASE_URL}/trip-groups/${tripGroupId}/polls/create`, poll);
};

export const voteOnPollOption = (tripGroupId: string, pollId: string, optionId: string, userId: string) => {
    return axiosInstance.post(`${API_BASE_URL}/trip-groups/${tripGroupId}/polls/${pollId}/vote/${optionId}?userId=${userId}`);
};

export const deletePollById = (tripGroupId: string, pollId: string) => {
    return axiosInstance.delete(`${API_BASE_URL}/trip-groups/${tripGroupId}/polls/${pollId}`);
};


//group

export const createTripGroup = async (userId: string, payload: CreateTripGroupPayload) => {
  if (!userId) {
    throw new Error('User ID is required to create a trip group.');
  }

  const response = await axiosInstance.post(
    `${API_BASE_URL}/trip-groups?creatorUserId=${userId}`,
    payload
  );

  return response.data;
};

export const getGroupById = async (groupId: string) => {
  const response = await axiosInstance.get(`${API_BASE_URL}/trip-groups/${groupId}`);
  return response.data;
};


export const getUserTripGroups = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/trip-groups/my`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching trip groups:", error);
    throw error; // Let the caller handle the error
  }
};


export const addUserToGroup = async (groupId: string, userId: string) => {
  const response = await axios.post(`${API_BASE_URL}/trip-groups/${groupId}/members`, null, {
    params: { userId },
  });
  return response.data;
};


export const updateGroup = async (groupId: string, updatedGroup: Group) => {
  await axiosInstance.put(`${API_BASE_URL}/trip-groups/${groupId}`, updatedGroup);
};

export const deleteTripGroup = async (groupId: string, userId: string) => {
  await axiosInstance.delete(`${API_BASE_URL}/trip-groups/${groupId}`, {
    params: { userId },
  });
};


//Checklist
export const createChecklistItems = async (
  groupId: string,
  task: string,
  assignedTo: string,
  dueDate: string
) => {
  await axiosInstance.post(`${API_BASE_URL}/trip-groups/${groupId}/checklist`, {
    task,
    assignedTo,
    dueDate,
  });
};



export const fetchChecklistItems = async (groupId: string) => {
  const res = await axiosInstance.get(`${API_BASE_URL}/trip-groups/${groupId}/checklist`);
  return res.data;
};

export const toggleChecklistItem = async (groupId: string, itemId: number) => {
  await axiosInstance.patch(`${API_BASE_URL}/trip-groups/${groupId}/checklist/toggle/${itemId}`);
};

export const deleteChecklistItem = async (groupId: string, itemId: number) => {
  await axiosInstance.delete(`${API_BASE_URL}/trip-groups/${groupId}/checklist/${itemId}`);
};

export const updateChecklistItem = async (
  groupId: string,
  itemId: number,
  item: ChecklistItem
) => {
  const res = await axiosInstance.put(`${API_BASE_URL}/trip-groups/${groupId}/checklist/${itemId}`, item);
  return res.data;
};

export const createChecklistItem = async (groupId: string, item: ChecklistItem) => {
  const res = await axiosInstance.post(`${API_BASE_URL}/trip-groups/${groupId}/checklist`, item);
  return res.data;
};
