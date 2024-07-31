import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Nav = ({ isAuthenticated, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-300  z-50 bg-opacity-75">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-md"
            src="https://www.info-flash.com/images/info-flash/69/28153/logo/logo-lyon-1671121315.jpeg"
            alt="Logo"
          />
          <span className="text-gray-600 hover:text-gray-800 text-lg font-semibold">
            API Tourisme de Lyon
          </span>
        </Link>

        {/* Hamburger menu button */}
        <div className="block lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-gray-800 focus:outline-none focus:bg-gray-400 px-3 py-2 rounded"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:space-x-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-gray-600 hover:text-gray-800">
                <i className="fas fa-home mr-1"></i>Accueil
              </Link>
            </li>
            <li>
              <Link to="/carte" className="text-gray-600 hover:text-gray-800">
                <i className="fas fa-map-marked-alt mr-1"></i>Carte
              </Link>
            </li>
            <li>
              <Link
                to="/lieux-lyon"
                className="text-gray-600 hover:text-gray-800"
              >
                <i className="fas fa-landmark mr-1"></i>Lieux
              </Link>
            </li>
            <li>
              <Link
                to="/restaurants"
                className="text-gray-600 hover:text-gray-800"
              >
                <i className="fas fa-utensils mr-1"></i>Restaurants
              </Link>
            </li>
            <li>
              <Link to="/musees" className="text-gray-600 hover:text-gray-800">
                <i className="fas fa-palette mr-1"></i>Musées
              </Link>
            </li>
            <li>
              <Link
                to="/evenements"
                className="text-gray-600 hover:text-gray-800"
              >
                <i className="fas fa-calendar-alt mr-1"></i>Événements
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-tachometer-alt mr-1"></i>Tableau de
                    bord
                  </Link>
                </li>

                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      window.location.href = "/";
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-sign-out-alt mr-1"></i>Deconnexion
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-sign-in-alt mr-1"></i>Connexion
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-user-plus mr-1"></i>S&apos;inscrire
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden z-50">
          <div className="flex flex-col mt-2">
            {isAuthenticated ? (
              <>
                <li className="mb-4">
                  <Link to="/" className="text-gray-600 hover:text-gray-800">
                    <i className="fas fa-home mr-1"></i>Accueil
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    to="/carte"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-map-marked-alt mr-1"></i>Carte
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    to="/lieux-lyon"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-landmark mr-1"></i>Lieux
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    to="/restaurants"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-utensils mr-1"></i>Restaurants
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    to="/musees"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-palette mr-1"></i>Musées
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    to="/evenements"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-calendar-alt mr-1"></i>Événements
                  </Link>
                </li>

                <Link to="/dashboard" className="text-gray-600 block py-2 px-4">
                  <i className="fas fa-tachometer-alt mr-1"></i>Tableau de bord
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 block py-2 px-4"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i>Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 block py-2 px-4">
                  Connexion
                </Link>
                <Link to="/register" className="text-gray-600 block py-2 px-4">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

Nav.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};
export default Nav;
