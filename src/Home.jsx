// ** React and React Router DOM Imports **
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

// ** CSS Imports **
import "./index.css";

// ** Component Imports **
// Layout Components
import Nav from "./components/Nav";
import Footer from "./components/Footer";

// Authentication Components
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import UserProfileUpdate from "./components/auth/UserProfileUpdate";

// Place Management Components
import EditPlace from "./components/EditPlace";
import DeletePlace from "./components/DeletePlace";
import EditCategorie from "./components/EditCategorie";
import DeleteCategorie from "./components/DeleteCategorie";
import PhotoManager from "./components/PhotoManager";
import ReservationForm from "./components/ReservationForm";
import EventForm from "./components/EventForm";
import EditEvent from "./components/EditEvent";

// Page Components
import HomeContent from "./pages/HomeContent";
import Dashboard from "./pages/Dashboard";
import RechercherPlace from "./pages/RechercherPlace";
import DeposerPlace from "./pages/DeposerPlace";
import DeposerCategorie from "./pages/DeposerCategorie";
import MessagesManagement from "./pages/MessagesManagement";
import FichePlace from "./pages/FichePlace";
import Aide from "./pages/Aide";
import CartePlaces from "./pages/CartePlaces";
import LieuPlacesRecherche from "./pages/LieuPlacesRecherche";
import AddPhotosPlace from "./pages/AddPhotosPlace";
import ListeReservationsAdmin from "./pages/ListeReservationsAdmin";
import ListEvents from "./pages/ListEvents";
import Carte from "./pages/Carte";
import LieuxLyon from "./pages/LieuxLyon";
import Restaurants from "./pages/Restaurants";
import Musees from "./pages/Musees";
import Evenements from "./pages/Evenements";
import PlacesReservations from "./pages/PlacesReservations";

// ** Context Imports **
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { DarkModeProvider } from "./context/DarkModeContext";

// ** Main Application Component **

function PageWrapper({ children }) {
  return (
    <main className="w-full h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </main>
  );
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

// ** Main Application Component **
const Home = () => {
  const { isAuthenticated, login, logout } = useContext(AuthContext);

  return (
    <Router>
      <Nav isAuthenticated={isAuthenticated} handleLogout={logout} />
      <PageWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeContent />} />
          <Route path="/aide" element={<Aide />} />
          <Route path="/carte-places" element={<CartePlaces />} />
          <Route path="/lieux-places" element={<LieuPlacesRecherche />} />
          <Route path="/carte" element={<Carte />} />
          <Route path="/lieux-lyon" element={<LieuxLyon />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/musees" element={<Musees />} />
          <Route path="/evenements" element={<Evenements />} />
          <Route path="/places-reservations" element={<PlacesReservations />} />

          {/* Protected Routes */}
          <Route path="/rechercher-place" element={<RechercherPlace />} />
          <Route path="/fiche-place/:id" element={<FichePlace />} />

          {/* Authentication Routes */}
          {!isAuthenticated && (
            <Route path="/register" element={<Register />} />
          )}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login onLogin={login} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route path="/Logout" element={<Navigate to="/" />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              !isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <PrivateRoute element={Dashboard} />
              )
            }
          />
          <Route
            path="/deposer_place"
            element={
              !isAuthenticated ? (
                <Navigate to="/deposer_place" />
              ) : (
                <PrivateRoute element={DeposerPlace} />
              )
            }
          />
          <Route
            path="/deposer_categorie"
            element={
              !isAuthenticated ? (
                <Navigate to="/deposer_categorie" />
              ) : (
                <PrivateRoute element={DeposerCategorie} />
              )
            }
          />
          <Route
            path="/messages-management"
            element={
              !isAuthenticated ? (
                <Navigate to="/messages-management" />
              ) : (
                <PrivateRoute element={MessagesManagement} />
              )
            }
          />
          <Route
            path="/profil-user-update"
            element={
              !isAuthenticated ? (
                <Navigate to="/profil-user-update" />
              ) : (
                <PrivateRoute element={UserProfileUpdate} />
              )
            }
          />

          {/* Place Management Routes */}
          {isAuthenticated && (
            <Route path="/edit-place/:id" element={<EditPlace />} />
          )}
          {isAuthenticated && (
            <Route path="/delete-place/:id" element={<DeletePlace />} />
          )}
          {isAuthenticated && (
            <Route path="/edit-categorie/:id" element={<EditCategorie />} />
          )}
          {isAuthenticated && (
            <Route path="/delete-categorie/:id" element={<DeleteCategorie />} />
          )}
          {isAuthenticated && (
            <Route
              path="/ajout-photos-place/:id"
              element={<AddPhotosPlace />}
            />
          )}
          {isAuthenticated && (
            <Route path="/places/:id/photos" element={<PhotoManager />} />
          )}

          {isAuthenticated && (
            <Route path="/reservations" element={<ListeReservationsAdmin />} />
          )}
          {isAuthenticated && (
            <Route
              path="/reservations-new"
              element={<ReservationForm isEditing={false} />}
            />
          )}
          {isAuthenticated && (
            <Route
              path="/edit-reservation/:id"
              element={<ReservationForm isEditing={true} />}
            />
          )}

          {isAuthenticated && <Route path="/events" element={<ListEvents />} />}
          {isAuthenticated && (
            <Route path="/event-new" element={<EventForm />} />
          )}
          {isAuthenticated && (
            <Route path="/edit-event/:id" element={<EditEvent />} />
          )}
        </Routes>
      </PageWrapper>
      <Footer />
    </Router>
  );
};
// ** Main App Component **
const App = () => (
  <AuthProvider>
    <UserProvider>
      <DarkModeProvider>
        <Home />
      </DarkModeProvider>
    </UserProvider>
  </AuthProvider>
);

export default App;
