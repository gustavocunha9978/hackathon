import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EventoCard } from '@/components/eventos/evento-card';
import { getEventos } from '@/lib/api';
import { Search } from 'lucide-react';

export default async function EventosPage() {
  const eventos = await getEventos();

  // Separar eventos por status
  const eventosAtivos = eventos.filter(evento => evento.status === 'ativo');
  const eventosPassados = eventos.filter(evento => evento.status === 'encerrado');
  const eventosProximos = eventos.filter(evento => evento.status === 'planejado');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Eventos Científicos
              </h1>
              <p className="mt-4 text-muted-foreground">
                Confira os eventos científicos da Faculdade Biopark e participe
                com suas submissões acadêmicas.
              </p>
              <div className="mt-6 flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Buscar eventos..."
                    className="w-full rounded-full border border-input bg-background px-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Eventos Ativos */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Eventos Ativos</h2>
            
            {eventosAtivos.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {eventosAtivos.map(evento => (
                  <EventoCard key={evento.id} evento={evento} />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-8 text-center shadow-sm">
                <p className="text-muted-foreground">
                  Não há eventos ativos no momento. Confira os próximos eventos abaixo.
                </p>
              </div>
            )}
          </div>
        </section>
        
        {/* Próximos Eventos */}
        {eventosProximos.length > 0 && (
          <section className="py-12 bg-muted">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Próximos Eventos</h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {eventosProximos.map(evento => (
                  <EventoCard key={evento.id} evento={evento} />
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Eventos Passados */}
        {eventosPassados.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Eventos Passados</h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {eventosPassados.map(evento => (
                  <EventoCard key={evento.id} evento={evento} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}