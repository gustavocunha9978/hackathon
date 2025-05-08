import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EventoCard } from '@/components/eventos/evento-card';
import { getEventos } from '@/lib/api';

export default async function HomePage() {
  const eventos = await getEventos();
  const eventosAtivos = eventos.filter(evento => evento.status === 'ativo');
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-purple-700 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              HackSubmit 2025
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Plataforma de submissão, avaliação e publicação de artigos científicos da Faculdade Biopark.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                <Link href="/registro">
                  Cadastre-se
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/eventos">
                  Ver Eventos
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Eventos em Destaque */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold">Eventos em Destaque</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Confira os eventos científicos ativos da Faculdade Biopark e participe
                com suas submissões acadêmicas.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eventosAtivos.length > 0 ? (
                eventosAtivos.map(evento => (
                  <EventoCard key={evento.id} evento={evento} />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">
                    Não há eventos ativos no momento. Volte em breve!
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-10 text-center">
              <Button variant="outline" asChild>
                <Link href="/eventos">
                  Ver Todos os Eventos
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Como Funciona */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold">Como Funciona</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Entenda o processo de submissão e avaliação de artigos na nossa plataforma.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Submissão</h3>
                <p className="text-muted-foreground">
                  Cadastre-se na plataforma, escolha um evento ativo e submeta seu artigo
                  científico seguindo as diretrizes.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Avaliação</h3>
                <p className="text-muted-foreground">
                  Seu artigo será avaliado por especialistas de forma anônima (double-blind), 
                  garantindo imparcialidade.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Publicação</h3>
                <p className="text-muted-foreground">
                  Após aprovação, seu artigo será publicado nos anais do evento e ficará
                  disponível na plataforma.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold">Pronto para Submeter seu Artigo?</h2>
            <p className="mt-4 max-w-2xl mx-auto">
              Participe dos eventos científicos da Faculdade Biopark e contribua com suas pesquisas.
            </p>
            <div className="mt-8">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                <Link href="/registro">
                  Começar Agora
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}