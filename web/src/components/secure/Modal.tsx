import React, { type ReactNode } from 'react';

export interface ModalProps {
  /** Controls whether the modal is visible */
  isOpen: boolean;
  /** Called when the user clicks outside the modal or presses Escape */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Content of the modal */
  children?: ReactNode;
}

/**
 * A simple modal/dialog component.  For demonstration purposes it uses
 * minimal markup and inline event handling.  In a production app you
 * may want to handle focus trapping and keyboard accessibility more
 * thoroughly.
 */
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>
      </div>
    </div>
  );
}