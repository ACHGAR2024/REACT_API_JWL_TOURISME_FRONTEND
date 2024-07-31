import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import Notification from '../../components/Notification';

const UserProfileUpdate = () => {
  const [userData, setUserData] = useState({ name: '', email: '', password: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const { token } = useContext(AuthContext);
  const user = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (response.data && response.data.data && response.data.data.user) {
          setUserData({
            name: response.data.data.user.name || '',
            email: response.data.data.user.email || '',
            password: '',
            image: null,
          });
        } else {
          console.error('User data not found or incorrect');
          Notification.error('User data not found or incorrect');
        }
      } catch (error) {
        console.error('Error fetching user information', error);
        Notification.error('Error fetching user information');
      }
    };

    fetchUser();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setUserData({ ...userData, image: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      if (userData.password) {
        formData.append('password', userData.password);
      }
      if (userData.image) {
        formData.append('image', userData.image);
      }
      formData.append('_method', 'PUT');

      const userId = String(user.id);

      if (!token) {
        throw new Error('Authentication token not defined');
      }

      console.log("Submitting form with data:", Object.fromEntries(formData.entries()));

      const response = await axios.post(`http://127.0.0.1:8000/api/update/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);

      if (response.status === 200) {
        Notification.success('Compte modifié avec succès !');

        setTimeout(() => {
          navigate('/profil-user-update');
        }, 2000);

        const updatedUser = response.data.user;
        setUserData({
          name: updatedUser.name,
          email: updatedUser.email,
          password: '',
          image: null,
        });
      } else {
        throw new Error('Failed to update user profile');
      }
    } catch (error) {
      console.error('Error updating user profile', error);
      Notification.error('Erreur lors de la mise à jour du profil utilisateur');
    }
  };

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-72 w-1/3">
      <h1 className="text-3xl font-bold mb-8 text-black">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" encType="multipart/form-data">
        <div className="text-right mb-4">
          <img 
            className="r-5 h-10 w-10 rounded-full" 
            src={user.image ? `http://127.0.0.1:8000${user.image}` : `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
            alt={user.name} 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Nom
          </label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Image de Profil
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {imagePreview && <img src={imagePreview} alt="Image preview" className="mt-4" />}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileUpdate;
