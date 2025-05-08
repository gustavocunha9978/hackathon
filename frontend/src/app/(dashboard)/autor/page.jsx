"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArtigoCard } from "@/components/artigos/artigo-card";
import { EventoCard } from "@/components/eventos/evento-card";
import { getArtigos, getEventos } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Upload, FileText, Clock } from "lucide-react";

export default function AutorDashboard() {
  const [artigos, setArtigos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const userData = getUser();
      setUser(userData);

      try {
        // Busca os artigos do autor
        const artigosData = await getArtigos(userData?.id);
        setArtigos(artigosData);

        // Busca eventos ativos
        const eventosData = await getEventos(userData?.user.institutionId);
        const eventosAtivos = eventosData.filter(
          (evento) => evento.status === "ativo"
        );
        setEventos(eventosAtivos);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtra artigos por status para os widgets
  const artigosEmAvaliacao = artigos.filter(
    (artigo) =>
      artigo.status === "submetido" || artigo.status === "aguardando_correcao"
  );
  const artigosAprovados = artigos.filter(
    (artigo) => artigo.status === "aprovado" || artigo.status === "publicado"
  );
  const artigosRevisao = artigos.filter(
    (artigo) => artigo.status === "revisao"
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard do Autor
        </h2>
        <Button asChild>
          <Link href="/autor/submissao">
            <Upload className="mr-2 h-4 w-4" />
            Nova Submissão
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Artigos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artigos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aguardando correção
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {artigosEmAvaliacao.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artigosAprovados.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revisões</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artigosRevisao.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Artigos Recentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Meus Artigos Recentes</h3>
          <Button variant="outline" asChild>
            <Link href="/autor/artigos">Ver Todos</Link>
          </Button>
        </div>

        {isLoading ? (
          <p>Carregando...</p>
        ) : artigos.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artigos.slice(0, 3).map((artigo) => (
              <ArtigoCard key={artigo.id} artigo={artigo} userRole="autor" />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">
                  Você ainda não tem artigos submetidos.
                </p>
                <Button asChild>
                  <Link href="/autor/submissao">
                    <Upload className="mr-2 h-4 w-4" />
                    Submeter Artigo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Eventos Ativos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Eventos Ativos</h3>
          <Button variant="outline" asChild>
            <Link href="/eventos">Ver Todos</Link>
          </Button>
        </div>

        {isLoading ? (
          <p>Carregando...</p>
        ) : eventos.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventos.slice(0, 3).map((evento) => (
              <EventoCard key={evento.id} evento={evento} userRole="autor" />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                Não há eventos ativos no momento. Volte em breve!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
