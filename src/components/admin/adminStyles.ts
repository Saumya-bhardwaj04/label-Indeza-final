import type { CSSProperties } from 'react'

export const cardStyle: CSSProperties = {
  background: 'white',
  borderRadius: 12,
  padding: 24,
  border: '1px solid rgba(0,0,0,0.08)',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

export const inputBoxStyle: CSSProperties = {
  border: '1px solid #E0E0E0',
  borderRadius: 10,
  padding: '10px 16px',
}

export const labelStyle: CSSProperties = {
  fontSize: 11,
  color: '#999',
  display: 'block',
  marginBottom: 4,
}

export const btnPrimary: CSSProperties = {
  background: '#1A1A1A',
  color: 'white',
  border: 'none',
  borderRadius: 10,
  padding: '12px 20px',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
}

export const btnSecondary: CSSProperties = {
  background: 'white',
  border: '1px solid #E0E0E0',
  borderRadius: 8,
  padding: '8px 14px',
  fontSize: 13,
  cursor: 'pointer',
}
