'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  
  useEffect(() => {
    // Simula a autenticação do usuário com cookies
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (e) {
        console.error('Erro ao analisar cookie do usuário', e);
      }
    }
  }, []);

  // Determina o papel do usuário com base no pathname
  let role = 'autor';
  if (pathname.includes('/avaliador')) {
    role = 'avaliador';
  } else if (pathname.includes('/coordenador')) {
    role = 'coordenador';
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header 
        user={user} 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex flex-1">
        <Sidebar 
          className={`transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    fixed z-40 md:static md:translate-x-0`} 
          role={role} 
        />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}