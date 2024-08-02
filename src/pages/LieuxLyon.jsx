import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LieuxLyon = () => {
  const [places, setPlaces] = useState([]);

  // Fetching places
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/places", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        //console.log('Places:', response.data);
        setPlaces(response.data.places || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des places", error);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }} className="mt-14 mb-24">
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-red-600 mb-8 text-center animate-slideIn">
          <i className="fas fa-map-marked-alt mr-2"></i>Lieux Insolites à Lyon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {places.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fadeIn"
            >
              <img
                src={`http://127.0.0.1:8000${place.photo}`}
                alt={place.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  <i className={`fas ${place.icon} mr-2`}></i>
                  {place.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {place.description.substring(0, 150) +
                    (place.description.length > 150 ? "..." : "")}
                </p>

                <Link
                  to={`/fiche-place/${place.id}`}
                  className="mt-4 inline-block bg-blue-800 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  <i className="fas fa-info-circle mr-2"></i>En savoir plus
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LieuxLyon;
