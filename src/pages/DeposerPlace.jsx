import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';

const DeposerPlace = () => {
  
  const useridrecup = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_ids: [], // Change category_id to category_ids
    address: '',
    photo: null,
    latitude: '',
    longitude: '',
    type: '',
  });

  const [categories, setCategories] = useState([]);
  const [suggestedCities, setSuggestedCities] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories', error);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  const handlePlaceSearch = async (e) => {
    const searchQuery = e.target.value;
    setFormData((prev) => ({
      ...prev,
      address: searchQuery,
    }));

    if (searchQuery.length >= 3) {
      try {
        const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${searchQuery}&limit=1`);
        setSuggestedCities(response.data.features || []);
      } catch (error) {
        console.error('Erreur lors de la recherche adresse', error);
      }
    } else {
      setSuggestedCities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('MON USER ID:', useridrecup.id);
    if (!useridrecup.id) {
      console.error('Erreur : ID utilisateur non disponible');
      Notification.error('ID utilisateur non disponible');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('photo', formData.photo);
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('user_id', useridrecup.id); // Utilisation de `myIdUser`

      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      formDataToSend.append('publication_date', currentDate);

      // Append category IDs as JSON string
      formDataToSend.append('category_ids', JSON.stringify(formData.category_ids));

      await axios.post(
        'http://127.0.0.1:8000/api/places',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      Notification.success('Place ajoutée avec succès !');
      navigate('/dashboard');

      setFormData({
        title: '',
        description: '',
        price: '',
        category_ids: [],
        address: '',
        photo: null,
        latitude: '',
        longitude: '',
        type: '',
      });

    } catch (error) {
      console.error('Erreur lors de la création de la place :', error.response ? error.response.data : error.message);
      Notification.error('Erreur lors de la création de la place');
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'photo') {
      setFormData((prev) => ({
        ...prev,
        photo: e.target.files[0],
      }));
    } else if (e.target.name === 'category_ids') {
      const options = e.target.options;
      const values = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          values.push(options[i].value);
        }
      }
      setFormData((prev) => ({
        ...prev,
        category_ids: values,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-72 w-1/2">
      <h1 className="text-3xl font-bold mb-8 text-black">Déposer une place</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Titre place
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Titre de votre place"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Décrivez votre place en détail"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Prix
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="number"
            placeholder="Prix en euros"
            name="price"
            value={formData.price || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category_ids">
            Catégorie
          </label>
          <select
            className="block appearance-none h-10 w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            
            id="category_ids"
            name="category_ids"
            value={formData.category_ids}
            onChange={handleChange}
           
            required
            
          >
            <option value="">Choisir une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
            Adresse Complète
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            placeholder="Rechercher une adresse…"
            name="address"
            value={formData.address || ''}
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">
            Latitude
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="latitude"
            type="text"
            placeholder="Format latitude xx.xxxxx"
            name="latitude"
            value={formData.latitude || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
            Longitude
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="longitude"
            type="text"
            placeholder="Format longitude xx.xxxxx"
            name="longitude"
            value={formData.longitude || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
            Photo
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="photo"
            type="file"
            name="photo"
            onChange={handleChange}
            accept="image/*"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Type
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="type"
            type="text"
            placeholder="Type de la place"
            name="type"
            value={formData.type || ''}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Déposer
        </button>
      </form>
    </div>
  );
};

export default DeposerPlace;