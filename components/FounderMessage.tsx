import React from 'react';
import { UserIcon } from './icons';

const FounderMessage: React.FC = () => {
  return (
    <section className="mt-16 py-12 bg-white rounded-2xl shadow-lg">
      <div className="container mx-auto px-6 md:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-center text-zinc-900">
          A Message From Our Founders
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-center text-lg text-zinc-600">
          Our passion for travel is the foundation of everything we do.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-stone-100 text-teal-600">
                <UserIcon className="h-10 w-10" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-zinc-900">Faseeh Khan</h3>
              <p className="text-md font-medium text-teal-600">Founder</p>
              <blockquote className="mt-4 text-zinc-600 italic border-l-4 border-stone-200 pl-4">
                "Travel is more than seeing new places; it's about discovering a new version of yourself. We built Wildfloc to be the spark for your next great discovery. Adventure is out there—go find it."
              </blockquote>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
             <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-stone-100 text-teal-600">
                <UserIcon className="h-10 w-10" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-zinc-900">Hummayoun Dhar</h3>
              <p className="text-md font-medium text-teal-600">Co-Founder</p>
              <blockquote className="mt-4 text-zinc-600 italic border-l-4 border-stone-200 pl-4">
                "Our mission is to make extraordinary travel accessible and seamless. By blending technology with a passion for exploration, we handle the details so you can immerse yourself in the journey. Your story is waiting to be written."
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderMessage;