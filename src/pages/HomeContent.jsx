import { useEffect, useState } from 'react';
import axios from 'axios';
//import { AuthContext } from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom';
import CartePlaces from './CartePlaces';

const HomeContent = () => {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
//const { isAuthenticated } = useContext(AuthContext); 
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
      <main className="container mx-auto px-8 pt-12">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            <i className="fas fa-map-marked-alt mr-2 text-red-600"></i>
            Carte interactive de Lyon <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-md h-64 border-2 border-blue-300">
            
              <CartePlaces /> 
             
           
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            <i className="fas fa-calendar-alt mr-2 text-orange-600"></i>
            Événements à venir
          </h2>
          <div className="bg-red-100 p-4 rounded-lg shadow-md border-2 border-red-300">
            <h3 className="text-xl font-semibold mb-2 text-red-700">
              <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>
              Festival des Lumières
            </h3>
            <p className="text-red-600"><i className="far fa-calendar mr-2"></i>8-11 Décembre 2024</p>
          </div>
        </section>

        <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">
            <i className="fas fa-compass mr-2 text-green-600"></i>
            Découvrir Lyon
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestPlaces.map(place => (
            <Link key={place.id} to={`/fiche-place/${place.id}`}>
              <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:-translate-y-2">
                <div className="relative h-36 bg-cover bg-center  " style={{ backgroundImage: `url(http://127.0.0.1:8000${place.photo})` }}>
                  <div className="absolute inset-0 bg-black/50 opacity-80 mt-28"></div>
                  <div className="absolute inset-0 flex flex-col items-center p-32 justify-center">
                    <h3 className="text-xs font-semibold text-white">{place.title}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </section>

        <section className="mb-8 mt-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Lieux insolites', icon: 'fa-camera-retro', color: 'bg-purple-100 text-purple-700' },
              { name: 'Restaurants', icon: 'fa-utensils', color: 'bg-yellow-100 text-yellow-700' },
              { name: 'Musées', icon: 'fa-palette', color: 'bg-indigo-100 text-indigo-700' }
            ].map((category) => (
              <div key={category.name} className={`${category.color} p-4 rounded-lg shadow-md transition duration-300 hover:shadow-lg`}>
                <h3 className="text-xl font-semibold mb-2">
                  <i className={`fas ${category.icon} mr-2`}></i>
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </section>

       

        <section>
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            <i className="fas fa-blog mr-2 text-green-600"></i>
            Derniers articles du blog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Les trésors de la Croix-Rousse', icon: 'fa-gem', color: 'bg-pink-100 text-pink-700' },
              { title: 'Guide des bouchons lyonnais', icon: 'fa-wine-bottle', color: 'bg-green-100 text-green-700' }
            ].map((article) => (
              <div key={article.title} className={`${article.color} p-4 rounded-lg shadow-md transition duration-300 hover:shadow-lg`}>
                <h3 className="text-xl font-semibold mb-2">
                  <i className={`fas ${article.icon} mr-2`}></i>
                  {article.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

       

        <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">
            <i className="fas fa-th-large mr-2 text-yellow-600"></i>
            Catégories
          </h2>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="cursor-pointer bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
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
        <section className="mb-8 mt-4">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            <i className="fas fa-calendar-alt mr-2 text-purple-600"></i>
            Agenda des événements
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Prochains événements à Lyon</h3>
            <ul className="list-disc list-inside">
              <li>Festival des Lumières - 8-11 Décembre 2024</li>
              <li>Fête de la Musique - 21 Juin 2024</li>
              <li>Biennale de la Danse - Septembre 2024</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            <i className="fas fa-info-circle mr-2 text-blue-600"></i>
            Informations pratiques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2"><i className="fas fa-subway mr-2 text-red-600"></i>Transports</h3>
              <p>Informations sur les transports en commun à Lyon</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2"><i className="fas fa-parking mr-2 text-blue-600"></i>Parkings</h3>
              <p>Trouver un parking dans le centre-ville</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2"><i className="fas fa-map-signs mr-2 text-green-600"></i>Offices de tourisme</h3>
              <p>Localisations et horaires des offices de tourisme</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            <i className="fas fa-newspaper mr-2 text-indigo-600"></i>
            Actualités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Nouvelle exposition au Musée des Beaux-Arts</h3>
              <p>Découvrez la nouvelle exposition temporaire dédiée à l art moderne...</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Rénovation du Parc de la Tête d Or</h3>
              <p>Le parc emblématique de Lyon fait peau neuve avec de nouveaux aménagements...</p>
            </div>
          </div>
        </section>
      <section className="mb-8"><div className="mt-8 pt-8 border-t border-blue-700 text-center">
            
          </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p>Office de Tourisme de Lyon</p>
              <p>Place Bellecour, 69002 Lyon</p>
              <p>Tél : 04 72 10 30 30</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
              <ul>
                <li><a href="#" className="hover:text-blue-500">Accueil</a></li>
                <li><a href="#" className="hover:text-blue-500">Découvrir Lyon</a></li>
                <li><a href="#" className="hover:text-blue-500">Agenda</a></li>
                <li><a href="#" className="hover:text-blue-500">Informations pratiques</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-500"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="hover:text-blue-500"><i className="fab fa-twitter"></i></a>
                <a href="#" className="hover:text-blue-500"><i className="fab fa-instagram"></i></a>
                <a href="#" className="hover:text-blue-500"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p>Inscrivez-vous pour recevoir nos dernières actualités</p>
              <form className="mt-2">
                <input type="email" placeholder="Votre email" className="w-full p-2 rounded text-gray-800" />
                <button type="submit" className="mt-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300">S inscrire</button>
              </form>
            </div>
          </div>
          
        </div>
      </section>
      </main>

   

     

     

      
    </div>
  );
};

export default HomeContent;
