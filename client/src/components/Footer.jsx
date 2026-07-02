export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      marginTop: 80,
      padding: '32px 0',
      textAlign: 'center',
    }}>
      <div className="container">
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Made with ❤️ by <strong style={{ color: 'var(--text-secondary)' }}>Avdhesh</strong>
          {' · '}
          <span style={{ color: 'var(--accent-red)' }}>PlaylistTime</span>
          {' · '}
          <a
            href="https://buymeacoffee.com/YOUR_USERNAME_HERE"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-amber)', textDecoration: 'none' }}
          >
            ☕ Buy me a coffee
          </a>
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>
          Free tool · No signup required · Duration metadata only
        </p>
      </div>
    </footer>
  );
}
