import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import Icon from '@/components/ui/Icons';

// Definition of a single toast entry
export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Provider component that exposes a method for adding toasts to the stack.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = String(Date.now());
    const entry: Toast = { id, ...toast };
    setToasts((prev) => [...prev, entry]);
    const timeout = toast.duration ?? 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, timeout);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastStack toasts={toasts} />
    </ToastContext.Provider>
  );
}

/**
 * Custom hook for accessing the toast context.  Throws an error if used
 * outside of the ToastProvider.
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type ?? 'info'}`}>
          <span className="toast-message">{toast.message}</span>
          {toast.type === 'success' && <Icon name="checkCircle" size={16} />}
          {toast.type === 'error' && <Icon name="alertCircle" size={16} />}
          {toast.type === 'warning' && <Icon name="alertCircle" size={16} />}
          {toast.type === 'info' && <Icon name="info" size={16} />}
        </div>
      ))}
    </div>
  );
}