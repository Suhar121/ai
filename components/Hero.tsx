import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
      <img 
        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
        alt="Scenic travel background of mountains and a lake" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 flex flex-col justify-end p-8 md:p-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Craft Your Perfect Getaway
        </h2>
        <p className="mt-2 text-lg md:text-xl text-white/90 max-w-2xl">
          Tell us your dream destination, and our AI will build a personalized itinerary just for you.
        </p>
      </div>
    </div>
  );
};