import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { getCityCoordinates } from '../utils/geocode'; // Assurez-vous que le chemin d'importation est correct

const MaCarte = () => {
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
                };
              }
            } catch (error) {
              console.error(`Erreur pour ${lieu.address}: ${error.message}`);
              // Utilisez les coordonnées directement si elles sont disponibles
              if (lieu.latitude && lieu.longitude) {
                return {
                  position: [lieu.latitude, lieu.longitude],
                  popup: `${lieu.title} - ${lieu.price}€`,
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

  // Filtrer les lieux en fonction du terme de recherche
  const marqueursFiltres = marqueurs.filter(marqueur =>
    marqueur.popup.toLowerCase().includes(termeRecherche.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <input
        type="text"
        placeholder="Rechercher..."
        value={termeRecherche}
        onChange={(e) => setTermeRecherche(e.target.value)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          zIndex: 1000
        }}
      />
      <MapContainer center={[48.8566, 2.3522]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {marqueursFiltres.map((marqueur, index) => (
          <Marker key={index} position={marqueur.position}>
            <Popup>{marqueur.popup}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MaCarte;
