interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

const ErrorView = ({ message, onRetry }: ErrorViewProps) => {
  return (
    <div className="glass-card border-coral/50 p-4 text-sm text-ink">
      <p className="font-semibold text-coral">Something went wrong</p>
      <p className="mt-1">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-xl bg-coral px-3 py-2 text-xs font-semibold text-white"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
};

export default ErrorView;
