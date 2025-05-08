'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { getAvaliacoes } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { 
  Award, 
  Clock, 
  Search, 
  FileText, 
  Calendar, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

export default function AvaliacoesPage() {
  const [user, setUser] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [filteredAvaliacoes, setFilteredAvaliacoes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
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
        setFilteredAvaliacoes(avaliacoesData);
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filtra as avaliações com base no status e na busca
    let filtered = [...avaliacoes];
    
    if (statusFilter !== 'todos') {
      if (statusFilter === 'pendentes') {
        filtered = filtered.filter(av => av.nota === null);
      } else if (statusFilter === 'concluidas') {
        filtered = filtered.filter(av => av.nota !== null);
      }
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        av => av.artigo_titulo.toLowerCase().includes(query)
      );
    }
    
    setFilteredAvaliacoes(filtered);
  }, [statusFilter, searchQuery, avaliacoes]);

  // Separando avaliações por status
  const avaliacoesPendentes = filteredAvaliacoes.filter(av => av.nota === null);
  const avaliacoesConcluidas = filteredAvaliacoes.filter(av => av.nota !== null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Minhas Avaliações</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie as avaliações de artigos atribuídas a você.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por título do artigo..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendentes">Pendentes</SelectItem>
            <SelectItem value="concluidas">Concluídas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="pendentes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pendentes" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Pendentes</span>
            <Badge variant="secondary" className="ml-1">{avaliacoesPendentes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="concluidas" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Concluídas</span>
            <Badge variant="secondary" className="ml-1">{avaliacoesConcluidas.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="todas">
            Todas
            <Badge variant="secondary" className="ml-1">{filteredAvaliacoes.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
              <p>Carregando avaliações pendentes...</p>
            </div>
          ) : avaliacoesPendentes.length > 0 ? (
            <div className="grid gap-4">
              {avaliacoesPendentes.map((avaliacao) => (
                <AvaliacaoCard 
                  key={avaliacao.id} 
                  avaliacao={avaliacao} 
                  status="pendente"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CheckCircle className="h-12 w-12 text-green-500" />}
              title="Nenhuma avaliação pendente"
              description="Você não tem avaliações pendentes no momento."
            />
          )}
        </TabsContent>
        
        <TabsContent value="concluidas" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p>Carregando avaliações concluídas...</p>
            </div>
          ) : avaliacoesConcluidas.length > 0 ? (
            <div className="grid gap-4">
              {avaliacoesConcluidas.map((avaliacao) => (
                <AvaliacaoCard 
                  key={avaliacao.id} 
                  avaliacao={avaliacao} 
                  status="concluida"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileText className="h-12 w-12 text-muted-foreground" />}
              title="Nenhuma avaliação concluída"
              description="Você ainda não concluiu nenhuma avaliação."
            />
          )}
        </TabsContent>
        
        <TabsContent value="todas" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p>Carregando avaliações...</p>
            </div>
          ) : filteredAvaliacoes.length > 0 ? (
            <div className="grid gap-4">
              {filteredAvaliacoes.map((avaliacao) => (
                <AvaliacaoCard 
                  key={avaliacao.id} 
                  avaliacao={avaliacao} 
                  status={avaliacao.nota === null ? "pendente" : "concluida"}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<AlertCircle className="h-12 w-12 text-muted-foreground" />}
              title="Nenhuma avaliação encontrada"
              description={searchQuery ? "Nenhuma avaliação corresponde aos critérios de busca." : "Você ainda não tem avaliações atribuídas."}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para o cartão de avaliação
function AvaliacaoCard({ avaliacao, status }) {
  return (
    <Card className={status === "pendente" ? "border-yellow-200" : ""}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{avaliacao.artigo_titulo}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              ID do Artigo: #{avaliacao.artigo_id}
            </p>
            {avaliacao.data_avaliacao && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Avaliado em: {formatDate(avaliacao.data_avaliacao)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {status === "concluida" && (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Nota: {avaliacao.nota}</span>
              </Badge>
            )}
            {status === "pendente" && (
              <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Pendente</span>
              </Badge>
            )}
            <Button asChild>
              <Link href={`/avaliador/avaliacoes/${avaliacao.id}`}>
                {status === "pendente" ? "Avaliar Agora" : "Ver Detalhes"}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para estado vazio
function EmptyState({ icon, title, description }) {
  return (
    <Card>
      <CardContent className="py-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4">
            {icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}