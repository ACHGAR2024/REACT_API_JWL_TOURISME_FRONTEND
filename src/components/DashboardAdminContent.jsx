import "chart.js/auto";
import ListePlacesAdmin from "../pages/ListePlacesAdmin";
import ListeCategories from "../pages/ListeCategories";
import PropTypes from "prop-types";
import Signalement from "../components/Signalement";
import UtilisateursAdmin from "./auth/UtilisateursAdmin";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import ListeReservationsAdmin from "../pages/ListeReservationsAdmin";
import ListEvents from "../pages/ListEvents";

const DashboardCard = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 ${color} animate-slideIn`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="mt-2 text-lg font-semibold">{value}</p>
      </div>
      <div
        className={`p-2 rounded-full ${color
          .replace("text-", "bg-")
          .replace("600", "100")}`}
      >
        <i className={`${icon} ${color}`}></i>
      </div>
    </div>
  </div>
);

const QuickActions = () => (
  <div
    id="quick-actions"
    className="mt-8 bg-white rounded-lg shadow-md p-6 animate-slideIn pt-20 w-screen md:w-2/4 lg:w-3/4 xl:w-3/4"
  >
    <h2 className="text-2xl font-bold mb-4 dark:text-gray-800">Actions rapides</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
      <a
        href="/messages-management"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
      >
        <i className="fa fa-envelope fa-fw pr-1"></i> Voir mes messages
      </a>
      <a
        href="/deposer_categorie"
        className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
      >
        <i className="fa fa-plus-circle fa-fw pr-1"></i> Nouvelle catégorie
      </a>
      <a
        href="/deposer_place"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
      >
        <i className="fa fa-plus-circle fa-fw pr-1"></i> Nouvelle place
      </a>
      <a
        href="/reservations-new"
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
      >
        <i className="fa fa-plus-circle fa-fw pr-1"></i> Nouveau lieu de
        réservation
      </a>

      <a
        href="/profil-user-update"
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
      >
        <i className="fa fa-cog fa-fw pr-1"></i> Paramètres
      </a>

      <a
        href="/"
        className="bg-sky-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
      >
        <i className="fa fa-sign-out  "></i> Page d&#39;accueil
      </a>
    </div>
  </div>
);

const DashboardAdminContent = () => {
  const [countPlaces, setCountPlaces] = useState(0);
  const [countMessages, setCountMessages] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);

  const { token } = useContext(AuthContext);
  const user = useContext(UserContext);

  useEffect(() => {
    const fetchPlaceCount = async () => {
      if (!user || !user.id) return;

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/places", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        setCountPlaces(response.data.places.length);
      } catch (error) {
        console.error("Erreur lors de la récupération des places", error);
      }
    };

    fetchPlaceCount();
  }, [token, user]);

  // Fetch total count of messages and calculate favorites and reports
  useEffect(() => {
    const fetchMessagesCount = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        setCountMessages(response.data.length);

        // Filter the favorite messages
        const userFavoriteMessages = response.data.filter(
          (message) => message.is_favorite === 1
        );

        setFavoriteCount(userFavoriteMessages.length);

        // Filter the reported messages
        const userReportedMessages = response.data.filter(
          (message) => message.is_report === 1
        );

        setReportCount(userReportedMessages.length);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages", error);
        if (error.response) {
          console.error("Erreur:", error.response.data);
        }
      }
    };

    fetchMessagesCount();
  }, [token]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 ">
      {/* Sidebar */}
      <aside className="hidden md:block bg-gray-900 text-white w-64 min-h-screen p-4 transition-all duration-300">
        <nav className="space-y-4 mt-14 w-64 h-screen">
          <div className="flex items-center justify-between ">
            <button className="md:hidden text-white focus:outline-none">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <a
            href="#quick-actions"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
          >
            <i className="fa fa-magic fa-fw pr-1"></i> Actions rapides
          </a>
          <a
            href="#signalements"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
          >
            <i className="fa fa-bell fa-fw pr-1"></i> Signalements
          </a>
          <a
            href="#utilisateurs"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
          >
            <i className="fa fa-users fa-fw pr-1"></i> Utilisateurs
          </a>
          <a
            href="#categories"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
          >
            <i className="fa fa-list fa-fw pr-1"></i> Gestion Catégories
          </a>
          <a
            href="#places"
            className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
          >
            <i className="fa fa-address-book fa-fw pr-1"></i> Liste places
          </a>
          <a
            href="#events"
            className="bg-sky-800 hover:bg-sky-900 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
          >
            <i className="fa fa-sitemap fa-fw pr-1"></i> Liste Evénements
          </a>
          <a
            href="#reservations"
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
          >
            <i className="fa fa-address-book fa-fw pr-1"></i> Liste lieux de Reservations
          </a>
          <a
            href="#animation"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center"
          >
            <i className="fa fa-clock fa-fw pr-1"></i> Quitter
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden sm:pl-8 lg:pl-8 xl:pl-8 dark:bg-slate-900">
        <div className="h-32">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white pt-12 pl-3">Tableau de bord</h1>
          </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-5 dark:bg-slate-900">
          <div className="dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:w-2/4 lg:w-3/4 xl:w-3/4">
            <DashboardCard
              title="Les places"
              icon="fa fa-bolt"
              value={countPlaces}
              color="text-blue-600"
            />
            <DashboardCard
              title="Messages"
              icon="fa fa-envelope"
              value={countMessages}
              color="text-green-600"
            />
            <DashboardCard
              title="Favoris"
              icon="fa fa-star"
              value={favoriteCount}
              color=""
            />
            <DashboardCard
              title="Signalements"
              icon="fa fa-flag"
              value={reportCount}
              color="text-red-600"
            />
          </div>
          <QuickActions />
          <Signalement />
          <UtilisateursAdmin />
          <ListeCategories />
          <ListEvents />
          <ListeReservationsAdmin />
          <ListePlacesAdmin />
          
          <div id="animation" className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
            <div className="relative w-full h-64 bg-white rounded-lg overflow-hidden flex items-center justify-center">
              <div className="character walking p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 2xl:p-24"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
};

export default DashboardAdminContent;