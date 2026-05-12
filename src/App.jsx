import { useState, useCallback } from 'react'
import { Toaster } from 'react-hot-toast'
import Kiosk from './components/Kiosk'
import './App.css'

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2126',
            color: '#f5f5f0',
            border: '1px solid rgba(240,165,0,0.3)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#f0a500', secondary: '#1f2126' } },
          error: { iconTheme: { primary: '#ff4820', secondary: '#1f2126' } },
        }}
      />
      <Kiosk />
    </>
  )
}
