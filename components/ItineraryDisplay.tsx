import React, { useRef, useState } from 'react';
import type { TourPackage } from '../types';
import { CalendarIcon, HotelIcon, MoneyIcon, StarIcon, CheckCircleIcon, DownloadIcon, ChevronDownIcon, ExternalLinkIcon } from './icons';

// Declare global libraries loaded via CDN in index.html
declare const jspdf: any;
declare const html2canvas: any;

interface ItineraryDisplayProps {
  tourPackage: TourPackage;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ tourPackage }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // State for accordion, default day 1 open
  const itineraryRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const handleToggleDay = (day: number) => {
    setExpandedDay(current => (current === day ? null : day));
  };

  const handleDownloadPdf = async () => {
    const elementToCapture = itineraryRef.current;
    if (!elementToCapture) {
      console.error("Itinerary element not found");
      return;
    }

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(elementToCapture, {
        scale: 2, // Higher scale for better resolution
        backgroundColor: '#f5f5f4', // Match the body bg-stone-50 color
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${tourPackage.packageName.replace(/\s+/g, '-')}-itinerary.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-300 text-sm font-medium rounded-lg shadow-sm text-zinc-700 bg-white hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed transition"
        >
          {isDownloading ? (
            'Generating...'
          ) : (
            <>
              <DownloadIcon className="w-4 h-4" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>

      <div ref={itineraryRef} className="space-y-12 p-1">
        <header className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">{tourPackage.packageName}</h2>
          <p className="mt-4 text-xl text-zinc-600">{tourPackage.overallDescription}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-800 border-b pb-2">Daily Itinerary</h3>
            <div className="space-y-4">
              {tourPackage.itinerary.map(item => {
                const isExpanded = expandedDay === item.day;
                return (
                  <div key={item.day} className="border border-zinc-200 rounded-lg overflow-hidden transition-all duration-300">
                    <button
                      onClick={() => handleToggleDay(item.day)}
                      className="w-full flex justify-between items-center p-4 bg-stone-100 hover:bg-stone-200/70 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                      aria-expanded={isExpanded}
                      aria-controls={`day-${item.day}-content`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-teal-100 rounded-full">
                          <CalendarIcon className="w-5 h-5 text-teal-600" />
                        </span>
                        <h4 className="text-lg font-semibold text-zinc-900 text-left">Day {item.day}: {item.title}</h4>
                      </div>
                      <ChevronDownIcon 
                        className={`w-6 h-6 text-zinc-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    <div
                      id={`day-${item.day}-content`}
                      className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <div className="overflow-hidden">
                        <div className="bg-white p-5 border-t border-zinc-200">
                          
                          {item.imageUrl && item.imageUrl !== 'placeholder.png' ? (
                            <img 
                              src={item.imageUrl} 
                              alt={`Visual for ${item.title}`}
                              className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                          ) : (
                            <div className="w-full h-48 rounded-lg mb-4 skeleton-loader"></div>
                          )}
      
                          <ul className="list-none space-y-2">
                            {item.activities.map((activity, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-zinc-600">{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-zinc-100">
              <h3 className="text-2xl font-bold tracking-tight text-zinc-800 flex items-center gap-2"><MoneyIcon className="w-6 h-6" /> Pricing</h3>
              <div className="mt-4 text-center bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm text-teal-700">Total Estimated Price</p>
                  <p className="text-4xl font-extrabold text-teal-900">{formatCurrency(tourPackage.totalPrice, tourPackage.currency)}</p>
              </div>
              <ul className="mt-6 space-y-3">
                {tourPackage.priceBreakdown.map(item => (
                  <li key={item.item} className="flex justify-between items-start text-sm p-3 bg-stone-100 rounded-md">
                    <div>
                      <p className="font-semibold text-zinc-800">{item.item}</p>
                      <p className="text-xs text-zinc-500">{item.description}</p>
                    </div>
                    <p className="font-medium text-zinc-900">{formatCurrency(item.cost, tourPackage.currency)}</p>
                  </li>
                ))}
              </ul>
              <a
                href="https://www.wildfloc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
              >
                Book Now
                <ExternalLinkIcon className="w-5 h-5" />
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border border-zinc-100">
               <h3 className="text-2xl font-bold tracking-tight text-zinc-800 flex items-center gap-2"><HotelIcon className="w-6 h-6" /> Suggested Hotel</h3>
               <div className="mt-4">
                  <h4 className="font-semibold text-lg text-zinc-900">{tourPackage.suggestedHotel.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-amber-500 my-1">
                      <StarIcon className="w-5 h-5"/>
                      <span className="font-bold">{tourPackage.suggestedHotel.rating}</span>
                  </div>
                  <p className="text-sm text-zinc-600 mt-2">{tourPackage.suggestedHotel.description}</p>
                  <p className="text-sm font-semibold text-zinc-800 mt-3">{formatCurrency(tourPackage.suggestedHotel.estimatedPricePerNight, tourPackage.currency)} / night (est.)</p>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;