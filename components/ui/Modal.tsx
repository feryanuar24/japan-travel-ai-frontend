"use client"

import React, { useEffect, useRef } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
}

const FOCUSABLE_SELECTORS =
  'a[href], area[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    // save previously focused element
    previouslyFocused.current = document.activeElement as HTMLElement | null

    // prevent background scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const node = modalRef.current
    const focusable = node ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)) : []

    // move focus to first focusable element or the modal container
    if (focusable.length) {
      focusable[0].focus()
    } else if (node) {
      node.focus()
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        if (!node) return
        const elements = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(Boolean)
        if (elements.length === 0) {
          e.preventDefault()
          return
        }
        const first = elements[0]
        const last = elements[elements.length - 1]

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
      // restore focus
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus()
      }
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="relative z-10 w-full max-w-lg rounded-lg bg-surface p-6 shadow-lg"
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-text-secondary">✕</button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export default Modal
