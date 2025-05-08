'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getEvento, getAvaliacoes } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  Clock,
  FileText,
  Download,
  ArrowLeft,
  Award,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export default function EventoDetalhesAvaliadorPage() {
  const params = useParams();
  const router = useRouter();
  
  const [evento, setEvento] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const userData = getUser();
      setUser(userData);

      try {
        // Buscar detalhes do evento
        const eventoData = await getEvento(params.id);
        if (!eventoData) {
          setError('Evento não encontrado');
        } else {
          setEvento(eventoData);
          
          // Buscar avaliações deste avaliador associadas ao evento
          const avaliacoesData = await getAvaliacoes(userData?.id);
          
          // Filtra as avaliações relacionadas a este evento
          // Em uma implementação real, isso seria feito no backend
          // Aqui simulamos apenas para demonstração
          const avaliacoesDoEvento = avaliacoesData.filter(avaliacao => 
            // Simulamos que todas as avaliações do avaliador são deste evento
            // Na implementação real, deveria verificar se o artigo pertence ao evento
            avaliacao.evento_id === parseInt(params.id) || true
          );
          
          setAvaliacoes(avaliacoesDoEvento);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Ocorreu um erro ao buscar os detalhes do evento');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
          <p>Carregando detalhes do evento...</p>
        </div>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Erro</h2>
          <p className="text-muted-foreground mb-6">{error || 'Evento não encontrado'}</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Separar avaliações por status
  const avaliacoesPendentes = avaliacoes.filter(av => av.nota === null);
  const avaliacoesConcluidas = avaliacoes.filter(av => av.nota !== null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Banner do Evento */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {evento.banner ? (
          <img
            src={evento.banner}
            alt={evento.nome}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{evento.nome}</h1>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white backdrop-blur-sm">
                {evento.status === 'ativo' ? 'Ativo' : 
                 evento.status === 'encerrado' ? 'Encerrado' : 'Planejado'}
              </Badge>
              <span className="text-sm opacity-80">
                {formatDate(evento.data_inicio)} - {formatDate(evento.data_fim)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sobre o Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{evento.descricao}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Data de Início</p>
                <p className="text-muted-foreground">{formatDate(evento.data_inicio)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Data de Término</p>
                <p className="text-muted-foreground">{formatDate(evento.data_fim)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Suas Avaliações</p>
                <p className="text-muted-foreground">
                  {avaliacoes.length} atribuídas ({avaliacoesConcluidas.length} concluídas)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Suas Avaliações para este Evento</h2>
        
        {avaliacoesPendentes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Avaliações Pendentes
            </h3>
            <div className="space-y-3">
              {avaliacoesPendentes.map(avaliacao => (
                <Card key={avaliacao.id} className="border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold">{avaliacao.artigo_titulo}</h4>
                        <p className="text-sm text-muted-foreground">
                          ID do Artigo: #{avaliacao.artigo_id}
                        </p>
                      </div>
                      <Button asChild>
                        <Link href={`/avaliador/avaliacoes/${avaliacao.id}`}>
                          Avaliar Agora
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {avaliacoesConcluidas.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Avaliações Concluídas
            </h3>
            <div className="space-y-3">
              {avaliacoesConcluidas.map(avaliacao => (
                <Card key={avaliacao.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold">{avaliacao.artigo_titulo}</h4>
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-muted-foreground">
                            ID do Artigo: #{avaliacao.artigo_id}
                          </p>
                          <Badge className="bg-green-100 text-green-800">
                            Nota: {avaliacao.nota}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Avaliado em: {formatDate(avaliacao.data_avaliacao)}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" asChild>
                        <Link href={`/avaliador/avaliacoes/${avaliacao.id}`}>
                          Ver Detalhes
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {avaliacoes.length === 0 && (
          <Card>
            <CardContent className="py-10">
              <div className="flex flex-col items-center justify-center text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma Avaliação Atribuída</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Você ainda não possui avaliações atribuídas para este evento. 
                  Os coordenadores atribuirão artigos para avaliação conforme necessário.
                </p>
                <Button className="mt-6" asChild>
                  <Link href="/avaliador/avaliacoes">
                    Ver Todas as Avaliações
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {evento.status === 'ativo' && (
        <Card>
          <CardHeader>
            <CardTitle>Informações para Avaliadores</CardTitle>
            <CardDescription>
              Diretrizes e datas importantes para o processo de avaliação.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
              <h3 className="font-medium text-blue-800 mb-2">Prazos Importantes</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-4 w-4 mt-0.5 shrink-0"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  <span>Prazo para Avaliação: {formatDate(evento.data_fim)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-4 w-4 mt-0.5 shrink-0"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  <span>Divulgação dos Resultados: {formatDate(new Date(evento.data_fim).setDate(new Date(evento.data_fim).getDate() + 14))}</span>
                </li>
              </ul>
            </div>
            
            <p>
              Você foi designado como avaliador para este evento. O processo de avaliação segue o modelo 
              double-blind, o que significa que você não terá acesso aos nomes dos autores durante a avaliação, 
              garantindo imparcialidade no processo.
            </p>
            
            <p>
              Para cada artigo atribuído a você, deverá preencher um checklist de avaliação, fornecer comentários 
              construtivos e atribuir uma nota final. Estas avaliações ajudarão os autores a melhorar seus trabalhos 
              e serão utilizadas pelo comitê organizador para decidir quais artigos serão aprovados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}