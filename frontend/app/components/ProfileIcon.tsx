import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useAuth } from '~/contexts/AuthContext';

const ProfileIcon: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleIconClick = () => {
    if (!isAuthenticated) {
      navigate('/profile');
    }
  };

  return (
    <div className="relative">
      {isAuthenticated ? (
        <Menu as="div" className="relative">
          <MenuButton className="focus:outline-none">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white cursor-pointer"
            >
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
              <path
                d="M4 20C4 16.6863 7.13401 14 11 14H13C16.866 14 20 16.6863 20 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </MenuButton>
          <MenuItems
            className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-300 data-[closed]:opacity-0 data-[closed]:scale-95"
            anchor="bottom"
          >
            <div className="px-1 py-1">
              <MenuItem as={Fragment}>
                {({ active }) => (
                  <Link
                    to="/settings"
                    className={`${
                      active ? 'bg-gray-700 text-white' : 'text-gray-300'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    User Settings
                  </Link>
                )}
              </MenuItem>
              <MenuItem as={Fragment}>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={`${
                      active ? 'bg-gray-700 text-white' : 'text-gray-300'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Sign Out
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      ) : (
        <div onClick={handleIconClick}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white cursor-pointer"
          >
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
            <path
              d="M4 20C4 16.6863 7.13401 14 11 14H13C16.866 14 20 16.6863 20 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
