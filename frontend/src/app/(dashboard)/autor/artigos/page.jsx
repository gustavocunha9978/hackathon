'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArtigoCard } from '@/components/artigos/artigo-card';
import { getArtigos } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Search, Upload } from 'lucide-react';
import Link from 'next/link';

export default function ArtigosPage() {
  const [artigos, setArtigos] = useState([]);
  const [filteredArtigos, setFilteredArtigos] = useState([]);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtigos = async () => {
      setIsLoading(true);
      const userData = getUser();
      
      try {
        const artigosData = await getArtigos(userData?.id);
        setArtigos(artigosData);
        setFilteredArtigos(artigosData);
      } catch (error) {
        console.error('Erro ao buscar artigos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtigos();
  }, []);

  useEffect(() => {
    // Filtra os artigos com base no status e na busca
    let filtered = [...artigos];
    
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(artigo => artigo.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        artigo => 
          artigo.titulo.toLowerCase().includes(query) || 
          artigo.resumo.toLowerCase().includes(query) ||
          artigo.area_tematica.toLowerCase().includes(query) ||
          artigo.palavras_chave.some(palavra => palavra.toLowerCase().includes(query))
      );
    }
    
    setFilteredArtigos(filtered);
  }, [statusFilter, searchQuery, artigos]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Meus Artigos</h2>
        <Button asChild>
          <Link href="/autor/submissao">
            <Upload className="mr-2 h-4 w-4" />
            Nova Submissão
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar artigos..."
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
            <SelectItem value="submetido">Em análise</SelectItem>
            <SelectItem value="em_avaliacao">Em avaliação</SelectItem>
            <SelectItem value="revisao">Revisão solicitada</SelectItem>
            <SelectItem value="aprovado">Aprovado</SelectItem>
            <SelectItem value="reprovado">Reprovado</SelectItem>
            <SelectItem value="publicado">Publicado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando artigos...</p>
        </div>
      ) : filteredArtigos.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArtigos.map(artigo => (
            <ArtigoCard key={artigo.id} artigo={artigo} userRole="autor" />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'todos'
              ? 'Nenhum artigo encontrado com os filtros aplicados.'
              : 'Você ainda não tem artigos submetidos.'}
          </p>
          {!searchQuery && statusFilter === 'todos' && (
            <Button asChild>
              <Link href="/autor/submissao">
                <Upload className="mr-2 h-4 w-4" />
                Submeter Artigo
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}