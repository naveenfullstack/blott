import { MdErrorOutline } from 'react-icons/md';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-4"
      role="alert"
      aria-live="assertive"
    >
      <MdErrorOutline className="text-6xl text-red-500 mb-4" aria-hidden="true" />
      <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-400 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
          aria-label="Retry loading news"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
