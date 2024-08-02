import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Notification from "./Notification"; // Ensure this path is correct
import { AuthContext } from "../context/AuthContext";

const DeletePlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    const deletePlace = async () => {
      try {
        // Delete all photos associated with the place
        await axios.delete(`http://127.0.0.1:8000/api/places/${id}/photos`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        // Delete the place itself
        await axios.delete(`http://127.0.0.1:8000/api/places/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        Notification.success("Place and all its photos deleted successfully!");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error deleting the place:", error.response);
        setError("Error deleting the place. Please try again.");
      }
    };

    deletePlace();
  }, [id, navigate, token]);

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-72">
      <h1 className="text-3xl font-bold mb-8 text-black">Delete Place</h1>
      <p>
        Are you sure you want to delete this place? This action is irreversible.
      </p>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default DeletePlace;
