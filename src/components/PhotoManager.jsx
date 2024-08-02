import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import Notiflix from "notiflix";

const PhotoManager = () => {
  const { id } = useParams(); // Récupère l'ID de la place à partir des paramètres de l'URL
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/places/${id}/photos`
        );
        setPhotos(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération des photos");
      }
    };

    fetchPhotos();
  }, [id]);

  const handleDelete = async (photoId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/places/${id}/photos/${photoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPhotos(photos.filter((photo) => photo.id !== photoId));
      Notiflix.Notify.success("Photo supprimée avec succès !");
      navigate(`/dashboard`);
    } catch (error) {
      console.error("Erreur lors de la suppression de la photo", error);
      Notiflix.Notify.failure("Erreur lors de la suppression de la photo");
    }
  };

  const confirmDeletePhoto = (photoId) => {
    Notiflix.Confirm.show(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer cette photo ?",
      "Oui",
      "Non",
      () => handleDelete(photoId),
      null,
      {
        width: "320px",
        borderRadius: "8px",
        titleColor: "#e74c3c",
        okButtonBackground: "#e74c3c",
        cssAnimationStyle: "zoom",
      }
    );
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-28">
      <h1 className="text-2xl font-bold mb-4">
        Gestion des Photos pour la place {id}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative">
            <img
              className="w-full h-64 object-cover rounded-lg"
              src={`http://127.0.0.1:8000${photo.photo_path}`}
              alt={`Photo ${photo.id}`}
            />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-700"
              onClick={() => confirmDeletePhoto(photo.id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoManager;
