import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getCityCoordinates } from "../utils/geocode";
import PropTypes from "prop-types";
import Notification from "../components/Notification";
import { AuthContext } from "../context/AuthContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import StarRatings from "react-star-ratings";

const calculateAverageRating = (messages) => {
  if (messages.length === 0) return 0;

  let totalFavorites = 0;
  let totalReports = 0;
  messages.forEach((message) => {
    totalFavorites += message.is_favorite;
    totalReports += message.is_report;
  });

  return (totalFavorites - totalReports) / messages.length;
};
// Configuration de l'icône par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Configuration de react-slick
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const FichePlace = () => {
  const [position, setPosition] = useState(null);
  const [place, setPlace] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useContext(AuthContext);

  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/places/${id}`
        );
        const fetchedPlace = response.data.place;
        setPlace(fetchedPlace);
        console.log("Fetched place:", fetchedPlace);

        // Fetch photos
        console.log(
          `Fetching photos from: http://127.0.0.1:8000/api/places/${id}/photos`
        );
        const photosResponse = await axios.get(
          `http://127.0.0.1:8000/api/places/${id}/photos`
        );
        console.log("Photos response:", photosResponse);
        setPhotos(photosResponse.data); // Changed this line
        console.log("Fetched photos:", photosResponse.data);

        // Fetch messages for ratings
        const messagesResponse = await axios.get(
          "http://127.0.0.1:8000/api/messages",

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const messages = messagesResponse.data;
        setAverageRating(calculateAverageRating(messages));

        try {
          if (fetchedPlace.address) {
            const { lat, lon } = await getCityCoordinates(fetchedPlace.address);
            setPosition([lat, lon]);
            console.log("Coordinates from address:", { lat, lon });
          } else if (fetchedPlace.latitude && fetchedPlace.longitude) {
            setPosition([fetchedPlace.latitude, fetchedPlace.longitude]);
            console.log("Coordinates from latitude and longitude:", {
              lat: fetchedPlace.latitude,
              lon: fetchedPlace.longitude,
            });
          } else {
            throw new Error("No address or coordinates available");
          }
        } catch (error) {
          console.error(
            `Erreur pour ${fetchedPlace.address}: ${error.message}`
          );
          if (fetchedPlace.latitude && fetchedPlace.longitude) {
            setPosition([fetchedPlace.latitude, fetchedPlace.longitude]);
            console.log("Fallback coordinates from latitude and longitude:", {
              lat: fetchedPlace.latitude,
              lon: fetchedPlace.longitude,
            });
          } else {
            throw new Error("No address or coordinates available");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la place", error);
        setError(
          "Erreur lors de la récupération de la place. Veuillez vérifier l'ID ou l'URL."
        );
      }
    };

    fetchPlace();
  }, [id, token]);

  const handleSendMessage = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/messages",
        { place_id: id, content: message },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      Notification.success("Message envoyé avec succès !");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
    }
  };

  const handleFavorite = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/messages/favorite",
        { place_id: id, content: "Favoris Ajouté", status: "En attente" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setIsFavorite(true);
      Notification.success("Place ajoutée aux favoris avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris", error);
      Notification.error("Erreur lors de l'ajout aux favoris");
    }
  };

  const handleReport = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/messages/report",
        { place_id: id, content: "Signalement Ajouté", status: "En attente" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setIsReported(true);
      Notification.success("Place signalée avec succès !");
    } catch (error) {
      console.error("Erreur lors du signalement", error);
    }
  };

  if (error) return <div>{error}</div>;
  if (!place) return <div>Chargement des données...</div>;

  const { title, price, description, address, photo, type /*user_id*/ } = place;

  const formatTarifsWithSpaces = (tarifs) => {
    return tarifs.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const TarifsComponent = ({ tarifs }) => {
    const formattedTarifs = formatTarifsWithSpaces(parseFloat(tarifs));
    return (
      <span className="mt-2 text-gray-600 text-ml font-extrabold">
        {formattedTarifs} €
      </span>
    );
  };
  const customIcon = new L.divIcon({
    html: `<i class="fas fa-${type} text-2xl text-${
      ["red", "orange", "yellow", "green", "blue", "purple"][
        Math.floor(Math.random() * 6)
      ]
    }-700"></i>`,

    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [10, 5],
  });
  return (
    <div className="container mx-auto px-4  py-12 mt-16 mb-40 z-40 ">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden animate-fadeIn pt-12">
        <div className="md:flex">
          <div className="md:w-1/2 p-4">
            <div className="relative h-96 mb-20">
              <Slider {...settings}>
                <div key="0" className="relative h-96 mb-4">
                  <img
                    className="w-full h-full object-cover rounded-lg animate-fadeIn"
                    src={`http://127.0.0.1:8000${photo}`}
                    alt={title}
                  />
                </div>
                {photos.map((photo, index) => (
                  <div key={index} className="relative h-96 mb-4">
                    <img
                      className="w-full h-full object-cover rounded-lg animate-fadeIn"
                      src={`http://127.0.0.1:8000${photo.photo_path}`}
                      alt={title}
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div className="mb-52">
              <h3 className="text-xl font-semibold mb-2 text-red-600">
                <i className="fas fa-map-marker-alt mr-2"></i>Localisation
              </h3>
              <p className="mt-6 text-gray-500 text-2xl font-extrabold">
                {address}
              </p>
              <div className="h-64 bg-gray-300 rounded-lg">
                <div className="h-96  mt-5 ">
                  {position ? (
                    <MapContainer
                      center={position}
                      zoom={13}
                      className="h-full z-30 rounded-xl"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={position} icon={customIcon}>
                        <Popup className="p-2">
                          <div className="text-center">
                            <a
                              href={`/fiche-place/${id}`}
                              className="text-md font-bold text-red-800"
                            >
                              {title}
                            </a>
                            <br></br>

                            <img
                              className="h-40 w-40 object-cover rounded-lg animate-fadeIn"
                              src={`http://127.0.0.1:8000${photo}`}
                              alt={title}
                            />
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-4">
            <div className="animate-slideIn">
              <h2 className="text-3xl font-bold text-red-800 mb-4">
                <i className={`fas fa-${type} mr-2`}></i>
                {title}
              </h2>
              <div className="mb-6">
                <StarRatings
                  rating={averageRating}
                  starRatedColor="#FFC107"
                  starDimension="20px"
                  numberOfStars={5}
                  name="rating"
                  style={{ lineHeight: "1.5rem" }}
                ></StarRatings>{" "}
                <i className="fas fa-arrow-circle-right  text-yellow-500 mr-2 "></i>
                <span className="text-gray-800 text-sm">
                  {averageRating.toFixed(2)} / 5
                </span>
              </div>

              <p className="text-gray-600 mb-4">{description}</p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-red-600">
                  <i className="far fa-clock mr-2"></i>Horaires de visite
                </h3>
                <p className="text-gray-600">
                  <i className="fas fa-sun text-yellow-500 mr-2"></i>Accessible
                  selon les horaires
                </p>
                <p className="text-gray-600">
                  <i className="fas fa-users text-blue-500 mr-2"></i>Visites
                  guidées disponibles sur réservation
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-red-600">
                  <i className="fas fa-euro-sign mr-2"></i>Tarifs
                </h3>
                <p className="text-gray-600">
                  <i className="fas fa-walking text-green-500 mr-2"></i>Accès
                  gratuit au lieu
                </p>
                <p className="text-gray-600">
                  <i className="fas fa-map-signs text-purple-500 mr-2"></i>
                  Visite : à partir de{" "}
                  <TarifsComponent tarifs={price.toString()} /> par personne
                </p>
              </div>
              <div className="flex space-x-4">
                <a
                  href={`/places-reservations?event=16`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    <i className="fas fa-ticket-alt mr-2"></i>Réserver une
                    visite
                  </button>
                </a>
              </div>
              <div className="bg-gray-100 rounded-lg shadow-md p-4 mt-6">
                <div className="bg-white rounded-lg shadow-md w-full p-4">
                  <button
                    onClick={handleFavorite}
                    disabled={isFavorite}
                    className={`mr-3   inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-yellow-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isFavorite ? "bg-gray-200" : ""
                    }`}
                  >
                    <i className="fas fa-thumbs-up mr-2"></i>{" "}
                    {isFavorite ? "Ajouté aux favoris" : "Aimer la visite"}
                  </button>

                  <button
                    onClick={handleReport}
                    disabled={isReported}
                    className={`bg-red-600 text-white  inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md  hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isReported ? "bg-gray-200" : ""
                    }`}
                  >
                    <i className="fas fa-thumbs-down mr-2"></i>{" "}
                    {isReported ? "Signalé" : "Pas aimer"}
                  </button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="mt-6"
                >
                  <div className="mb-4">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-3"
                    >
                      Votre message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="3"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 sm:text-sm"
                      placeholder="Écrivez votre message ici..."
                    ></textarea>
                  </div>
                  {isAuthenticated ? (
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Envoyer
                    </button>
                  ) : (
                    <div className="m-1">
                      <a
                        href="/login"
                        className="bg-green-500 hover:bg-green-700 text-sm text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                      >
                        envoyer un message
                      </a>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FichePlace.propTypes = {
  tarifs: PropTypes.number,
};

export default FichePlace;
