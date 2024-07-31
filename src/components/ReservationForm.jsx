import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Notification from "./Notification";
import PropTypes from "prop-types";

const ReservationForm = ({ isEditing }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name_place_tiket: "",
    address_place: "",
    reservation_start_date: "",
    reservation_end_date: "",
    id_events: "",
  });
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (isEditing && id) {
      const fetchReservation = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/places_reservations/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );
          const { reservation } = response.data;
          setReservation(reservation);
          setFormData({
            name_place_tiket: reservation.name_place_tiket,
            address_place: reservation.address_place,
            telephone: reservation.telephone,
            reservation_start_date: reservation.reservation_start_date,
            reservation_end_date: reservation.reservation_end_date,
            id_events: reservation.id_events,
          });
        } catch (error) {
          setError("Erreur lors de la récupération de la réservation");
          console.error(error);
        }
      };

      fetchReservation();
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setEvents(response.data.events);
      } catch (error) {
        setError("Erreur lors de la récupération des événements");
        console.error(error);
      }
    };

    fetchEvents();
  }, [id, token, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isEditing
        ? `http://127.0.0.1:8000/api/places_reservations/${id}`
        : "http://127.0.0.1:8000/api/places_reservations";

      const method = isEditing ? "put" : "post";

      await axios[method](endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      Notification.success(
        `Réservation ${isEditing ? "mise à jour" : "créée"} avec succès !`
      );

      setTimeout(() => {
        navigate("/reservations");
      }, 2000);
    } catch (error) {
      setError(
        `Erreur lors de la ${
          isEditing ? "mise à jour" : "création"
        } de la réservation`
      );
      console.error(
        `Erreur lors de la ${
          isEditing ? "mise à jour" : "création"
        } de la réservation:`,
        error.response
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  if (isEditing && !reservation) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-72 w-2/3">
      <h1 className="text-3xl font-bold mb-8 text-black">
        {isEditing
          ? "Modifier lieu de Réservation"
          : "Créer un lieu Réservation"}
      </h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name_place_tiket"
          >
            Nom de la Place
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name_place_tiket"
            type="text"
            placeholder="Nom de la place"
            name="name_place_tiket"
            value={formData.name_place_tiket}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address_place"
          >
            Adresse
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address_place"
            type="text"
            placeholder="Adresse"
            name="address_place"
            value={formData.address_place}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="telephone"
          >
            Telephone
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="telephone"
            type="text"
            placeholder="Telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="reservation_start_date"
          >
            Date de Début de Réservation
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="reservation_start_date"
            type="date"
            name="reservation_start_date"
            value={formData.reservation_start_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="reservation_end_date"
          >
            Date de Fin de Réservation
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="reservation_end_date"
            type="date"
            name="reservation_end_date"
            value={formData.reservation_end_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="id_events"
          >
            Événement
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="id_events"
            name="id_events"
            value={formData.id_events}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Choisir un événement
            </option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title_event}
              </option>
            ))}
          </select>
        </div>
        <div className="text-right">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isEditing ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </form>
    </div>
  );
};

ReservationForm.propTypes = {
  isEditing: PropTypes.bool,
  id: PropTypes.string,
};

export default ReservationForm;
