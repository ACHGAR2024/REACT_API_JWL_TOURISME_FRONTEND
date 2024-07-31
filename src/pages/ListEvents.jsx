import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Notiflix from 'notiflix';
import Notification from '../components/Notification';
import { AuthContext } from '../context/AuthContext';

const ListEvents = () => {
  const [events, setEvents] = useState([]);
  const { token } = useContext(AuthContext); // Assurez-vous d'avoir le token depuis le contexte

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/events');
        setEvents(response.data.events || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements', error);
        
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajoutez le token d'authentification ici
        },
      });
      setEvents((prevEvents) => prevEvents.filter(event => event.id !== id));
      Notification.success('Événement supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      Notification.error('Erreur lors de la suppression de l\'événement. Veuillez réessayer.');
    }
  };

  const confirmDelete = (id) => {
    Notiflix.Confirm.show(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cet événement ?',
      'Oui',
      'Non',
      () => handleDelete(id),
      () => {},
      {
        width: '320px',
        borderRadius: '8px',
      }
    );
  };

  return (
    <div id="events" className="mt-8 bg-white rounded-lg shadow-md p-6 animate-slideIn pt-20">
      <h2 className="text-2xl font-bold mb-4">Liste des événements</h2>
      <Link to="/event-new" className="mb-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
        <i className="fa fa-plus-circle fa-fw pr-1"></i> Ajouter un événement
      </Link>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Photo</th>
              <th className="py-3 px-6 text-left">Titre</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Adresse</th>
              <th className="py-3 px-6 text-left">Date de début</th>
              <th className="py-3 px-6 text-left">Date de fin</th>
              <th className="py-3 px-6 text-left">Tarifs</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {events.map(event => (
              <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">
                  <img src={`http://127.0.0.1:8000${event.photo_event}`} alt={event.title_event} className="w-8 h-8 rounded-full" />
                </td>
                <td className="py-3 px-6 text-left">{event.title_event}</td>
                <td className="py-3 px-6 text-left">{event.content_event}</td>
                <td className="py-3 px-6 text-left">{event.address_event}</td>
                <td className="py-3 px-6 text-left">{event.event_date}</td>
                <td className="py-3 px-6 text-left">{event.event_end_date}</td>
                <td className="py-3 px-6 text-left">{event.price_event}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex items-center justify-center">
                    <Link to={`/edit-event/${event.id}`} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                      <i className="fa fa-pencil"></i>
                    </Link>
                    <button
                      onClick={() => confirmDelete(event.id)}
                      className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                    >
                      <i className="fa fa-trash-o"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListEvents;
