import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Notification from '../components/Notification';

const AddPhotosPlace = () => {
  const navigate = useNavigate();
  const { id: placeId } = useParams();
  const { token } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  const handlePhotoChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setPhotos(selectedFiles);

    const filePreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPhotoPreviews(filePreviews);
  };

  const handleRemovePhoto = (index) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    const updatedPreviews = photoPreviews.filter((_, i) => i !== index);

    setPhotos(updatedPhotos);
    setPhotoPreviews(updatedPreviews);
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    if (photos.length === 0) {
      Notification.error('Veuillez sélectionner au moins une photo.');
     
      return;
    }

    const formDataToSend = new FormData();

    photos.forEach((photo, index) => {
      formDataToSend.append(`photos[${index}]`, photo);
    });

    try {
      await axios.post(`http://127.0.0.1:8000/api/places/${placeId}/photos`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Notification.success('Photos ajoutées avec succès !');
      setPhotos([]);
      setPhotoPreviews([]);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de l\'upload des photos :', error.response ? error.response.data : error.message);
      Notification.error('Erreur lors de l\'upload des photos');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-72 w-1/2">
      <h2 className="text-2xl font-bold mb-4 text-black">Ajouter un ou plusieurs photos</h2>
      <form onSubmit={handlePhotoSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photos">
            Photos
          </label>
          <span className="block text-red-500 text-md mb-2"><i className="fa fa-info-circle" aria-hidden="true"></i> Vous pouvez sélectionner un ou plusieurs fichiers,<span className="text-sky-500"> Seuls les formats jpeg, png, jpg, gif, svg, webp sont autorisés.</span> </span>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="photos"
            type="file"
            name="photos"
            onChange={handlePhotoChange}
            accept="image/*"
            multiple
          />
        </div>
        <div className="mb-4">
          {photoPreviews.map((preview, index) => (
            <div key={index} className="relative inline-block mr-4">
              <img src={preview} alt={`Prévisualisation ${index + 1}`} className="w-24 h-24 object-cover rounded" />
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Ajouter des photos
        </button>
      </form>
    </div>
  );
};

export default AddPhotosPlace;
