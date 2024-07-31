import { useEffect, useState } from "react";
import axios from "axios";

const Evenements = () => {
  const [events, setPlaces] = useState([]);

  // Fetching events
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/events", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        setPlaces(response.data.events || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des events", error);
      }
    };

    fetchPlaces();
  }, []);

  const isEventPassed = (date) => {
    const eventDate = new Date(date);
    return eventDate < new Date();
  };

  return (
    <div style={{ height: "100vh", width: "100%" }} className="mt-14 mb-24">
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-red-600 mb-8 text-center animate-slideIn">
          <i className="fas fa-bell-o mr-2"></i>Les événements programmés
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events
            .sort(
              (a, b) => new Date(b.event_end_date) - new Date(a.event_end_date)
            )
            .map((event) => {
              const isPassed = isEventPassed(event.event_end_date);
              return (
                <div
                  key={event.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden event-card animate-fadeIn ${
                    isPassed
                      ? "border-red-500 border-2 opacity-50"
                      : "border-green-500 border-2"
                  }`}
                >
                  <img
                    src={`http://127.0.0.1:8000${event.photo_event}`}
                    alt={event.title_event}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-6">
                    <p>
                      <span
                        className={`text-sm font-medium ${
                          isPassed ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        <i className="fas fa-calendar-alt mr-2"></i>
                        {new Date(event.event_date).toLocaleDateString()} -{" "}
                        {new Date(event.event_end_date).toLocaleDateString()}
                      </span>
                    </p>
                    <h3
                      className={`text-xl font-semibold mb-2 ${
                        isPassed ? "text-gray-400" : "text-gray-800"
                      }`}
                    >
                      <i className="fas fa-bell-o mr-2 text-sm"></i>
                      {event.title_event}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {event.content_event.substring(0, 150) +
                        (event.content_event.length > 150 ? "..." : "")}
                    </p>
                    <div className="flex justify-between items-center">
                      {!isPassed && (
                        <a
                          href={`/places-reservations?event=${event.id}`}
                          className="bg-sky-600 text-white px-5 py-1 rounded-full hover:bg-purple-600 transition duration-300"
                        >
                          <i className="fas fa-ticket-alt mr-2"></i>Réserver
                        </a>
                      )}
                      {isPassed && (
                        <span className="text-red-500 font-medium">
                          Terminé
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
};

export default Evenements;
