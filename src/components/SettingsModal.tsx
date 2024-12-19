import React, { useState } from 'react';
import { X, LogOut, UserX, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Une erreur est survenue lors de la déconnexion.');
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteAccount();
      navigate('/login');
    } catch (error) {
      setError('Une erreur est survenue lors de la suppression du compte.');
      console.error('Error deleting account:', error);
      setShowDeleteConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800/90 backdrop-blur border border-white/10 rounded-xl w-full max-w-md shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Paramètres</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={user?.photoURL || 'https://ui-avatars.com/api/?name=User&background=random'}
              alt={user?.displayName || 'User'}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-white font-medium">{user?.displayName}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                ) : (
                  <LogOut className="h-5 w-5 mr-3" />
                )}
                Se déconnecter
              </span>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isLoading}
              className="w-full flex items-center justify-between px-4 py-3 bg-red-500/10 text-red-300 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center">
                <UserX className="h-5 w-5 mr-3" />
                Supprimer le compte
              </span>
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/90 backdrop-blur border border-white/10 rounded-xl w-full max-w-md shadow-xl p-6">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-semibold text-white text-center mb-2">
              Supprimer le compte ?
            </h3>
            <p className="text-gray-400 text-center mb-6">
              Cette action est irréversible. Les éléments suivants seront supprimés :
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Votre compte et profil</li>
                <li>Tous vos événements créés</li>
                <li>Vos votes sur les événements</li>
                <li>Vos préférences personnelles</li>
                <li>L'accès à votre calendrier Google</li>
              </ul>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}