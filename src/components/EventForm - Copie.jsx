import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import Notification from './Notification';

const EventForm = ({ isEditing }) => {
  const { user } = useContext(UserContext) || {}; // Assurez-vous que userContext n'est pas null
  const useridrecup = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title_event: '',
    content_event: '',
    address_event: '',
    event_date: '',
    event_end_date: '',
    price_event: '',
    photo_event: null,
    user_id: '', // Valeur par défaut pour éviter les erreurs
  });
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    // Assurez-vous que user est défini avant de définir formData
    if (useridrecup) {
      setFormData(prevState => ({
        ...prevState,
        user_id: useridrecup.id,
      }));
      console.log('user_id:', useridrecup.id);
    }
  }, [useridrecup]);

  useEffect(() => {
    if (isEditing && id) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/events/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setFormData({ 
            title_event: response.data.event.title_event,
            content_event: response.data.event.content_event,
            address_event: response.data.event.address_event,
            event_date: response.data.event.event_date,
            event_end_date: response.data.event.event_end_date,
            price_event: response.data.event.price_event,
            photo_event: null,
            user_id: useridrecup.id,
          }); // Assurez-vous que user_id est défini
          console.log('user_id_2:', response.data.event.user_id);
        } catch (error) {
          setError('Erreur lors de la récupération de l\'événement');
          console.error(error);
        }
      };

      fetchEvent();
    }
  }, [id, token, isEditing, user, useridrecup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      photo_event: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifiez les champs requis
    const requiredFields = ['title_event', 'content_event', 'address_event', 'event_date', 'event_end_date', 'user_id'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');

    if (missingFields.length > 0) {
      setError(`Les champs suivants sont requis : ${missingFields.join(', ')}`);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    try {
      const endpoint = isEditing
        ? `http://127.0.0.1:8000/api/events/${id}`
        : 'http://127.0.0.1:8000/api/events';

      const method = isEditing ? 'put' : 'post';

      await axios[method](endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Notification.success(`Événement ${isEditing ? 'mis à jour' : 'créé'} avec succès !`);

      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.keys(errors).map(field => {
          return `${field.charAt(0).toUpperCase() + field.slice(1)}: ${errors[field].join(', ')}`;
        }).join('; ');
        setError(`Erreur lors de la ${isEditing ? 'mise à jour' : 'création'} de l'événement: ${errorMessages}`);
      } else {
        setError(`Erreur lors de la ${isEditing ? 'mise à jour' : 'création'} de l'événement`);
        console.error('Erreur lors de la soumission du formulaire', error);
      }
    }
  };

  if (isEditing && !formData.title_event) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container bg-slate-200 rounded-md shadow-xl mx-auto px-4 py-8 mt-20 mb-72 w-2/3">
      <h1 className="text-3xl font-bold mb-8 text-black">
        {isEditing ? 'Modifier' : 'Créer'} un événement
      </h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title_event">
            Titre de l&#39;événement
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content_event">
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address_event">
            Adresse
          </label>
          <input
            type="text"
            name="address_event"
            id="address_event"
            value={formData.address_event}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="event_date">
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="event_end_date">
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price_event">
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo_event">
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
            {isEditing ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

EventForm.propTypes = {
  isEditing: PropTypes.bool,
};

export default EventForm;