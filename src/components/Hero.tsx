import React from 'react';
import { Calendar, Users, Clock, Check } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Planifiez vos moments</span>
                <span className="block text-purple-600">en toute simplicité</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                Synchronisez vos agendas, trouvez le moment parfait, et créez des souvenirs inoubliables avec vos amis.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                <div className="rounded-md shadow">
                  <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10">
                    Commencer
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Calendar className="h-8 w-8 text-purple-500" />}
            title="Synchronisation Calendrier"
            description="Intégration avec Google Calendar et iCloud pour une gestion simplifiée"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-purple-500" />}
            title="Gestion des Invités"
            description="Invitez et gérez facilement vos participants"
          />
          <FeatureCard
            icon={<Clock className="h-8 w-8 text-purple-500" />}
            title="Créneaux Flexibles"
            description="Trouvez le moment idéal pour tout le monde"
          />
          <FeatureCard
            icon={<Check className="h-8 w-8 text-purple-500" />}
            title="Validation Automatique"
            description="Confirmation instantanée dès que tout le monde est disponible"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}