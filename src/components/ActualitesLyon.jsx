import { useEffect, useState } from 'react';
import axios from 'axios';

const ActualitesLyon = () => {
    const [articles, setArticles] = useState([]);
    const [transportData, setTransportData] = useState([]);
    const [parkingData, setParkingData] = useState([]);
    const [tourismData, setTourismData] = useState([]);
  
    useEffect(() => {
      // Récupération des actualités
      axios.get('https://newsapi.org/v2/everything?q=lyon&apiKey=d58ed5edfaf645dd8706843e6f253cf4')
        .then(response => {
          const filteredArticles = response.data.articles.filter(article => 
            article.title && article.description && article.source &&
            article.description.toLowerCase().includes('lyon') && 
            article.source.name.toLowerCase() === 'le monde'
          );
          setArticles(filteredArticles.slice(0, 4));
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des actualités:', error);
        });
  
      // Récupération des données de transport
      axios.get('https://data.grandlyon.com/jeux-de-donnees/reseau-transport-commun-lyonnais-v2/info')
        .then(response => {
          setTransportData(response.data);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données de transport:', error);
        });
  
      // Récupération des données de parking (exemple d'API)
      axios.get('https://api.example.com/parkings')
        .then(response => {
          setParkingData(response.data);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données de parking:', error);
        });
  
      // Récupération des données des offices de tourisme (exemple d'API)
      axios.get('https://api.example.com/tourisme')
        .then(response => {
          setTourismData(response.data);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données des offices de tourisme:', error);
        });
    }, []);
  
    return (
      <div className="container mx-auto px-4">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            <i className="fas fa-newspaper mr-2 text-indigo-600"></i>
            Actualités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                {article.urlToImage && <img src={article.urlToImage} alt={article.title} className="h-36 mb-4 w-full object-cover rounded" />}
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p>{article.description}</p>
              </div>
            ))}
          </div>
        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            <i className="fas fa-info-circle mr-2 text-blue-600"></i>
            Informations pratiques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <a href="https://www.844.fr/public-transport/horaires-theoriques-du-reseau-transports-en-commun-lyonnais-tcl-sytral">
              <h3 className="text-xl font-semibold mb-2">
                <i className="fas fa-subway mr-2 text-red-600"></i>Transports
              </h3>
              <p>Informations sur les transports en commun à Lyon</p>
              <ul>
                {transportData.map((item, index) => (
                  <li key={index} className="mt-2">
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <a href="https://www.t-libr.fr/carte-interactive-t-libr/">
              <h3 className="text-xl font-semibold mb-2">
                <i className="fas fa-parking mr-2 text-blue-600"></i>Parkings
              </h3>
              <p>Trouver un parking dans le centre-ville</p>
              <ul>
                {parkingData.map((item, index) => (
                  <li key={index} className="mt-2">
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <a href="https://www.google.com/maps/place/Office+du+Tourisme+et+des+Congr%C3%A8s+de+la+M%C3%A9tropole+de+Lyon/@45.7574485,4.8322726,18.3z/data=!4m6!3m5!1s0x47f4ea52524c379d:0xf9d5cec9fb0755fe!8m2!3d45.7570797!4d4.8330122!16s%2Fg%2F1thgjbz7?entry=ttu" >
              <h3 className="text-xl font-semibold mb-2">
                <i className="fas fa-map-signs mr-2 text-green-600"></i>Offices de tourisme
              </h3>
              <p>Localisations et horaires des offices de tourisme</p>
              <ul>
                {tourismData.map((item, index) => (
                  <li key={index} className="mt-2">
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p>{item.description}</p>
                    <p><strong>Horaires:</strong> {item.hours}</p>
                    <p><strong>Adresse:</strong> {item.address}</p>
                  </li>
                ))}
              </ul>
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  };
  
  export default ActualitesLyon;
