import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom';

const HomeContent = () => {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const { isAuthenticated } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/rechercher-place?category=${category}`);
  };

  // Fetching places
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/places', {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        //console.log('Places:', response.data);
        setPlaces(response.data.places || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des places', error);
      }
    };

    fetchPlaces();
  }, []);

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

  // Get the last 4 places
  const latestPlaces = places.slice(0, 4);

  return (
    <div className="left-0 right-0 w-full h-full pt-5 mb-20">
      <section className="bg-cover bg-bottom h-96 flex items-center justify-center text-white" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556745757-8d76bdb6984b")' }}>
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Trouvez ce que vous cherchez</h1>
          <p className="text-xl mb-8">Des milliers places à portée de clic</p>
          {isAuthenticated ? (
            <a href="/deposer_place" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Publier une place
            </a>
          ) : (
            <a href="/login" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Publier une place
            </a>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestPlaces.map(place => (
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
        </div>
      </section>

      <section className="py-15 mb-10 animate-slideIn">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="cursor-pointer bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <i className={`fa fa-${cat.name_cat === 'sit' ? 'home' : 
                                      cat.name_cat === 'nihil_modif' ? 'list' : 
                                      cat.name_cat === 'laborum' ? 'briefcase' : 
                                      cat.name_cat === 'mollitia' ? 'shopping-cart' : 
                                      cat.name_cat === 'soluta' ? 'user' :
                                      cat.name_cat === 'distinctio' ? 'users' :
                                      cat.name_cat === 'voluptate' ? 'book' :
                                      cat.name_cat === 'dolores' ? 'graduation-cap' :
                                      cat.name_cat === 'aliquid' ? 'user-plus' :
                                      cat.name_cat === 'voluptas' ? 'user-secret' :
                                      cat.name_cat === 'debitis' ? 'cog' :
                                       'laptop'} mb-4 text-accent text-3xl`}></i>
                <h3 className="font-semibold">{cat.name_cat}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform duration-500 hover:transform hover:-translate-y-3">
            <a href={isAuthenticated ? "/deposer_place" : "/login"}>
              <div className="text-5xl text-accent mb-4">📝</div>
              <h3 className="text-xl font-semibold text-primary mb-2">Publication facile</h3>
              <p>Déposez votre place en quelques clics</p>
            </a>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform duration-500 hover:transform hover:-translate-y-3">
            <a href="/rechercher-place?category=">
              <div className="text-5xl text-accent mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-primary mb-2">Recherche avancée</h3>
              <p>Trouvez exactement ce que vous cherchez</p>
            </a>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform duration-500 hover:transform hover:-translate-y-3">
            <div className="text-5xl text-accent mb-4">💬</div>
            <h3 className="text-xl font-semibold text-primary mb-2">Contact direct</h3>
            <p>Communiquez facilement avec les vendeurs</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform duration-500 hover:transform hover:-translate-y-3">
            <div className="text-5xl text-accent mb-4">🛡️</div>
            <h3 className="text-xl font-semibold text-primary mb-2">Sécurité assurée</h3>
            <p>Transactions sécurisées et vérifiées</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;
