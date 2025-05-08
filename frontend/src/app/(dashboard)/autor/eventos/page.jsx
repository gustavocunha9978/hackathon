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
import { formatDate } from "@/lib/utils";
import { getEventos } from "@/lib/api";
import { Calendar, ChevronRight, Plus, Search, Upload } from "lucide-react";

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      setIsLoading(true);
      try {
        const eventosData = await getEventos();
        setEventos(eventosData);
        setFilteredEventos(eventosData);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    // Filtra os eventos com base no status e na busca
    let filtered = [...eventos];

    if (statusFilter !== "todos") {
      filtered = filtered.filter((evento) => evento.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (evento) =>
          evento.nome.toLowerCase().includes(query) ||
          evento.descricao.toLowerCase().includes(query)
      );
    }

    setFilteredEventos(filtered);
  }, [statusFilter, searchQuery, eventos]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar eventos..."
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
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="planejado">Planejados</SelectItem>
            <SelectItem value="encerrado">Encerrados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando eventos...</p>
        </div>
      ) : filteredEventos.length > 0 ? (
        <div className="space-y-4">
          {filteredEventos.map((evento) => (
            <Card key={evento.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{evento.nome}</h3>
                    <Badge
                      className={
                        evento.status === "ativo"
                          ? "bg-green-100 text-green-800"
                          : evento.status === "planejado"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {evento.status === "ativo"
                        ? "Ativo"
                        : evento.status === "planejado"
                        ? "Planejado"
                        : "Encerrado"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {evento.descricao}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatDate(evento.data_inicio)} -{" "}
                        {formatDate(evento.data_fim)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {evento.status !== "planejado" ? (
                      <Button asChild>
                        <Link href="/autor/submissao">
                          <Upload className="mr-2 h-4 w-4" />
                          Submeter Artigo
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled variant="outlined">
                        <span>Em Breve</span>
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== "todos"
              ? "Nenhum evento encontrado com os filtros aplicados."
              : "Não há eventos cadastrados."}
          </p>
          <Button asChild>
            <Link href="/coordenador/eventos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Evento
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
