import { Route, Routes } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Flights from './pages/admin/Flight'
import Airports from './pages/admin/Airports'
import Aircrafts from './pages/admin/Aircrafts'
import Reservations from './pages/admin/Reservations'
import Header from './components/ui/Header'
import GroupDashboard from './pages/group/GroupDashboard'
import GroupTripDashboard from './pages/group/GroupTripDaashBoard'
import AddFlight from './pages/admin/helpers/AddFlight'
import EditFlight from './pages/admin/helpers/EditFlight'
import UserDashboard from './pages/UserDashboard'
import CreateGroup from './pages/group/CreateGroup'
import ReservationPage from './pages/ReservationPage'
import EditProfile from './components/ui/EditProfile'

function App() {

  return (
   <>
        {/* actual content */}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/group" element={<GroupDashboard/>}/>
          <Route path="/reservationPage" element={<ReservationPage />} />
          <Route path="/user/profile/edit" element={<EditProfile />} />
          <Route path="/group/:groupId" element={<GroupTripDashboard />}/>
          <Route path="/group/create" element={<CreateGroup />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="flights" element={<Flights />} />
            <Route path="airports" element={<Airports />} />
            <Route path="/admin/flights/add" element={<AddFlight />} />
            <Route path="/admin/flights/edit/:id" element={<EditFlight />} />
            <Route path="aircrafts" element={<Aircrafts />} />
        {/* <Route path="users" element={<Users />} /> */}
        <Route path="reservations" element={<Reservations />} />
          </Route>
        </Routes>
    </>

  )
}

export default App
