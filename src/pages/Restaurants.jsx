import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';

const Restaurants = () => {
  const location = useLocation();
 
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchTerm] = useState('');
  const [category] = useState(initialCategory);
  const [sortOrder] = useState('');


  // Fetching places
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const url =  `http://127.0.0.1:8000/api/places/category/4`;
 
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        setPlaces(response.data.places || []);
        setFilteredPlaces(response.data.places || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des places', error);
      }
    };

    fetchPlaces();
  }, [category]);


  // Filtering and sorting places
  useEffect(() => {
    let result = places;

    if (searchTerm) {
      result = result.filter(place =>
        place.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder) {
      result = result.sort((a, b) =>
        sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      );
    }

    setFilteredPlaces(result);
  }, [searchTerm, sortOrder, places]);

  // Handling category change
 

  return (
    <div className="container mx-auto px-4 pt-24 mb-36">
    <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-8 text-center animate-slideIn">
      <i className="fas fa-utensils mr-2"></i>Top Restaurants à Lyon
    </h2>
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {filteredPlaces.map(place => (
        <Link key={place.id} to={`/fiche-place/${place.id}`}>
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:-translate-y-2">
            <div 
              className="h-48 bg-cover bg-center" 
              style={{ backgroundImage: `url(http://127.0.0.1:8000${place.photo})` }}
            ></div>
            <div className="p-4">
              <div className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{place.title}</div>
              <div className="text-accent font-bold text-gray-700 dark:text-gray-300">
                <i className="fas fa-credit-card mr-2"></i>{place.price} €
              </div>
            </div>
          </div>
        </Link>
      ))}
    </section>
  </div>
  );
};

export default Restaurants;
