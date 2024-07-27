import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getCityCoordinates } from '../utils/geocode';
import PropTypes from 'prop-types';
import Notification from '../components/Notification';
import { AuthContext } from '../context/AuthContext';
//import SellerInfo from '../components/SellerInfo';

// Configuration de l'icône par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const FichePlace = () => {
  const [position, setPosition] = useState(null);
  const [place, setPlace] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/places/${id}`);
        const fetchedPlace = response.data.place;
        setPlace(fetchedPlace);

        try {
          if (fetchedPlace.address) {
            const { lat, lon } = await getCityCoordinates(fetchedPlace.address);
            setPosition([lat, lon]);
          } else if (fetchedPlace.latitude && fetchedPlace.longitude) {
            setPosition([fetchedPlace.latitude, fetchedPlace.longitude]);
          } else {
            throw new Error('No address or coordinates available');
          }
        } catch (error) {
          console.error(`Erreur pour ${fetchedPlace.address}: ${error.message}`);
          if (fetchedPlace.latitude && fetchedPlace.longitude) {
            setPosition([fetchedPlace.latitude, fetchedPlace.longitude]);
          } else {
            throw new Error('No address or coordinates available');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la place', error);
        setError('Erreur lors de la récupération de la place. Veuillez vérifier l\'ID ou l\'URL.');
      }
    };

    fetchPlace();
  }, [id]);

  const handleSendMessage = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/messages',
        { place_id: id, content: message },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      Notification.success('Message envoyé avec succès !');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message', error);
    }
  };

  const handleFavorite = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/messages/favorite',
        { place_id: id, content: 'Favoris Ajouté', status: 'En attente' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setIsFavorite(true);
      Notification.success('Place ajoutée aux favoris avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris', error);
      Notification.error('Erreur lors de l\'ajout aux favoris');
    }
  };

  const handleReport = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/messages/report',
        { place_id: id, content: 'Signalement Ajouté', status: 'En attente' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setIsReported(true);
      Notification.success('Place signalée avec succès !');
    } catch (error) {
      console.error('Erreur lors du signalement', error);
    }
  };

  if (error) return <div>{error}</div>;
  if (!place) return <div>Chargement des données...</div>;

  const { title, price, description, photo, address, /*user_id*/ } = place;

  const formatTarifsWithSpaces = (tarifs) => {
    return tarifs.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const TarifsComponent = ({ tarifs }) => {
    const formattedTarifs = formatTarifsWithSpaces(parseFloat(tarifs));
    return <span className="mt-2 text-gray-600 text-ml font-extrabold">{formattedTarifs} €</span>;
  };
  const [currentPhotoIndex, setCurrentPhotoIndex] = "";

  const photos = [
    "/images/vieux-lyon-1.jpg",
    "/images/vieux-lyon-2.jpg",
    "/images/vieux-lyon-3.jpg",
    "/images/vieux-lyon-4.jpg"
  ];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };
  return (

    
    <div className="container mx-auto px-4 py-8 mt-20 mb-40 z-40">
       <div className="bg-white shadow-lg rounded-lg overflow-hidden animate-fadeIn">
          <div className="md:flex">
            <div className="md:w-1/2 p-4">
              <div className="relative h-96 mb-4">
              <img className="w-full h-full object-cover rounded-lg animate-fadeIn" src={`http://127.0.0.1:8000${photo}`} alt={title} />
                <img 
                  src={photos[currentPhotoIndex]} 
                  alt={`Vieux Lyon - Photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover rounded-lg animate-fadeIn"
                />
                <button onClick={prevPhoto} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition">
                  <i className="fas fa-chevron-left text-2xl text-red-600"></i>
                </button>
                <button onClick={nextPhoto} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition">
                  <i className="fas fa-chevron-right text-2xl text-red-600"></i>
                </button>
              </div>
              <div className="flex justify-center space-x-2 mt-4">
                {photos.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-3 h-3 rounded-full ${index === currentPhotoIndex ? 'bg-red-600' : 'bg-gray-300'}`}
                  ></div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2 text-red-600"><i className="fas fa-map-marker-alt mr-2"></i>Localisation</h3>
                <p className="mt-6 text-gray-500 text-2xl font-extrabold">{address}</p>
                <div className="h-64 bg-gray-300 rounded-lg">
                  {/* Placeholder for map */}
                  <div className="h-64 mb-4 mt-5 ">
              {position ? (
                <MapContainer center={position} zoom={13} className="h-full z-30 rounded-xl">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={position}>
                    <Popup>{address}</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <p>Loading...</p>
                
              )}
              
               
            </div>
                </div>
                
            {/*<SellerInfo sellerId={user_id} />*/}
              </div>
            </div>
            <div className="md:w-1/2 p-4">
              <div className="animate-slideIn">
                <h2 className="text-3xl font-bold text-red-800 mb-4"><i className="fas fa-landmark mr-2"></i>{title}</h2>
                <p className="text-gray-600 mb-4">
                 {description}</p>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-red-600"><i className="fas fa-star mr-2"></i>Points d intérêt</h3>
                  <ul className="list-none text-gray-600">
                    <li><i className="fas fa-church text-yellow-600 mr-2"></i>La Cathédrale Saint-Jean</li>
                    <li><i className="fas fa-balance-scale text-blue-600 mr-2"></i>Le Palais de Justice historique</li>
                    <li><i className="fas fa-archway text-green-600 mr-2"></i>Les traboules</li>
                    <li><i className="fas fa-building text-purple-600 mr-2"></i>La place du Change</li>
                  </ul>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-red-600"><i className="far fa-clock mr-2"></i>Horaires de visite</h3>
                  <p className="text-gray-600"><i className="fas fa-sun text-yellow-500 mr-2"></i>Accessible 24h/24, 7j/7</p>
                  <p className="text-gray-600"><i className="fas fa-users text-blue-500 mr-2"></i>Visites guidées disponibles sur réservation</p>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-red-600"><i className="fas fa-euro-sign mr-2"></i>Tarifs</h3>
                  <p className="text-gray-600"><i className="fas fa-walking text-green-500 mr-2"></i>Accès gratuit au lieu</p>
                  <p className="text-gray-600"><i className="fas fa-map-signs text-purple-500 mr-2"></i>Visite : à partir de <TarifsComponent tarifs={price.toString()} /> par personne</p>
                </div>
                <div className="flex space-x-4">
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                    <i className="fas fa-ticket-alt mr-2"></i>Réserver une visite
                  </button>
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
                    <i className="fas fa-heart mr-2"></i>Ajouter aux favoris
                  </button>
                </div>
                <div className="md:w-1/2 p-4">
            <div className="uppercase tracking-wide text-green-700 font-semibold text-lg ">
             <button
                onClick={handleFavorite}
                disabled={isFavorite}
                className={`mr-3 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isFavorite ? 'bg-gray-200' : ''}`}
              >
                <i className="fas fa-heart mr-2"></i> {isFavorite ? 'Ajouté aux favoris' : 'Ajouter aux favoris'}
              </button>
            </div>
          
            <div className="mt-6">
              
              <button
                onClick={handleReport}
                disabled={isReported}
                className={`inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isReported ? 'bg-gray-200' : ''}`}
              >
                <i className="fas fa-flag mr-2"></i> {isReported ? 'Signalé' : 'Signaler'}
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
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Votre message</label>
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
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Envoyer
                </button>
              ) : (
                <div className="m-1">
                  <a href="/login" className="bg-green-500 hover:bg-green-700 text-sm text-white font-bold py-3 px-6 rounded-lg transition duration-300">
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
