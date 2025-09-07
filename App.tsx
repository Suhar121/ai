import React, { useState, useCallback } from 'react';
import type { FormState, TourPackage } from './types';
import { generateTourPackage, generateImageForPrompt } from './services/geminiService';
import Header from './components/Header';
import PackageForm from './components/PackageForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { Hero } from './components/Hero';
import FounderMessage from './components/FounderMessage';

const App: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    location: 'Paris, France',
    days: 7,
    travelers: 2,
    hotel: '4-star',
  });
  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleFormChange = useCallback((newFormState: Partial<FormState>) => {
    setFormState(prevState => ({ ...prevState, ...newFormState }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setTourPackage(null);
    setLoadingMessage('Crafting Your Itinerary...');

    try {
      // Step 1: Generate the text-based tour package
      const textPackage = await generateTourPackage(formState);
      setTourPackage(textPackage); // Show text content to user immediately

      // Step 2: Generate images for each itinerary day
      setLoadingMessage('Generating breathtaking visuals...');

      const imagePromises = textPackage.itinerary.map(day => 
        generateImageForPrompt(`${day.title}, ${textPackage.location}`)
      );
      
      const imageUrls = await Promise.all(imagePromises);

      // Step 3: Combine text package with generated image URLs
      const packageWithImages = {
        ...textPackage,
        itinerary: textPackage.itinerary.map((day, index) => ({
          ...day,
          imageUrl: imageUrls[index],
        })),
      };

      setTourPackage(packageWithImages);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
      setTourPackage(null); // Clear partial results on error
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [formState]);

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 -mt-16 relative z-10">
          <PackageForm
            formState={formState}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
        
        <div className="mt-12">
          {isLoading && <LoadingSpinner message={loadingMessage} />}
          {error && <ErrorMessage message={error} />}
          {tourPackage && <ItineraryDisplay tourPackage={tourPackage} />}
        </div>

        <FounderMessage />
        
      </main>
      <footer className="text-center py-6 text-zinc-500 text-sm">
        <p>Made By Suhar Yaseen for Wildfloc Adventures. Your next adventure awaits.</p>
      </footer>
    </div>
  );
};

export default App;