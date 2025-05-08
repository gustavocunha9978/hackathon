'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getArtigos, getEventos, getUsuarios } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Calendar, Users, FileText, AlertCircle, CheckCircle, Clock, Flag } from 'lucide-react';

export default function CoordenadorDashboard() {
  const [artigos, setArtigos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Busca todos os artigos
        const artigosData = await getArtigos();
        setArtigos(artigosData);

        // Busca todos os eventos
        const eventosData = await getEventos();
        setEventos(eventosData);

        // Busca todos os usuários
        const usuariosData = await getUsuarios();
        setUsuarios(usuariosData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Contagem de usuários por perfil
  const autores = usuarios.filter(user => user.cargos.includes('autor')).length;
  const avaliadores = usuarios.filter(user => user.cargos.includes('avaliador')).length;
  
  // Contagem de artigos por status
  const artigosEmAvaliacao = artigos.filter(
    artigo => artigo.status === 'submetido' || artigo.status === 'em_avaliacao'
  ).length;
  const artigosAprovados = artigos.filter(
    artigo => artigo.status === 'aprovado' || artigo.status === 'publicado'
  ).length;
  const artigosReprovados = artigos.filter(artigo => artigo.status === 'reprovado').length;
  
  // Eventos ativos
  const eventosAtivos = eventos.filter(evento => evento.status === 'ativo').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard do Coordenador</h2>
        <Button asChild>
          <Link href="/coordenador/eventos/novo">
            <Calendar className="mr-2 h-4 w-4" />
            Novo Evento
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Artigos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artigos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventosAtivos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliadores</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
              <path d="M12 8a1 1 0 0 1 0 2 1 1 0 0 1 0-2z" />
              <path d="M17.3 5.7a10 10 0 0 1 0 14.1" />
              <path d="M6.7 19.8a10 10 0 0 1 0-14.1" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avaliadores}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="artigos">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
          <TabsTrigger value="artigos">Artigos</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
        </TabsList>
        
        {/* Artigos Tab */}
        <TabsContent value="artigos" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Status dos Artigos</h3>
            <Button variant="outline" asChild>
              <Link href="/coordenador/artigos">Ver Todos</Link>
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                  Em Avaliação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{artigosEmAvaliacao}</div>
                <p className="text-xs text-muted-foreground">
                  Artigos aguardando ou em processo de avaliação
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Aprovados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{artigosAprovados}</div>
                <p className="text-xs text-muted-foreground">
                  Artigos aprovados e publicados
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                  Reprovados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{artigosReprovados}</div>
                <p className="text-xs text-muted-foreground">
                  Artigos que não atenderam aos critérios mínimos
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Artigos Recentes</CardTitle>
              <CardDescription>
                Últimas submissões recebidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4">Carregando...</p>
              ) : artigos.length > 0 ? (
                <div className="space-y-4">
                  {artigos.slice(0, 5).map(artigo => (
                    <div key={artigo.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h4 className="font-medium">{artigo.titulo}</h4>
                        <p className="text-sm text-muted-foreground">
                          {artigo.autores.map(autor => autor.nome).join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(artigo.status)}>
                          {formatStatus(artigo.status)}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/coordenador/artigos/${artigo.id}`}>
                            Ver
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  Não há artigos submetidos.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Eventos Tab */}
        <TabsContent value="eventos" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Eventos</h3>
            <Button variant="outline" asChild>
              <Link href="/coordenador/eventos">Ver Todos</Link>
            </Button>
          </div>
          
          {isLoading ? (
            <p>Carregando...</p>
          ) : eventos.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eventos.slice(0, 3).map(evento => (
                <Card key={evento.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{evento.nome}</CardTitle>
                      <Badge variant={evento.status === 'ativo' ? 'default' : 'outline'}>
                        {evento.status === 'ativo' ? 'Ativo' : 
                         evento.status === 'encerrado' ? 'Encerrado' : 'Planejado'}
                      </Badge>
                    </div>
                    <CardDescription>{evento.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Início: {formatDate(evento.data_inicio)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Término: {formatDate(evento.data_fim)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/coordenador/eventos/${evento.id}`}>
                        Gerenciar
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">
                  Não há eventos cadastrados.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Usuários Tab */}
        <TabsContent value="usuarios" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Usuários</h3>
            <Button variant="outline" asChild>
              <Link href="/coordenador/usuarios">Ver Todos</Link>
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="mr-2 h-4 w-4 text-blue-500" />
                  Autores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{autores}</div>
                <p className="text-xs text-muted-foreground">
                  Usuários com permissão para submeter artigos
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Award className="mr-2 h-4 w-4 text-purple-500" />
                  Avaliadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avaliadores}</div>
                <p className="text-xs text-muted-foreground">
                  Usuários com permissão para avaliar submissões
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Usuários Recentes</CardTitle>
              <CardDescription>
                Últimos usuários cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4">Carregando...</p>
              ) : usuarios.length > 0 ? (
                <div className="space-y-4">
                  {usuarios.slice(0, 5).map(usuario => (
                    <div key={usuario.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h4 className="font-medium">{usuario.nome}</h4>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {usuario.cargos.map(cargo => (
                          <Badge key={cargo} variant="outline">
                            {cargo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  Não há usuários cadastrados.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}