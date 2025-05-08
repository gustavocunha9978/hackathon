import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  FileText,
  Upload,
  Calendar,
  Award,
  Users,
  ClipboardList,
  Settings,
  Home
} from 'lucide-react';

const authorRoutes = [
  {
    title: 'Dashboard',
    href: '/autor',
    icon: Home,
  },
  {
    title: 'Meus Artigos',
    href: '/autor/artigos',
    icon: FileText,
  },
  {
    title: 'Nova Submissão',
    href: '/autor/submissao',
    icon: Upload,
  },
  {
    title: 'Eventos',
    href: '/eventos',
    icon: Calendar,
  },
];

const reviewerRoutes = [
  {
    title: 'Dashboard',
    href: '/avaliador',
    icon: Home,
  },
  {
    title: 'Avaliações',
    href: '/avaliador/avaliacoes',
    icon: Award,
  },
  {
    title: 'Eventos',
    href: '/eventos',
    icon: Calendar,
  },
];

const coordinatorRoutes = [
  {
    title: 'Dashboard',
    href: '/coordenador',
    icon: Home,
  },
  {
    title: 'Eventos',
    href: '/coordenador/eventos',
    icon: Calendar,
  },
  {
    title: 'Artigos',
    href: '/coordenador/artigos',
    icon: FileText,
  },
  {
    title: 'Usuários',
    href: '/coordenador/usuarios',
    icon: Users,
  },
  {
    title: 'Checklists',
    href: '/coordenador/checklists',
    icon: ClipboardList,
  },
  {
    title: 'Configurações',
    href: '/coordenador/configuracoes',
    icon: Settings,
  },
];

export function Sidebar({ className, role = 'autor' }) {
  let routes;

  switch (role) {
    case 'autor':
      routes = authorRoutes;
      break;
    case 'avaliador':
      routes = reviewerRoutes;
      break;
    case 'coordenador':
      routes = coordinatorRoutes;
      break;
    default:
      routes = authorRoutes;
  }

  return (
    <div className={cn("pb-12 w-64 border-r h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Menu
          </h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}