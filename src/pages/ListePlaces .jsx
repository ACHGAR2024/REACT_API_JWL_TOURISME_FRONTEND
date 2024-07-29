import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import Notiflix from 'notiflix';

const ListePlaces = () => {
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const user = useContext(UserContext);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/places', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      setPlaces(response.data.places || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des places', error);
    }
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/places', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        setPlaces(response.data.places || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des places', error);
      }
    };
    
    fetchPlaces();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/places/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setPlaces(places.filter(place => place.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la place', error);
    }
  
    try {
      await axios.delete(`http://127.0.0.1:8000/api/places/${id}/photos`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchPlaces();
    } catch (error) {
      console.error('Erreur lors de la suppression des photos de la place', error);
    }
  };

  const confirmDelete = (id) => {
    Notiflix.Confirm.show(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette place ?',
      'Oui',
      'Non',
      () => {
        handleDelete(id);
      },
      () => {
        // Action à prendre si l'utilisateur annule la suppression
      },
      {
        // Options supplémentaires de configuration (si nécessaire)
      }
    );
  };

  // Filtrer les places pour ne garder que celles qui appartiennent à l'utilisateur actuel
  const userPlaces = places.filter(place => user && user.id === place.user_id);

  return (
    <div id="mesplaces" className="mt-8 bg-white rounded-lg shadow-md p-6 animate-slideIn">
      <h2 className="text-2xl font-bold mb-4">Vos places récentes</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Photo</th>
              <th className="py-3 px-6 text-left">Titre</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-center">Prix</th>
              <th className="py-3 px-6 text-center">Date</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {userPlaces.map(place => (
              <tr key={place.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">
                    <img
                      src={`http://127.0.0.1:8000${place.photo}`}
                      alt={place.title}
                      className="w-20 h-20 rounded-lg object-cover hover:cursor-zoom-in"
                      onClick={() => window.open(`http://127.0.0.1:8000${place.photo}`)}
                    />
                  </span>
                </td>
                <td className="py-3 px-6 text-left">
                  <a href={`/fiche-place/${place.id}`} className="font-medium text-blue-500 hover:underline">
                    <span>{place.title}</span>
                  </a>
                </td>
                <td className="py-3 px-6 text-center">
                  <span className="font-medium">{place.description}</span>
                </td>
                <td className="py-3 px-6 text-center">
                  <span>{place.price}</span>
                </td>
                <td className="py-3 px-6 text-center">
                  <span>{place.publication_date}</span>
                </td>
                <td className="py-3 px-6 text-center">
  <div className="flex items-center justify-center space-x-4">
    <Link
      to={`/ajout-photos-place/${place.id}`}
      className="transform hover:text-purple-500 hover:scale-110 transition duration-300"
    >
      <i className="fa fa-image text-xl"></i>
    </Link>
    <button
      className="bg-blue-500 text-white p-2 rounded transition duration-300 hover:bg-blue-600"
      onClick={() => navigate(`/places/${place.id}/photos`)}
    >
      Gérer les photos
    </button>
    <Link
      to={`/edit-place/${place.id}`}
      className="transform hover:text-purple-500 hover:scale-110 transition duration-300"
    >
      <i className="fa fa-pencil text-xl"></i>
    </Link>
    <button
      onClick={() => confirmDelete(place.id)}
      className="transform hover:text-red-500 hover:scale-110 transition duration-300"
    >
      <i className="fa fa-trash-o text-xl"></i>
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

export default ListePlaces;
