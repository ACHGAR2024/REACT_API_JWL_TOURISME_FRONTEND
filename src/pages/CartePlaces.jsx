import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { getCityCoordinates } from '../utils/geocode'; // Assurez-vous que le chemin d'importation est correct

const CartePlaces = () => {
  const [termeRecherche, setTermeRecherche] = useState('');
  const [marqueurs, setMarqueurs] = useState([]);

  useEffect(() => {
    const fetchLieux = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/places');
        const lieuxData = response.data.places || [];

        // Obtenez les coordonnées pour chaque lieu et mettez à jour les marqueurs
        const marqueursAvecCoordonnees = await Promise.all(
          lieuxData.map(async (lieu) => {
            try {
              if (lieu.address) {
                const { lat, lon } = await getCityCoordinates(lieu.address);
                return {
                  position: [lat, lon],
                  popup: `${lieu.title} - ${lieu.price}€`,
                  photo: lieu.photo,
                  address: lieu.address,
                  id: lieu.id,
                  title: lieu.title,
                  type: lieu.type 
                };
              }
            } catch (error) {
              console.error(`Erreur pour ${lieu.address}: ${error.message}`);
              // Utilisez les coordonnées directement si elles sont disponibles
              if (lieu.latitude && lieu.longitude) {
                return {
                  position: [lieu.latitude, lieu.longitude],
                  popup: `${lieu.title} - ${lieu.price}€`,
                  photo: lieu.photo,
                  address: lieu.address,
                  id: lieu.id,
                  title: lieu.title,
                  type: lieu.type // Assuming type is available in lieu
                };
              } else {
                return null;
              }
            }
          })
        );

        // Filtrez les marqueurs non trouvés (null) et mettez à jour l'état
        setMarqueurs(marqueursAvecCoordonnees.filter(marqueur => marqueur !== null));
      } catch (error) {
        console.error('Erreur lors de la récupération des lieux', error);
      }
    };

    fetchLieux();
  }, []);

  // Définir customIcon en dehors de la fonction MaCarte
  const customIcon = (type) => new L.divIcon({
    html: `<i class="fas fa-${type} text-2xl text-${
      ["red", "gray", "yellow", "green", "bleu", "indigo"][
        Math.floor(Math.random() * 6)
      ]
    }-700 dark:text-${
      ["red", "gray", "red", "green", "bleu", "indigo"][
        Math.floor(Math.random() * 6)
      ]
    }-700"></i>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [10, 5]
  });

  // Filtrer les lieux en fonction du terme de recherche
  const marqueursFiltres = marqueurs.filter(marqueur =>
    marqueur.popup.toLowerCase().includes(termeRecherche.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }} className="z-0">
    <input
      type="text"
      placeholder="Rechercher... "
      value={termeRecherche}
      onChange={(e) => setTermeRecherche(e.target.value)}
      className="absolute top-2 left-1/2 transform -translate-x-1/2 p-2 pl-4 opacity-80 rounded border  z-50
        bg-white dark:bg-gray-800 text-black dark:text-white border-black dark:border-white"
      style={{
        zIndex: 1000,
      }}
    />
    <MapContainer center={[45.75883000, 4.8322000]} zoom={14} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {marqueursFiltres.length > 0 ? (
        marqueursFiltres.map((marqueur, index) => (
          <Marker key={index} position={marqueur.position} icon={customIcon(marqueur.type)}>
            <Popup className="p-2">
              <div className="text-center">
                <a href={`/fiche-place/${marqueur.id}`} className="text-md font-bold">
                  {marqueur.title}
                  <br />
                  <div className="flex items-center justify-center mt-3">
                    <img
                      className="h-10 object-cover rounded-lg animate-fadeIn"
                      src={`http://127.0.0.1:8000${marqueur.photo}`}
                      alt={marqueur.title}
                    />
                  </div>
                  <p className="mt-2 text-md font-semibold">
                    <i className="fas fa-map-marker-alt text-red-800 dark:text-red-400"></i> {marqueur.address}
                  </p>
                </a>
              </div>
            </Popup>
          </Marker>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </MapContainer>
  </div>
  );
};

export default CartePlaces;
