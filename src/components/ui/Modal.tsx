import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

/** Diálogo modal sobre <dialog>: el navegador gestiona el foco y la tecla Escape. */
export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      {isOpen && (
        <div className="modal__content">
          <header className="modal__header">
            <h2 id={titleId} className="modal__title">
              {title}
            </h2>
            <Button variant="ghost" onClick={onClose} aria-label="Cerrar">
              ✕
            </Button>
          </header>
          <div className="modal__body">{children}</div>
          {footer && <footer className="modal__footer">{footer}</footer>}
        </div>
      )}
    </dialog>
  )
}
