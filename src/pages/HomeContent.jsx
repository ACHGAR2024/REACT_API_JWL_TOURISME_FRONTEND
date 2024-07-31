import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CartePlaces from "./CartePlaces";
import ActualitesLyon from "../components/ActualitesLyon";
import DarkModeToggle from "../components/DarkModeToggle";

const HomeContent = () => {
  const [places, setPlaces] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/rechercher-place?category=${category}`);
  };

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
        setPlaces(response.data.places || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des places", error);
      }
    };
    fetchPlaces();
  }, []);

  // Fetching events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/events", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setEvents(response.data.events || []);
      } catch (error) {
        console.error("Erreur lors de la sélection des evenements", error);
      }
    };
    fetchEvents();
  }, []);

  // Fetching categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/categories",
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories", error);
      }
    };
    fetchCategories();
  }, []);

  // Get the last 4 places
  const latestPlaces = places.slice(0, 4);

  return (
    <div className="left-0 right-0 w-full h-full pt-5 mb-20 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4">
        <DarkModeToggle />
      </header>
      <main className="container mx-auto px-8 pt-12 mb-24">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300">
            <i className="fas fa-map-marked-alt mr-2 text-red-600 dark:text-red-400"></i>
            Carte interactive de Lyon{" "}
            <i className="fas fa-map-marker-alt mr-2 text-red-500 dark:text-red-400"></i>
          </h2>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-96 border-2 border-blue-300 dark:border-blue-600 z-30">
            <CartePlaces />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300">
            <i className="fas fa-calendar-alt mr-2 text-orange-600 dark:text-orange-400"></i>
            Événements à venir
          </h2>
          {events
            .filter((event) => new Date(event.event_date) > new Date())
            .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
            .slice(0, 2)
            .map((event) => {
              const eventDate = new Date(event.event_date).toLocaleDateString(
                "fr-FR"
              );
              const eventEndDate = new Date(
                event.event_end_date
              ).toLocaleDateString("fr-FR");
              return (
                <div
                  key={event.id}
                  className="bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-md border-2 border-red-300 dark:border-red-600 mt-4"
                >
                  <h3 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-300">
                    <i className="fas fa-lightbulb mr-2 text-yellow-500 dark:text-yellow-400"></i>
                    {event.title_event}
                  </h3>
                  <p className="text-orange-600 dark:text-orange-300">
                    <i className="far fa-calendar mr-2"></i>
                    {eventDate} - {eventEndDate}
                  </p>
                </div>
              );
            })}
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300">
            <i className="fas fa-compass mr-2 text-green-600 dark:text-green-400"></i>
            Découvrir Lyon
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestPlaces.map((place) => (
              <Link key={place.id} to={`/fiche-place/${place.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:-translate-y-2">
                  <div
                    className="relative h-40 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(http://127.0.0.1:8000${place.photo})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/50 opacity-80 mt-28"></div>
                    <div className="absolute inset-0 flex flex-col items-center p-5 mt-28 justify-center">
                      <h3 className="text-xs font-semibold text-white">
                        {place.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                lien: "/lieux-lyon",
                name: "Lieux insolites",
                icon: "fa-camera-retro",
                color:
                  "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
              },
              {
                lien: "/restaurants",
                name: "Restaurants",
                icon: "fa-utensils",
                color:
                  "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
              },
              {
                lien: "/musees",
                name: "Musées",
                icon: "fa-palette",
                color:
                  "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300",
              },
            ].map((category) => (
              <Link
                key={category.name}
                to={category.lien}
                className="text-center"
              >
              <div
                key={category.name}
                className={`${category.color} p-4 rounded-lg shadow-md transition duration-300 hover:shadow-lg`}
              >
                <h3 className="text-xl font-semibold mb-2">
                  <i className={`fas ${category.icon} mr-2`}></i>
                  {category.name}
                </h3>
              </div>
              </Link>
            ))}
          </div>
        </section>


        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300">
            <i className="fas fa-th-large mr-2 text-yellow-600 dark:text-yellow-400"></i>
            Catégories
          </h2>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <i
                    className={`fa fa-${
                      cat.name_cat === "Monuments"
                        ? "monument"
                        : cat.name_cat === "Parcs"
                        ? "tree"
                        : cat.name_cat === "Musées"
                        ? "palette"
                        : cat.name_cat === "Restaurants"
                        ? "utensils"
                        : cat.name_cat === "Shopping"
                        ? "shopping-bag"
                        : cat.name_cat === "Sport"
                        ? "running"
                        : "landmark"
                    } 
                  ${
                    cat.name_cat === "Monuments"
                      ? "text-red-600 dark:text-red-400"
                      : cat.name_cat === "Parcs"
                      ? "text-orange-300 dark:text-orange-200"
                      : cat.name_cat === "Musées"
                      ? "text-yellow-900 dark:text-yellow-400"
                      : cat.name_cat === "Restaurants"
                      ? "text-yellow-600 dark:text-yellow-300"
                      : cat.name_cat === "Shopping"
                      ? "text-lime-600 dark:text-lime-400"
                      : cat.name_cat === "Sport"
                      ? "text-pink-500 dark:text-pink-400"
                      : "text-blue-600 dark:text-blue-400"
                  } 
                  mb-4 text-3xl`}
                  ></i>
                  <h3 className="font-semibold">{cat.name_cat}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8 mt-4">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300">
            <i className="fas fa-calendar-alt mr-2 text-purple-600 dark:text-purple-400"></i>
            Agenda des événements
          </h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              Prochains événements à Lyon
            </h3>
            <ul className="list-disc list-inside">
              {events
                .filter((event) => new Date(event.event_date) > new Date())
                .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
                .slice(0, 3)
                .map((event) => {
                  const eventDate = new Date(
                    event.event_date
                  ).toLocaleDateString("fr-FR");
                  const eventEndDate = new Date(
                    event.event_end_date
                  ).toLocaleDateString("fr-FR");
                  return (
                    <li
                      key={event.id}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {event.title_event} - {eventDate} - {eventEndDate}
                    </li>
                  );
                })}
            </ul>
          </div>
        </section>

        <ActualitesLyon />

        <section className="mb-8">
          <div className="mt-8 pt-8 border-t border-blue-700 dark:border-blue-300 text-center"></div>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <p>Office de Tourisme de Lyon</p>
                <p>Place Bellecour, 69002 Lyon</p>
                <p>Tél : 04 72 10 30 30</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
                <ul>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 dark:hover:text-blue-300"
                    >
                      Accueil
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 dark:hover:text-blue-300"
                    >
                      Découvrir Lyon
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 dark:hover:text-blue-300"
                    >
                      Agenda
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 dark:hover:text-blue-300"
                    >
                      Informations pratiques
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Suivez-nous
                </h4>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-300"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-300"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-300"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-300"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Newsletter
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Inscrivez-vous pour recevoir nos dernières actualités
                </p>
                <form className="mt-2">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="w-full p-2 rounded text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-red-600 dark:bg-red-700 text-white py-2 px-4 rounded hover:bg-red-700 dark:hover:bg-red-600 transition duration-300"
                  >
                    S&#39;inscrire
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeContent;
