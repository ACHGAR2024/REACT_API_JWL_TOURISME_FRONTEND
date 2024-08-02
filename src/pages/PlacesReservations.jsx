import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const PlacesReservations = () => {
  const [places_reservations, setPlaces] = useState([]);
  const location = useLocation();

  // Fonction pour obtenir les paramètres de l'URL
  const getQueryParams = (query) => {
    return query
      .substring(1)
      .split("&")
      .reduce((params, param) => {
        const [key, value] = param.split("=");
        params[key] = value;
        return params;
      }, {});
  };

  useEffect(() => {
    const queryParams = getQueryParams(location.search);
    const eventId = queryParams.event;

    const fetchPlaces = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/places_reservations",
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const allPlaces = response.data.places_reservations || [];
        const filteredPlaces = allPlaces.filter(
          (place) => place.id_events === parseInt(eventId, 10)
        );
        setPlaces(filteredPlaces);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des places_reservations",
          error
        );
      }
    };

    if (eventId) {
      fetchPlaces();
    }
  }, [location.search]);

  return (
    <div
      style={{ height: "100vh", width: "100%" }}
      className="bg-gray-900 mt-14 mb-24 dark:bg-gray-900 dark:text-white"
    >
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-red-600 mb-8 text-center animate-slideIn dark:text-red-400">
          <i className="fas fa-map-marked-alt mr-2"></i>Lieux de reservations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {places_reservations.map((places_reservation) => (
            <div
              key={places_reservation.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fadeIn"
            >
              <div className="p-4">
                <p className="text-gray-500 text-sm mb-2 dark:text-gray-300">
                  {places_reservation.reservation_start_date} -{" "}
                  {places_reservation.reservation_end_date}
                </p>
                <h3 className="text-xl font-semibold text-red-600 mb-2 dark:text-red-400">
                  <i className={`fas fa-credit-card mr-2`}></i>
                  {places_reservation.name_place_tiket}
                </h3>
                <p className="text-gray-600 text-sm bg-slate-200 dark:bg-gray-700 p-3 rounded h-20 mb-3 dark:text-white">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {places_reservation.address_place}
                </p>
                <p className="text-gray-600 text-sm bg-slate-200 dark:bg-gray-700 p-3 rounded dark:text-white">
                  <i className="fas fa-phone mr-2"></i>
                  {places_reservation.telephone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PlacesReservations;
