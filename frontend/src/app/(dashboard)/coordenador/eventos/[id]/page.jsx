'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getEvento, getArtigos } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Download,
  Edit,
  ChevronLeft,
  Settings,
  BarChart,
  UserPlus,
  Mail,
} from 'lucide-react';
import Link from 'next/link';

export default function EventoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  
  const [evento, setEvento] = useState(null);
  const [artigos, setArtigos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Busca os detalhes do evento
        const eventoData = await getEvento(params.id);
        if (!eventoData) {
          setError('Evento não encontrado');
        } else {
          setEvento(eventoData);
          
          // Busca artigos associados ao evento
          const artigosData = await getArtigos();
          const artigosDoEvento = artigosData.filter(
            artigo => artigo.evento_id === parseInt(params.id)
          );
          setArtigos(artigosDoEvento);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Ocorreu um erro ao buscar os detalhes do evento');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Carregando detalhes do evento...</p>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-destructive mb-4">{error || 'Evento não encontrado'}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
  }

  // Contagens por status
  const artigosSubmissao = artigos.filter(
    artigo => artigo.status === 'submetido'
  ).length;
  const artigosAvaliacao = artigos.filter(
    artigo => artigo.status === 'em_avaliacao'
  ).length;
  const artigosRevisao = artigos.filter(
    artigo => artigo.status === 'revisao'
  ).length;
  const artigosAprovados = artigos.filter(
    artigo => artigo.status === 'aprovado' || artigo.status === 'publicado'
  ).length;
  const artigosReprovados = artigos.filter(
    artigo => artigo.status === 'reprovado'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/coordenador/eventos/${evento.id}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Evento
            </Link>
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl">{evento.nome}</CardTitle>
              <CardDescription className="mt-2">
                {formatDate(evento.data_inicio)} - {formatDate(evento.data_fim)}
              </CardDescription>
            </div>
            <Badge className={evento.status === 'ativo' ? 'bg-green-100 text-green-800' : 
                              evento.status === 'planejado' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'}>
              {evento.status === 'ativo' ? 'Ativo' : 
               evento.status === 'planejado' ? 'Planejado' : 'Encerrado'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Descrição</h3>
            <p className="text-muted-foreground">{evento.descricao}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Data de Início</p>
                <p className="text-muted-foreground">{formatDate(evento.data_inicio)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Data de Término</p>
                <p className="text-muted-foreground">{formatDate(evento.data_fim)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Status</p>
                <p className="text-muted-foreground">
                  {evento.status === 'ativo' ? 'Em andamento' : 
                   evento.status === 'encerrado' ? 'Encerrado' : 'Planejado'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Submissões</p>
                <p className="text-muted-foreground">{artigos.length} artigos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-5 gap-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Resumo de Submissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              <div className="col-span-5 md:col-span-1 p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold">{artigos.length}</p>
                <p className="text-sm">Total</p>
              </div>
              <div className="p-4 rounded-lg text-center bg-blue-50 text-blue-700">
                <p className="text-xl font-bold">{artigosSubmissao}</p>
                <p className="text-xs">Submissão</p>
              </div>
              <div className="p-4 rounded-lg text-center bg-yellow-50 text-yellow-700">
                <p className="text-xl font-bold">{artigosAvaliacao}</p>
                <p className="text-xs">Avaliação</p>
              </div>
              <div className="p-4 rounded-lg text-center bg-purple-50 text-purple-700">
                <p className="text-xl font-bold">{artigosRevisao}</p>
                <p className="text-xs">Revisão</p>
              </div>
              <div className="p-4 rounded-lg text-center bg-green-50 text-green-700">
                <p className="text-xl font-bold">{artigosAprovados}</p>
                <p className="text-xs">Aprovados</p>
              </div>
              <div className="p-4 rounded-lg text-center bg-red-50 text-red-700">
                <p className="text-xl font-bold">{artigosReprovados}</p>
                <p className="text-xs">Reprovados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/coordenador/artigos">
                <FileText className="mr-2 h-4 w-4" />
                Gerenciar Artigos
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <UserPlus className="mr-2 h-4 w-4" />
              Convidar Avaliadores
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mail className="mr-2 h-4 w-4" />
              Enviar Comunicado
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
            {evento.status === 'ativo' && (
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Publicar Anais
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="artigos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="artigos">Artigos</TabsTrigger>
          <TabsTrigger value="avaliadores">Avaliadores</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="artigos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Artigos Submetidos</h3>
            <Button asChild>
              <Link href="/coordenador/artigos">
                Ver Todos
              </Link>
            </Button>
          </div>
          
          {artigos.length > 0 ? (
            <div className="space-y-4">
              {artigos.slice(0, 5).map(artigo => (
                <Card key={artigo.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-semibold">{artigo.titulo}</h4>
                        <p className="text-sm text-muted-foreground">
                          {artigo.autores.map(autor => autor.nome).join(', ')}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge className={getStatusColor(artigo.status)}>
                          {formatStatus(artigo.status)}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/coordenador/artigos/${artigo.id}`}>
                            Gerenciar
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Ainda não há artigos submetidos para este evento.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="avaliadores">
          <Card>
            <CardHeader>
              <CardTitle>Avaliadores do Evento</CardTitle>
              <CardDescription>
                Gerencie os avaliadores atribuídos a este evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  Ainda não há avaliadores atribuídos a este evento.
                </p>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Avaliadores
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle>Checklist de Avaliação</CardTitle>
              <CardDescription>
                Defina os critérios de avaliação para este evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  Ainda não há checklist definido para este evento.
                </p>
                <Button>
                  Criar Checklist
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="estatisticas">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas do Evento</CardTitle>
              <CardDescription>
                Acompanhe o progresso e métricas do evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <BarChart className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mt-4">
                  Dados insuficientes para gerar estatísticas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}