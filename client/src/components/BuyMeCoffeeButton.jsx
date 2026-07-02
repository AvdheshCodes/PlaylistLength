// ── Buy Me a Coffee Button ────────────────────────────────────────
// Edit this constant before deploying to point to your real profile.
const BMAC_USERNAME = 'YOUR_USERNAME_HERE';

export default function BuyMeCoffeeButton() {
  return (
    <a
      href={`https://buymeacoffee.com/${BMAC_USERNAME}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-coffee"
      aria-label="Buy me a coffee"
    >
      ☕ <span>Buy me a coffee</span>
    </a>
  );
}
