import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Musees = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "";

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchTerm] = useState("");
  const [category] = useState(initialCategory);
  const [sortOrder] = useState("");

  // Fetching places
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const url = `http://127.0.0.1:8000/api/places/category/3`;

        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        setPlaces(response.data.places || []);
        setFilteredPlaces(response.data.places || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des places", error);
      }
    };

    fetchPlaces();
  }, [category]);

  // Filtering and sorting places
  useEffect(() => {
    let result = places;

    if (searchTerm) {
      result = result.filter((place) =>
        place.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder) {
      result = result.sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    setFilteredPlaces(result);
  }, [searchTerm, sortOrder, places]);

  // Handling category change

  return (
    <div className="container mx-auto px-4 pt-24 mb-36">
      <h2 className="text-3xl font-bold text-red-600 mb-8 text-center animate-slideIn">
        <i className="fas fa-palette mr-2"></i>Découvrez les Trésors Culturels
        de Lyon
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover-zoom animate-fadeIn"
          >
            <a href={`/fiche-place/${place.id}`} className="block">
              <div className="relative">
                <img
                  src={`http://127.0.0.1:8000${place.photo}`}
                  alt={place.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-0 left-0 bg-blue-700 text-white py-2 px-4 rounded-br-lg">
                  <i className={`fas fa-${place.type} mr-2`}></i>
                  {place.title}
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">
                  {place.description}
                </p>
                <div className="flex justify-between items-center">
                  <a
                    href={`/musee/${place.id}`}
                    className="bg-rose-600 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition duration-300"
                  >
                    <i className="fas fa-ticket-alt mr-2"></i>Réserver
                  </a>
                  <span className="text-indigo-600">
                    {/*<i className="fas fa-star mr-1"></i>4.8*/}
                  </span>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Musees;
