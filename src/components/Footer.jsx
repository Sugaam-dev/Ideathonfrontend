export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: '#fff',
      padding: '24px 24px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        {/* Logo only — no text */}
        <a
          href="https://www.pmrgsolution.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <img
            src="/pmrg-logo.png"
            alt="PMRG Solution"
            style={{ height: 44, width: 'auto', objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} PMRG Solution. All rights reserved.
          </span>
          <a
            href="https://www.pmrgsolution.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}
          >
            Visit Website →
          </a>
        </div>
      </div>
    </footer>
  )
}