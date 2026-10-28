import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p>Accessible AI-assisted crop-health screening for better-informed farming decisions across Nigeria.</p>
        </div>
        <div>
          <h4>Product</h4>
          <Link href="/scan">Start a scan</Link>
          <Link href="/guide">Supported crops</Link>
          <Link href="/#how">How it works</Link>
          <Link href="/dashboard">Workspace</Link>
        </div>
        <div>
          <h4>Support & Ethics</h4>
          <Link href="/help">Help & FAQ</Link>
          <Link href="/help#responsible">Responsible AI Policy</Link>
          <Link href="/settings">Language & Privacy</Link>
        </div>
        <div>
          <h4>Languages</h4>
          <p>English (Official)</p>
          <p>Yorùbá (Èdè Abínibí)</p>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 CropScan AI. Screening support, not a confirmed laboratory diagnosis.</span>
        <span>Built for smallholder farmers and extension officers.</span>
      </div>
    </footer>
  );
}
