import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import Notification from "./Notification";

const EventForm = () => {
  const navigate = useNavigate();
  const useridrecup = useContext(UserContext);
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title_event: "",
    content_event: "",
    address_event: "",
    event_date: "",
    event_end_date: "",
    price_event: "",
    photo_event: null,
    user_id: useridrecup.id,
  });
  const [suggestedCities, setSuggestedCities] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title_event", formData.title_event);
    data.append("content_event", formData.content_event);
    data.append("address_event", formData.address_event);
    data.append("event_date", formData.event_date);
    data.append("event_end_date", formData.event_end_date);
    data.append("price_event", formData.price_event);
    if (formData.photo_event) {
      data.append("photo_event", formData.photo_event);
    }
    data.append("user_id", formData.user_id);

    try {
      await axios.post("http://127.0.0.1:8000/api/events", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      Notification.success("Événement créé avec succès !");
      setTimeout(() => {
        navigate("/events");
      }, 2000);
    } catch (error) {
      setError("Erreur lors de la création de l'événement");
      console.error(
        "Erreur lors de la création de l'événement:",
        error.response
      );
    }
  };

  const handlePlaceSearch = async (e) => {
    const searchQuery = e.target.value;
    setFormData((prev) => ({
      ...prev,
      address_event: searchQuery,
    }));

    if (searchQuery.length >= 3) {
      try {
        const response = await axios.get(
          `https://api-adresse.data.gouv.fr/search/?q=${searchQuery}&limit=1`
        );
        setSuggestedCities(response.data.features || []);
      } catch (error) {
        setError("Erreur lors de la recherche d'adresse");
        console.error(error);
      }
    } else {
      setSuggestedCities([]);
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      photo_event: e.target.files[0],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-72 w-2/3">
      <h1 className="text-3xl font-bold mb-8 text-black">Créer un événement</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title_event"
          >
            Titre de l&apos;événement
          </label>
          <input
            type="text"
            name="title_event"
            id="title_event"
            value={formData.title_event}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="content_event"
          >
            Description
          </label>
          <textarea
            name="content_event"
            id="content_event"
            value={formData.content_event}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address_event"
          >
            Adresse
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address_event"
            type="text"
            placeholder="Rechercher une adresse…"
            name="address_event"
            value={formData.address_event || ""}
            onChange={handlePlaceSearch}
            required
          />
          {suggestedCities.length > 0 && (
            <ul className="shadow border rounded mt-2 w-full bg-white">
              {suggestedCities.map((city) => (
                <li
                  key={city.properties.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      address_event: city.properties.label,
                    }));
                    setSuggestedCities([]);
                  }}
                >
                  {city.properties.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="event_date"
          >
            Date de début
          </label>
          <input
            type="date"
            name="event_date"
            id="event_date"
            value={formData.event_date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="event_end_date"
          >
            Date de fin
          </label>
          <input
            type="date"
            name="event_end_date"
            id="event_end_date"
            value={formData.event_end_date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="price_event"
          >
            Tarifs
          </label>
          <input
            type="text"
            name="price_event"
            id="price_event"
            value={formData.price_event}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="photo_event"
          >
            Photo
          </label>
          <input
            type="file"
            name="photo_event"
            id="photo_event"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Créer
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
