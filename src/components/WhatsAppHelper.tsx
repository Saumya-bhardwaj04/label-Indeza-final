'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

export default function WhatsAppHelper() {
  const [isOpen, setIsOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  // Replace this with the EXACT number the client provided (include country code, no + or spaces)
  const WHATSAPP_NUMBER = '917982528707' 

  // Close popup if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="whatsapp-helper-container" ref={popupRef}>
      {/* Popup */}
      <div className={`whatsapp-popup ${isOpen ? 'open' : ''}`}>
        <div className="whatsapp-popup-header">
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Label Indeza Support</h4>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>Typically replies in minutes</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="whatsapp-close-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        
        <div className="whatsapp-popup-body">
          <div className="whatsapp-chat-bubble">
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: '#333' }}>
              Hi there! ✨<br />
              Do you have any questions about our designs, sizing, or your order? We're here to help!
            </p>
            <span style={{ display: 'block', fontSize: '10px', color: '#999', marginTop: '6px', textAlign: 'right' }}>
              Just now
            </span>
          </div>
        </div>

        <div className="whatsapp-popup-footer">
          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Label%20Indeza!%20I%20need%20some%20help.`}
            target="_blank" 
            rel="noopener noreferrer"
            className="whatsapp-start-btn"
            onClick={() => setIsOpen(false)}
          >
            <Send size={16} />
            Start Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Helper Button */}
      <button 
        className={`whatsapp-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with us"
      >
        <div className="whatsapp-icon-wrapper">
          {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
        </div>
      </button>
    </div>
  )
}
