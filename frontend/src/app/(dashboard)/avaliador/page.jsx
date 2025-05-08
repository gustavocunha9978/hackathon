'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAvaliacoes, getEventos } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Award, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function AvaliadorDashboard() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const userData = getUser();
      setUser(userData);

      try {
        // Busca as avaliações atribuídas ao avaliador
        const avaliacoesData = await getAvaliacoes(userData?.id);
        setAvaliacoes(avaliacoesData);

        // Busca eventos ativos
        const eventosData = await getEventos();
        const eventosAtivos = eventosData.filter(evento => evento.status === 'ativo');
        setEventos(eventosAtivos);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Contagem de avaliações por status
  const avaliacoesPendentes = avaliacoes.filter(av => av.nota === null).length;
  const avaliacoesCompletas = avaliacoes.filter(av => av.nota !== null).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard do Avaliador</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie as avaliações de artigos atribuídas a você.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avaliacoes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avaliacoesPendentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avaliacoesCompletas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Avaliações Pendentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Avaliações Pendentes</h3>
          <Button variant="outline" asChild>
            <Link href="/avaliador/avaliacoes">Ver Todas</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <p>Carregando...</p>
        ) : avaliacoesPendentes > 0 ? (
          <div className="grid gap-4">
            {avaliacoes
              .filter(av => av.nota === null)
              .map((avaliacao) => (
                <Card key={avaliacao.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{avaliacao.artigo_titulo}</h4>
                        <p className="text-muted-foreground text-sm">ID do Artigo: #{avaliacao.artigo_id}</p>
                      </div>
                      <Button asChild>
                        <Link href={`/avaliador/avaliacoes/${avaliacao.id}`}>
                          Avaliar Agora
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <CheckCircle className="h-5 w-5" />
                <p>Não há avaliações pendentes. Bom trabalho!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Avaliações Recentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Avaliações Recentes</h3>
        </div>
        
        {isLoading ? (
          <p>Carregando...</p>
        ) : avaliacoesCompletas > 0 ? (
          <div className="grid gap-4">
            {avaliacoes
              .filter(av => av.nota !== null)
              .slice(0, 3)
              .map((avaliacao) => (
                <Card key={avaliacao.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{avaliacao.artigo_titulo}</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-muted-foreground text-sm">Avaliado em: {avaliacao.data_avaliacao}</p>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Nota: {avaliacao.nota}
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
              ))
            }
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <AlertCircle className="h-5 w-5" />
                <p>Nenhuma avaliação concluída ainda.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}