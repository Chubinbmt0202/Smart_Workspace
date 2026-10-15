import React, { useEffect } from 'react';
import { AlertCircle, Check, X } from 'lucide-react';

export interface SuccessToastProps {
  message: string;
  variant?: 'success' | 'error';
  onDismiss: () => void;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  message,
  variant = 'success',
  onDismiss
}) => {
  useEffect(() => {
    const timeoutId = window.setTimeout(onDismiss, variant === 'error' ? 6000 : 3500);
    return () => window.clearTimeout(timeoutId);
  }, [message, onDismiss, variant]);

  return (
    <div
      className={`success-toast ${variant === 'error' ? 'error' : ''}`}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <span className="success-toast-icon">
        {variant === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
      </span>
      <span className="success-toast-message">{message}</span>
      <button
        type="button"
        className="success-toast-dismiss"
        onClick={onDismiss}
        aria-label="Đóng thông báo"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default SuccessToast;
