import React from 'react';
import type { FormState } from '../types';
import { HOTEL_OPTIONS, LOCATION_SUGGESTIONS } from '../constants';
import { PlaneIcon } from './icons';

interface PackageFormProps {
  formState: FormState;
  onFormChange: (newState: Partial<FormState>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const PackageForm: React.FC<PackageFormProps> = ({ formState, onFormChange, onSubmit, isLoading }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFormChange({ [name]: name === 'days' || name === 'travelers' ? parseInt(value, 10) : value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-zinc-700 mb-1">Destination</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formState.location}
            onChange={handleInputChange}
            list="locations"
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
            placeholder="e.g., Paris, France"
            required
          />
          <datalist id="locations">
            {LOCATION_SUGGESTIONS.map(loc => <option key={loc} value={loc} />)}
          </datalist>
        </div>
        <div>
          <label htmlFor="days" className="block text-sm font-medium text-zinc-700 mb-1">Days</label>
          <input
            type="number"
            id="days"
            name="days"
            value={formState.days}
            onChange={handleInputChange}
            min="1"
            max="30"
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="travelers" className="block text-sm font-medium text-zinc-700 mb-1">Travelers</label>
          <input
            type="number"
            id="travelers"
            name="travelers"
            value={formState.travelers}
            onChange={handleInputChange}
            min="1"
            max="20"
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="hotel" className="block text-sm font-medium text-zinc-700 mb-1">Hotel Preference</label>
          <select
            id="hotel"
            name="hotel"
            value={formState.hotel}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
          >
            {HOTEL_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Generating...' : 'Generate Package'}
          {!isLoading && <PlaneIcon className="w-5 h-5" />}
        </button>
      </div>
    </form>
  );
};

export default PackageForm;