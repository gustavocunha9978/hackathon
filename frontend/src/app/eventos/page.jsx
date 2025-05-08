"use client"; // Marca como componente cliente para acessar localStorage

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EventoCard } from "@/components/eventos/evento-card";
import { Search } from "lucide-react";

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [eventosAtivos, setEventosAtivos] = useState([]);
  const [eventosPassados, setEventosPassados] = useState([]);
  const [eventosProximos, setEventosProximos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEventos, setFilteredEventos] = useState({
    ativos: [],
    passados: [],
    proximos: [],
  });

  // Efeito para carregar dados do localStorage quando o componente monta
  useEffect(() => {
    // Função para carregar eventos do localStorage
    const loadEventos = () => {
      try {
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
              {
                id: 4,
                nome: "Conferência de Programação 2024",
                banner: "/images/evento4.jpg",
                descricao:
                  "Conferência sobre as últimas tendências em programação",
                data_inicio: "2024-11-10",
                data_fim: "2024-11-15",
                status: "encerrado",
              },
            ])
          );
        }

        // Carrega do localStorage
        const eventosFromStorage = JSON.parse(
          localStorage.getItem("eventos") || "[]"
        );
        setEventos(eventosFromStorage);

        // Separa eventos por status
        const ativos = eventosFromStorage.filter(
          (evento) => evento.status === "ativo"
        );
        const passados = eventosFromStorage.filter(
          (evento) => evento.status === "encerrado"
        );
        const proximos = eventosFromStorage.filter(
          (evento) => evento.status === "planejado"
        );

        setEventosAtivos(ativos);
        setEventosPassados(passados);
        setEventosProximos(proximos);

        // Inicializa os eventos filtrados com todos os eventos
        setFilteredEventos({
          ativos,
          passados,
          proximos,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar eventos do localStorage:", error);
        setIsLoading(false);
      }
    };

    loadEventos();
  }, []);

  // Efeito para filtrar eventos com base na pesquisa
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Se não há pesquisa, mostra todos os eventos
      setFilteredEventos({
        ativos: eventosAtivos,
        passados: eventosPassados,
        proximos: eventosProximos,
      });
    } else {
      // Filtra eventos com base na pesquisa
      const query = searchQuery.toLowerCase();

      setFilteredEventos({
        ativos: eventosAtivos.filter(
          (evento) =>
            evento.nome.toLowerCase().includes(query) ||
            evento.descricao.toLowerCase().includes(query)
        ),
        passados: eventosPassados.filter(
          (evento) =>
            evento.nome.toLowerCase().includes(query) ||
            evento.descricao.toLowerCase().includes(query)
        ),
        proximos: eventosProximos.filter(
          (evento) =>
            evento.nome.toLowerCase().includes(query) ||
            evento.descricao.toLowerCase().includes(query)
        ),
      });
    }
  }, [searchQuery, eventosAtivos, eventosPassados, eventosProximos]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Eventos Científicos
              </h1>
              <p className="mt-4 text-muted-foreground">
                Confira os eventos científicos da Faculdade Biopark e participe
                com suas submissões acadêmicas.
              </p>
              <div className="mt-6 flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Buscar eventos..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full rounded-full border border-input bg-background px-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="py-12 text-center">
            <p>Carregando eventos...</p>
          </div>
        ) : (
          <>
            {/* Eventos Ativos */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6">Eventos Ativos</h2>

                {filteredEventos.ativos.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEventos.ativos.map((evento) => (
                      <EventoCard key={evento.id} evento={evento} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-card rounded-lg border p-8 text-center shadow-sm">
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "Nenhum evento ativo encontrado para sua pesquisa."
                        : "Não há eventos ativos no momento. Confira os próximos eventos abaixo."}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Próximos Eventos */}
            {(filteredEventos.proximos.length > 0 || !searchQuery) && (
              <section className="py-12 bg-muted">
                <div className="container mx-auto px-4">
                  <h2 className="text-2xl font-bold mb-6">Próximos Eventos</h2>

                  {filteredEventos.proximos.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredEventos.proximos.map((evento) => (
                        <EventoCard key={evento.id} evento={evento} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-card rounded-lg border p-8 text-center shadow-sm">
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? "Nenhum evento futuro encontrado para sua pesquisa."
                          : "Não há próximos eventos planejados no momento."}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Eventos Passados */}
            {(filteredEventos.passados.length > 0 || !searchQuery) && (
              <section className="py-12">
                <div className="container mx-auto px-4">
                  <h2 className="text-2xl font-bold mb-6">Eventos Passados</h2>

                  {filteredEventos.passados.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredEventos.passados.map((evento) => (
                        <EventoCard key={evento.id} evento={evento} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-card rounded-lg border p-8 text-center shadow-sm">
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? "Nenhum evento passado encontrado para sua pesquisa."
                          : "Não há registros de eventos passados."}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
