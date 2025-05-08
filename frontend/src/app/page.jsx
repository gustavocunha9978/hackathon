"use client"; // Importante: marca como componente cliente para acessar localStorage

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EventoCard } from "@/components/eventos/evento-card";

export default function HomePage() {
  // Estado para armazenar os eventos
  const [eventos, setEventos] = useState([]);
  const [eventosAtivos, setEventosAtivos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar dados do localStorage quando o componente monta
  useEffect(() => {
    // Função para carregar eventos do localStorage
    const loadEventos = () => {
      try {
        // Verificar se localStorage está disponível (não estamos no SSR)
        if (typeof window !== "undefined") {
          setIsLoading(true);

          // Inicializa dados padrão se não existirem
          if (!localStorage.getItem("eventos")) {
            localStorage.setItem(
              "eventos",
              JSON.stringify([
                {
                  id: 1,
                  nome: "Congresso Biopark de Inovação 2025",
                  banner: "/images/evento1.jpg",
                  descricao:
                    "Evento anual para apresentação de inovações tecnológicas da faculdade",
                  data_inicio: "2025-08-15",
                  data_fim: "2025-08-20",
                  status: "ativo",
                },
                {
                  id: 2,
                  nome: "Simpósio de Pesquisa Acadêmica",
                  banner: "/images/evento2.jpg",
                  descricao:
                    "Evento semestral para apresentação de pesquisas acadêmicas",
                  data_inicio: "2025-06-10",
                  data_fim: "2025-06-12",
                  status: "ativo",
                },
                {
                  id: 3,
                  nome: "Workshop de Metodologia Científica",
                  banner: "/images/evento3.jpg",
                  descricao:
                    "Workshop intensivo sobre metodologias de pesquisa científica",
                  data_inicio: "2025-09-05",
                  data_fim: "2025-09-07",
                  status: "planejado",
                },
              ])
            );
          }

          // Carrega do localStorage
          const eventosFromStorage = JSON.parse(
            localStorage.getItem("eventos") || "[]"
          );
          setEventos(eventosFromStorage);

          // Filtra eventos ativos
          const ativos = eventosFromStorage.filter(
            (evento) => evento.status === "ativo"
          );
          setEventosAtivos(ativos);

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao carregar eventos do localStorage:", error);
        setIsLoading(false);
      }
    };

    loadEventos();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primaryBiopark to-primary py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h5 className="text-2xl font-bold tracking-tight sm:text-2xl md:text-2xl">
              Plataforma de submissão, avaliação e publicação de artigos
            </h5>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                asChild
              >
                <Link href="/registro">Cadastre-se</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-primary hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/eventos">Ver Eventos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Eventos em Destaque */}
        <section className="py-16 px-10">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold">Eventos em Destaque</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Confira os eventos científicos ativos da Faculdade Biopark e
                participe com suas submissões acadêmicas.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-10">
                <p>Carregando eventos...</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {eventosAtivos.length > 0 ? (
                  eventosAtivos.map((evento) => (
                    <EventoCard key={evento.id} evento={evento} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">
                      Não há eventos ativos no momento. Volte em breve!
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-10 text-center">
              <Button variant="outline" asChild>
                <Link href="/eventos">Ver Todos os Eventos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold">Como Funciona</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Entenda o processo de submissão e avaliação de artigos
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Submissão</h3>
                <p className="text-muted-foreground">
                  Cadastre-se na plataforma com o email de sua instituição,
                  escolha um evento ativo e submeta seu artigo científico
                  seguindo as diretrizes.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Avaliação</h3>
                <p className="text-muted-foreground">
                  Seu artigo será avaliado de maneira anônima (double-blind),
                  assegurando total imparcialidade no processo.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Publicação</h3>
                <p className="text-muted-foreground">
                  Após aprovação, seu artigo será publicado nos anais do evento
                  e ficará disponível na plataforma.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primaryBiopark text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold">
              Pronto para Submeter seu Artigo?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto">
              Participe dos eventos científicos de sua faculdade e contribua com
              suas pesquisas.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                asChild
              >
                <Link href="/registro">Começar Agora</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
