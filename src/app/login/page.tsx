'use client';

import { signIn } from "next-auth/react";
import { useSearchParams } from 'next/navigation';
import Image from "next/image";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/calendar' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Clean Home
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous pour gérer vos tâches ménagères
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erreur de connexion
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error === 'OAuthSignin' && 'Un problème est survenu lors de la connexion avec Google. Veuillez réessayer.'}
                  {error === 'OAuthCallback' && 'Un problème est survenu lors de la validation de votre connexion.'}
                  {error === 'OAuthCreateAccount' && 'Impossible de créer un compte avec Google.'}
                  {error === 'EmailSignin' && 'Une erreur est survenue avec votre email.'}
                  {error === 'Callback' && 'Un problème est survenu lors de la connexion.'}
                  {error === 'OAuthAccountNotLinked' && 'Ce compte est déjà lié à une autre méthode de connexion.'}
                  {error === 'default' && 'Une erreur inattendue est survenue.'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <button
            onClick={handleGoogleSignIn}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
            </span>
            Se connecter avec Google
          </button>
        </div>
      </div>
    </div>
  );
} 