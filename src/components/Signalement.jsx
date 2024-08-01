import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';

const Signalement = () => {
  const [messages, setMessages] = useState([]);
  const [places, setPlaces] = useState([]);
  const [replyToId, setReplyToId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [notification] = useState(null);
  const navigate = useNavigate();

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/messages', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages', error);
      if (error.response) {
        console.error('Erreur:', error.response.data);
      }
    }
  }, []);

  const fetchPlaces = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/places', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPlaces(response.data.places || response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des places', error);
      if (error.response) {
        console.error('Erreur:', error.response.data);
      }
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchPlaces();
  }, [fetchMessages, fetchPlaces]);

  const reportedMessages = messages.filter(message => message.is_report);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessages(messages.filter(message => message.id !== id));
      Notiflix.Notify.success('Message supprimé avec succès.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la suppression du message', error);
      Notiflix.Notify.failure('Erreur lors de la suppression du message.');
    }
  };

  const confirmDelete = (id) => {
    Notiflix.Confirm.show(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce message ?',
      'Oui',
      'Non',
      () => handleDelete(id),
      () => {},
      {
        width: '320px',
        borderRadius: '8px',
        titleColor: '#000',
        messageColor: '#000',
        buttonsFontSize: '16px',
        okButtonBackground: '#007bff',
        cancelButtonBackground: '#6c757d',
        okButtonColor: '#fff',
        cancelButtonColor: '#fff',  
      }
    );
  };

  const handleReply = (id) => {
    setReplyToId(id);
    setReplyContent('');
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      try {
        //console.log('Submitting reply...');
        const response = await axios.post('http://127.0.0.1:8000/api/messages', {
          place_id: messages.find(m => m.id === replyToId)?.place_id,
          content: replyContent,
          status: 'Répondu',
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        //console.log('Reply submitted:', response.data);
        setMessages([...messages, response.data]);
        setReplyToId(null);
        setReplyContent('');
        Notiflix.Notify.success('Réponse envoyée avec succès.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Erreur lors de la soumission de la réponse', error);
        Notiflix.Notify.failure('Erreur lors de la soumission de la réponse.');
      }
    }
  };

  const getPlaceDetails = (placeId) => {
    const found = places.find(a => a.id === placeId);
    return found || { title: "Place inconnue", photo: "https://example.com/default.jpg" };
  };

  return (
    <div id="signalements" className="mt-8 bg-white rounded-lg shadow-md animate-slideIn  mb-8 p-6 w-screen md:w-3/4 lg:w-2/3 xl:w-2/3 md:p-9">
  {notification && (
    <Notification type={notification.type} message={notification.message} />
  )}
  <h1 className="text-2xl font-bold mb-6 dark:text-gray-800 pl-8">Gestion des signalements</h1>

  <div className="bg-white shadow-md rounded-lg overflow-hidden ">
    <table className="divide-y divide-gray-200 ">
      <thead className="bg-gray-50">
        <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200 dark:text-gray-800">
        {reportedMessages.map((message) => {
          const place = getPlaceDetails(message.place_id);
          return (
            <React.Fragment key={message.id}>
              <tr className="animate-fadeIn">
                
                <td className="px-6 py-4">
                  <a href={`/fiche-place/${place.id}`} className="flex items-center">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-12 w-12 rounded"
                          src={`http://127.0.0.1:8000${place.photo}`}
                          alt={place.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{place.title}</div>
                        <div className="text-sm text-gray-500">ID: {message.place_id}</div>
                      </div>
                    </div>
                  </a>
                </td>
              
               
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className={`mr-2 ${message.is_favorite ? 'text-yellow-500' : ''} hover:text-yellow-700`}
                    onMouseEnter={() =>
                      Notiflix.Notify.warning('Favoris', {
                        position: 'center-top',
                        timeout: 1000,
                        clickToClose: true,
                        showOnlyTheLastOne: true,
                        pauseOnHover: true,
                        distance: '100px',
                        top: '100px',
                        width: '300px',
                      })
                    }
                  >
                    <i className="fas fa-star"></i>
                  </button>

                  <button
                    className={`mr-2 ${message.is_report ? 'text-red-500' : ''}`}
                    onMouseEnter={() =>
                      Notiflix.Notify.info('Signalement', {
                        position: 'center-top',
                        timeout: 1000,
                        clickToClose: true,
                        showOnlyTheLastOne: true,
                        pauseOnHover: true,
                        distance: '100px',
                        top: '100px',
                        width: '300px',
                      })
                    }
                  >
                    <i className="fas fa-flag"></i>
                  </button>
                  <button
                    onClick={() => handleReply(message.id)}
                    className="text-green-600 hover:text-green-900 mr-2"
                  >
                    <i className="fas fa-reply"></i>
                  </button>
                  <button
                    onClick={() => confirmDelete(message.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(message.created_at).toLocaleString()}
                </td>
              </tr>
              {replyToId === message.id && (
                <tr className="animate-slideDown">
                  <td colSpan="6" className="px-6 py-4 bg-gray-50">
                    <form onSubmit={handleSubmitReply} className="flex items-center">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="flex-grow border border-gray-300 rounded-lg px-4 py-2 mr-2"
                        placeholder="Entrez votre réponse..."
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Répondre
                      </button>
                    </form>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

   
  );
};

export default Signalement;
