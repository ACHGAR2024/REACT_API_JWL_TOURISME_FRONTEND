import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import Notification from "./Notification";

const EditPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suggestedCities, setSuggestedCities] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    user_id: "",
    photo: null,
    category_ids: [],
    address: "",
    latitude: "",
    longitude: "",
    type: "",
  });
  const [error, setError] = useState(null); // Ajout d'état pour gérer les erreurs

  const { token } = useContext(AuthContext);
  const user = useContext(UserContext);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/places/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        const { place } = response.data;
        setPlace(place);
        setFormData({
          title: place.title,
          description: place.description,
          price: place.price,
          user_id: place.user_id,
          photo: null,
          category_ids: place.category_ids || [],
          address: place.address || "",
          latitude: place.latitude || "",
          longitude: place.longitude || "",
          type: place.type || "",
        });
      } catch (error) {
        setError("Erreur lors de la récupération de la place");
        console.error(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        setCategories(response.data.categories);
      } catch (error) {
        setError("Erreur lors de la récupération des catégories");
        console.error(error);
      }
    };

    fetchPlace();
    fetchCategories();
  }, [id, token]);

  if (place && user && user.id !== place.user_id) {
    return <div>Vous n&apos;êtes pas autorisé à modifier cette place.</div>;
  }

  const handlePlaceSearch = async (e) => {
    const searchQuery = e.target.value;
    setFormData((prev) => ({
      ...prev,
      address: searchQuery,
    }));

    if (searchQuery.length >= 3) {
      try {
        const response = await axios.get(
          `https://api-adresse.data.gouv.fr/search/?q=${searchQuery}&limit=1`
        );
        setSuggestedCities(response.data.features || []);
      } catch (error) {
        setError("Erreur lors de la recherche adresse");
        console.error(error);
      }
    } else {
      setSuggestedCities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const geocodeAddress = async (address) => {
      try {
        const response = await axios.get(
          `https://api-adresse.data.gouv.fr/search/?q=${address}&limit=1`
        );
        if (response.data.features.length > 0) {
          const { geometry } = response.data.features[0];
          const [longitude, latitude] = geometry.coordinates;
          return { latitude, longitude };
        }
      } catch (error) {
        setError("Erreur lors du géocodage de l'adresse");
        console.error(error);
      }
      return { latitude: "", longitude: "" };
    };

    const { latitude, longitude } = await geocodeAddress(formData.address);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "category_ids") {
          formData[key].forEach((id) =>
            formDataToSend.append("category_ids[]", id)
          );
        } else if (key === "photo") {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      formDataToSend.append("latitude", latitude);
      formDataToSend.append("longitude", longitude);
      formDataToSend.append("_method", "PUT");

      await axios.post(
        `http://127.0.0.1:8000/api/places/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Notification.success("Place modifiée avec succès !");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setError("Erreur lors de la modification de la place");
      console.error(
        "Erreur lors de la modification de la place :",
        error.response
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (name === "category_ids") {
      const selectedValues = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: selectedValues,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === "file" ? files[0] : value,
      }));
    }
  };

  if (!place) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-72 w-2/3">
      <h1 className="text-3xl font-bold mb-8 text-black">Modifier place</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Titre place
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Titre de votre place"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Décrivez votre place en détail"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="price"
          >
            Prix
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="number"
            placeholder="Prix en euros"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="category_ids"
          >
            Catégories
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category_ids"
            name="category_ids"
            value={formData.category_ids}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Adresse Complète
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            placeholder="Rechercher une adresse…"
            name="address"
            value={formData.address || ""}
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
                      address: city.properties.label,
                      latitude: city.geometry.coordinates[1],
                      longitude: city.geometry.coordinates[0],
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
            htmlFor="latitude"
          >
            Latitude
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="latitude"
            type="text"
            placeholder="Format latitude xx.xxxxx"
            name="latitude"
            value={formData.latitude || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="longitude"
          >
            Longitude
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="longitude"
            type="text"
            placeholder="Format longitude xx.xxxxx"
            name="longitude"
            value={formData.longitude || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="type"
          >
            Type
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="type"
            type="text"
            placeholder="Type de votre place"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="photo"
          >
            Photo
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="photo"
            type="file"
            name="photo"
            onChange={handleChange}
          />
        </div>

        <div className="right-0 text-right m-5">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Modifier place
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlace;
