/* eslint-disable @next/next/no-img-element */
import React from 'react'

export const Logo = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
    <img src="/cofwo-logomark.png" alt="" width={120} height={48} style={{ objectFit: 'contain' }} />
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.02em' }}>COFWO Admin</div>
      <div style={{ fontSize: 13, opacity: 0.7 }}>The Chariot of Fire World Outreach</div>
    </div>
  </div>
)
