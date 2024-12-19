import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { signInWithGoogle, signInDevMode, isDevMode } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  const handleDevLogin = () => {
    signInDevMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#1a1f2b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenue sur EasyPlan</h1>
          <p className="text-gray-400">Planifiez vos événements simplement</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="w-5 h-5"
            />
            <span className="font-medium">Continuer avec Google</span>
          </button>

          {isDevMode && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#1a1f2b] text-gray-500">Mode développement</span>
                </div>
              </div>

              <button
                onClick={handleDevLogin}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
              >
                <LogIn className="h-5 w-5" />
                <span>Continuer sans connexion</span>
              </button>
            </>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          En continuant, vous acceptez nos{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300">
            Conditions d'utilisation
          </a>
          {' '}et notre{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300">
            Politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  );
}