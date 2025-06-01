'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Déconnexion avec redirection vers la page de login
      await signOut({ 
        redirect: true,
        callbackUrl: '/login'
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
        isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Déconnexion...
        </>
      ) : (
        'Déconnexion'
      )}
    </button>
  );
} 