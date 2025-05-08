"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getArtigos } from "@/lib/api";
import { formatDate, formatStatus, getStatusColor } from "@/lib/utils";
import { Search, FileText, Download, Users } from "lucide-react";

export default function GerenciarArtigosPage() {
  const [artigos, setArtigos] = useState([]);
  const [filteredArtigos, setFilteredArtigos] = useState([]);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtigos = async () => {
      setIsLoading(true);
      try {
        const artigosData = await getArtigos();
        setArtigos(artigosData);
        setFilteredArtigos(artigosData);
      } catch (error) {
        console.error("Erro ao buscar artigos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtigos();
  }, []);

  useEffect(() => {
    // Filtra os artigos com base no status e na busca
    let filtered = [...artigos];

    if (statusFilter !== "todos") {
      filtered = filtered.filter((artigo) => artigo.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (artigo) =>
          artigo.titulo.toLowerCase().includes(query) ||
          artigo.resumo.toLowerCase().includes(query) ||
          artigo.area_tematica.toLowerCase().includes(query) ||
          artigo.palavras_chave.some((palavra) =>
            palavra.toLowerCase().includes(query)
          ) ||
          artigo.autores.some((autor) =>
            autor.nome.toLowerCase().includes(query)
          )
      );
    }

    setFilteredArtigos(filtered);
  }, [statusFilter, searchQuery, artigos]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gerenciar Artigos</h2>
        <p className="text-muted-foreground mt-2">
          Visualize e gerencie todos os artigos submetidos na plataforma.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar artigos por título, autor, área..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="submetido">Aguardando avaliação</SelectItem>
            <SelectItem value="aguardando_correcao">
              Aguardando correção
            </SelectItem>
            <SelectItem value="aprovado">Aprovado</SelectItem>
            <SelectItem value="reprovado">Reprovado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando artigos...</p>
        </div>
      ) : filteredArtigos.length > 0 ? (
        <div className="space-y-4">
          {filteredArtigos.map((artigo) => (
            <Card key={artigo.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{artigo.titulo}</h3>
                    <Badge className={getStatusColor(artigo.status)}>
                      {formatStatus(artigo.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {artigo.resumo.substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{artigo.area_tematica}</span>
                    <span className="mx-1">•</span>
                    <Users className="h-4 w-4" />
                    <span>
                      {artigo.autores.map((autor) => autor.nome).join(", ")}
                    </span>
                    <span className="mx-1">•</span>
                    <span>
                      Submetido em{" "}
                      {formatDate(artigo.versao_atual.data_cadastro)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button asChild>
                    <Link href={`/coordenador/artigos/${artigo.id}`}>
                      Gerenciar
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== "todos"
              ? "Nenhum artigo encontrado com os filtros aplicados."
              : "Não há artigos submetidos."}
          </p>
        </div>
      )}
    </div>
  );
}
