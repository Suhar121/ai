
import React from 'react';
import { AlertTriangleIcon } from './icons';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg" role="alert">
      <div className="flex">
        <div className="py-1">
          <AlertTriangleIcon className="h-6 w-6 text-red-500 mr-4" />
        </div>
        <div>
          <p className="font-bold text-red-800">An Error Occurred</p>
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
