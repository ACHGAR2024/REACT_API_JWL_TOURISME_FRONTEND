import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const RechercherPlace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetching places
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const url = category
          ? `http://127.0.0.1:8000/api/places/category/${category}`
          : 'http://127.0.0.1:8000/api/places';
        
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

  // Fetching categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categories', {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories', error);
      }
    };

    fetchCategories();
  }, []);

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
  const handleCategoryClick = (cat) => {
    setCategory(cat);
    navigate(`?category=${cat}`);
  };

  return (
    <div className="container mx-auto px-4 pt-24 mb-36">
      <div className="flex-col md:flex-row justify-between my-4 hidden md:block">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded mb-4 md:mb-0 mr-2"
        />
        <select
          value={category}
          onChange={(e) => handleCategoryClick(e.target.value)}
          className="p-2 border rounded mb-4 md:mb-0 mr-2"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name_cat}</option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded mr-2"
        >
          <option value="">Trier par</option>
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix décroissant</option>
        </select>
        <a href="/carte-places">
          <button className="bg-slate-400 hover:bg-slate-800 text-white p-2 rounded">
            Rechercher par carte
          </button>
        </a>
        <a href="/lieux-places">
          <button className="bg-slate-400 hover:bg-slate-800 text-white p-2 rounded m-2">
            Rechercher par lieu
          </button>
        </a>
      </div>
     
      <section className="py-15 mb-5 animate-slideIn mt-3">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer ${category === cat.id ? 'bg-gray-200' : ''}`}
              >
                
                <i className={`fa fa-${
                    cat.name_cat === 'Monuments' ? 'monument' :
                    cat.name_cat === 'Parcs' ? 'tree' :
                    cat.name_cat === 'Musées' ? 'palette' :
                    cat.name_cat === 'Restaurants' ? 'utensils' :
                    cat.name_cat === 'Shopping' ? 'shopping-bag' :
                    cat.name_cat === 'Événements' ? 'calendar-alt' :
                    'landmark'
                  } 
                  ${
                    cat.name_cat === 'Monuments' ? 'text-red-600' :
                    cat.name_cat === 'Parcs' ? 'text-orange-300' :
                    cat.name_cat === 'Musées' ? 'text-yellow-900' :
                    cat.name_cat === 'Restaurants' ? 'text-yellow-600' :
                    cat.name_cat === 'Shopping' ? 'text-lime-600' :
                    cat.name_cat === 'Événements' ? 'text-pink-300' :
                    'landmark'
                  } 
                  
                  mb-4 text-red-600 text-3xl`}></i>
                <h3 className="font-semibold">{cat.name_cat}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredPlaces.map(place => (
          <Link key={place.id} to={`/fiche-place/${place.id}`}>
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:-translate-y-2">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(http://127.0.0.1:8000${place.photo})` }}></div>
              <div className="p-4">
                <div className="font-semibold mb-2">{place.title}</div>
                <div className="text-accent font-bold">{place.price} €</div>
              </div>
            </div>
          </Link>
        ))}
      </section>
      
    </div>
  );
};

export default RechercherPlace;
