import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { formatDate } from '@/lib/utils';
import { getEvento, getArtigos } from '@/lib/api';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  ChevronLeft,
  Download,
  Upload,
} from 'lucide-react';

export default async function EventoDetalhePage({ params }) {
  const evento = await getEvento(params.id);
  
  if (!evento) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Evento não encontrado</h2>
                <p className="text-muted-foreground">
                  O evento que você está procurando não existe ou foi removido.
                </p>
                <Button asChild>
                  <Link href="/eventos">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar para Eventos
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const artigos = await getArtigos();
  const artigosDoEvento = artigos.filter(artigo => artigo.evento_id === parseInt(params.id));
  const artigosPublicados = artigosDoEvento.filter(artigo => artigo.status === 'publicado');

  // Verificação se o evento está ativo
  const eventoAtivo = evento.status === 'ativo';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Banner do Evento */}
        <section className="relative bg-muted h-64 md:h-80">
          {evento.banner ? (
            <img
              src={evento.banner}
              alt={evento.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-muted-foreground opacity-50">Banner não disponível</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{evento.nome}</h1>
              <Badge className="bg-white text-primary">
                {evento.status === 'ativo' ? 'Ativo' : 
                 evento.status === 'encerrado' ? 'Encerrado' : 'Planejado'}
              </Badge>
            </div>
          </div>
        </section>
        
        {/* Detalhes do Evento */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <Button variant="outline" asChild>
                <Link href="/eventos">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar para Eventos
                </Link>
              </Button>
              
              {eventoAtivo && (
                <Button asChild>
                  <Link href={`/autor/submissao?evento=${evento.id}`}>
                    <Upload className="mr-2 h-4 w-4" />
                    Submeter Artigo
                  </Link>
                </Button>
              )}
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Sobre o Evento</h2>
                  <p className="text-muted-foreground">{evento.descricao}</p>
                </div>
                
                {artigosPublicados.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Artigos Publicados</h2>
                    <div className="space-y-4">
                      {artigosPublicados.map((artigo) => (
                        <Card key={artigo.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <h3 className="font-semibold">{artigo.titulo}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {artigo.autores.map(autor => autor.nome).join(', ')}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {artigosPublicados.length === 0 && (
                  <div className="bg-muted p-6 rounded-lg">
                    <p className="text-center text-muted-foreground">
                      {eventoAtivo
                        ? 'Ainda não há artigos publicados para este evento.'
                        : evento.status === 'planejado'
                        ? 'Este evento ainda não começou. Os artigos serão publicados após a avaliação.'
                        : 'Não há artigos publicados para este evento.'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Informações do Evento</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Data de Início</p>
                          <p className="text-muted-foreground">{formatDate(evento.data_inicio)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Data de Término</p>
                          <p className="text-muted-foreground">{formatDate(evento.data_fim)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Status</p>
                          <p className="text-muted-foreground">
                            {evento.status === 'ativo' ? 'Em andamento' : 
                             evento.status === 'encerrado' ? 'Encerrado' : 'Planejado'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Participantes</p>
                          <p className="text-muted-foreground">
                            {artigosDoEvento.length > 0 
                              ? `${artigosDoEvento.length} submissões`
                              : 'Nenhuma submissão ainda'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Artigos Publicados</p>
                          <p className="text-muted-foreground">
                            {artigosPublicados.length} artigos
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {eventoAtivo && (
                  <Card className="bg-primary text-primary-foreground">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Submeta seu Artigo</h3>
                      <p className="mb-4">
                        As submissões estão abertas. Participe enviando seu artigo científico!
                      </p>
                      <Button variant="secondary" className="w-full" asChild>
                        <Link href={`/autor/submissao?evento=${evento.id}`}>
                          <Upload className="mr-2 h-4 w-4" />
                          Submeter Agora
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
                
                {!eventoAtivo && evento.status === 'planejado' && (
                  <Card className="bg-muted">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Próximo Evento</h3>
                      <p className="mb-4 text-muted-foreground">
                        Este evento ainda não começou. As submissões serão abertas em breve.
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {!eventoAtivo && evento.status === 'encerrado' && artigosPublicados.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Anais do Evento</h3>
                      <p className="mb-4 text-muted-foreground">
                        Baixe a compilação dos artigos publicados neste evento.
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download dos Anais
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}