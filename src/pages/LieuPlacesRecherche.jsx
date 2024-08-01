import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LieuPlacesRecherche = () => {
  const [places, setPlaces] = useState([]);
  const [searchRegion, setSearchRegion] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!token) return;

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

  const handleSearch = (event) => {
    setSearchRegion(event.target.value);
  };

  const filteredPlaces = places.filter((place) =>
    place.address.toLowerCase().includes(searchRegion.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-40">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par adresse..."
          value={searchRegion}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full"
        />
      </div>
      {filteredPlaces.length > 0 ? (
        filteredPlaces.map((place) => (
          <div key={place.id} className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm">
            <a href={`/fiche-place/${place.id}`} className="text-blue-500 hover:text-blue-700">
              <img src={`http://127.0.0.1:8000${place.photo}`} alt={place.title} className="w-full h-64 object-cover mb-4" />
              <h2 className="text-xl font-semibold">{place.title}</h2>
              <p className="text-gray-500">Lieu : {place.address}</p>
              <p className="text-gray-700 font-bold">Prix : {place.price} €</p>
            </a>
          </div>
        ))
      ) : (
        <p>Aucune place trouvée pour cette région.</p>
      )}
    </div>
  );
};

export default LieuPlacesRecherche;
