import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Megaphone, MessageSquare, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useApp();

  const items = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Creators', path: '/creators', icon: Users },
    { label: 'Campaigns', path: '/campaigns', icon: Megaphone },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Dashboard', path: '/dashboard', icon: UserCheck }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 py-1.5 px-3 pb-safe">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
                isActive ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

