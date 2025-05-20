import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Assuming Button placeholder exists

const Navbar: React.FC = () => {
  return (
    <nav className="bg-background border-b h-16 flex items-center justify-between px-4">
      <Link to="/" className="text-xl font-semibold">
        StarFlow
      </Link>
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link to="/flows">Flows</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/models">Models</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
