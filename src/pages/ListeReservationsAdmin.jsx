import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Notiflix from "notiflix";
import Notification from "../components/Notification";
import PropTypes from "prop-types";

const ListeReservationsAdmin = ({ isEditing }) => {
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/places_reservations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        setReservations(response.data.places_reservations || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setEvents(response.data.events || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements", error);
      }
    };

    fetchReservations();
    fetchEvents();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/places_reservations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      setReservations(
        reservations.filter((reservation) => reservation.id !== id)
      );
      Notification.success("Réservation supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de la réservation:", error);
      if (error.response) {
        Notification.error(`Erreur: ${error.response.data.message}`);
      } else {
        Notification.error(
          "Erreur inconnue lors de la suppression de la réservation. Veuillez réessayer."
        );
      }
    }
  };

  const confirmDelete = (id) => {
    Notiflix.Confirm.show(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer cette réservation ?",
      "Oui",
      "Non",
      () => handleDelete(id),
      null,
      {
        width: "320px",
        borderRadius: "8px",
      }
    );
  };

  return (
    <div
      id="reservations"
      className="mt-8 bg-white rounded-lg shadow-md p-6 animate-slideIn"
    >
      <h2 className="text-2xl font-bold mb-4">
        Liste des lieux de réservations par évènement
      </h2>
      <Link
        to="/reservations-new"
        className="mb-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        <i className="fa fa-plus-circle fa-fw pr-1"></i> Ajouter un lieu de
        réservation
      </Link>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">
                Nom de lieu de réservation
              </th>
              <th className="py-3 px-6 text-left">Adresse</th>
              <th className="py-3 px-6 text-left">Télephone</th>
              <th className="py-3 px-6 text-left">Date de début réservation</th>
              <th className="py-3 px-6 text-left">
                Date de fin de réservation
              </th>
              <th className="py-3 px-6 text-left">Événement</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {reservations.map((reservation) => (
              <tr
                key={reservation.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">
                    {reservation.name_place_tiket}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{reservation.address_place}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{reservation.telephone}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{reservation.reservation_start_date}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{reservation.reservation_end_date}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>
                    {events.find((event) => event.id === reservation.id_events)
                      ?.title_event || "Événement inconnu"}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <Link
                      to={`/edit-reservation/${reservation.id}`}
                      className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                      onClick={() => isEditing(true)}
                    >
                      <i className="fa fa-pencil"></i>
                    </Link>
                    <button
                      onClick={() => confirmDelete(reservation.id)}
                      className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                    >
                      <i className="fa fa-trash-o"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ListeReservationsAdmin.propTypes = {
  isEditing: PropTypes.bool,
};

export default ListeReservationsAdmin;
