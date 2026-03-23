import { Link } from 'react-router-dom';

export function Nav() {
  return (
    <nav className="mb-4 flex gap-3 text-sm">
      {['/', '/onboarding', '/workout', '/nutrition', '/import', '/settings', '/reports'].map((href) => (
        <Link key={href} to={href} className="rounded bg-white px-3 py-2 shadow">
          {href === '/' ? 'Dashboard' : href.replace('/', '')}
        </Link>
      ))}
    </nav>
  );
}
