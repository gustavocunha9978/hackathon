"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatStatus, getStatusColor } from "@/lib/utils";
import { getArtigo } from "@/lib/api";
import {
  Calendar,
  Clock,
  FileText,
  Tag,
  Users,
  Download,
  Edit,
  File,
  ArrowLeft,
  AlertTriangle,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function DetalheArtigoPage() {
  const params = useParams();
  const router = useRouter();
  const [artigo, setArtigo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [isLoadingAvaliacoes, setIsLoadingAvaliacoes] = useState(false);

  useEffect(() => {
    const fetchArtigo = async () => {
      setIsLoading(true);
      try {
        const artigoData = await getArtigo(params.id);
        if (!artigoData) {
          setError("Artigo não encontrado");
        } else {
          setArtigo(artigoData);
        }
      } catch (error) {
        console.error("Erro ao buscar artigo:", error);
        setError("Ocorreu um erro ao buscar os detalhes do artigo");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchArtigo();
    }
  }, [params.id]);

  useEffect(() => {
    const fetchAvaliacoes = async () => {
      if (
        artigo &&
        ["aprovado", "reprovado", "revisao"].includes(artigo.status)
      ) {
        setIsLoadingAvaliacoes(true);
        try {
          // Em uma implementação real, buscaria da API
          // Aqui vamos simular para demonstração
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Simulação de avaliações
          const avaliacoesSimuladas = [
            {
              id: 1,
              avaliador_id: "A1", // ID anônimo
              nota: 8.5,
              data_avaliacao: "2025-04-15",
              observacao:
                "Trabalho bem estruturado, mas com algumas oportunidades de melhoria na metodologia.",
              respostas: {
                1: "sim", // O artigo está formatado de acordo com o template
                2: "nao", // A metodologia está claramente descrita
                3: "sim", // As referências seguem o padrão ABNT
                4: "sim", // O resumo está completo
                5: 4, // Apresentação dos resultados (escala 1-5)
                6: 3, // Consistência das conclusões (escala 1-5)
                7: 4, // Significância da contribuição (escala 1-5)
                8: "A metodologia precisa ser mais detalhada, especificando melhor os procedimentos utilizados. Os resultados são interessantes, mas seria importante apresentar comparações com trabalhos anteriores.", // Comentários adicionais
              },
            },
            {
              id: 2,
              avaliador_id: "A2",
              nota: 7.0,
              data_avaliacao: "2025-04-18",
              observacao:
                "O artigo aborda um tema relevante, mas existem lacunas na revisão bibliográfica e na discussão dos resultados.",
              respostas: {
                1: "sim",
                2: "nao",
                3: "sim",
                4: "sim",
                5: 3,
                6: 3,
                7: 4,
                8: "Sugiro revisar a literatura mais recente sobre o tema, especialmente os trabalhos publicados nos últimos 2 anos. A discussão poderia explorar melhor as implicações práticas dos resultados encontrados.",
              },
            },
          ];

          setAvaliacoes(avaliacoesSimuladas);
        } catch (error) {
          console.error("Erro ao buscar avaliações:", error);
        } finally {
          setIsLoadingAvaliacoes(false);
        }
      }
    };

    fetchAvaliacoes();
  }, [artigo]);

  // Verifica se o artigo pode ser editado (somente se estiver Aguardando correção ou recém submetido)
  const podeEditar = artigo && ["aguardando_correcao"].includes(artigo.status);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Carregando detalhes do artigo...</p>
      </div>
    );
  }

  if (error || !artigo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-destructive mb-4">
          {error || "Artigo não encontrado"}
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex gap-2">
          {podeEditar && (
            <Button variant="outline" asChild>
              <Link href={`/autor/artigos/${artigo.id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          )}
          {/* <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button> */}
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl">{artigo.titulo}</CardTitle>
              <CardDescription className="mt-2">
                Versão {artigo.versao_atual.versao} • Submetido em{" "}
                {formatDate(artigo.versao_atual.data_cadastro)}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(artigo.status)}>
              {formatStatus(artigo.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Resumo</h3>
            <p className="text-muted-foreground">{artigo.resumo}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Detalhes</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Evento</p>
                    <p className="text-muted-foreground">{artigo.evento}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Área Temática</p>
                    <p className="text-muted-foreground">
                      {artigo.area_tematica}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Data de Submissão</p>
                    <p className="text-muted-foreground">
                      {formatDate(artigo.versao_atual.data_cadastro)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Status Atual</p>
                    <p className="text-muted-foreground">
                      {formatStatus(artigo.status)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Autores</h3>
              <div className="space-y-3">
                {artigo.autores.map((autor, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{autor.nome}</p>
                      <p className="text-muted-foreground">
                        Autor {index === 0 ? "Principal" : `#${index + 1}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Palavras-chave</h3>
            <div className="flex flex-wrap gap-2">
              {artigo.palavras_chave.map((palavra, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {palavra}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Arquivo</h3>
            <Card className="bg-muted">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        artigo_v{artigo.versao_atual.versao}.pdf
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Versão atual •{" "}
                        {formatDate(artigo.versao_atual.data_cadastro)}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      {artigo.status === "revisao" && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-800">
              Revisão Solicitada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-800">
              Seu artigo precisa de algumas alterações. Por favor, revise os
              comentários dos avaliadores e submeta uma nova versão.
            </p>
            <div className="mt-4 bg-white p-4 rounded-md border border-yellow-200">
              <h4 className="font-medium mb-2">Comentários do Avaliador</h4>
              <p className="text-muted-foreground">
                O artigo precisa de melhorias na metodologia e resultados. Por
                favor, revise a seção de métodos e inclua mais detalhes sobre os
                experimentos realizados.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href={`/autor/artigos/${artigo.id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Enviar Revisão
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
      {["aprovado", "reprovado", "aguardando_correcao"].includes(artigo.status) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Avaliações Recebidas</CardTitle>
            <CardDescription>
              Feedback dos avaliadores sobre seu artigo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingAvaliacoes ? (
              <div className="text-center py-6">
                <Award className="h-12 w-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
                <p>Carregando avaliações...</p>
              </div>
            ) : avaliacoes.length > 0 ? (
              <div className="space-y-8">
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Resumo das Avaliações
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card rounded-lg p-4 text-center">
                      <p className="text-muted-foreground text-sm">
                        Nota Média
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {(
                          avaliacoes.reduce((sum, av) => sum + av.nota, 0) /
                          avaliacoes.length
                        ).toFixed(1)}
                      </p>
                    </div>
                    <div className="bg-card rounded-lg p-4 text-center">
                      <p className="text-muted-foreground text-sm">
                        Quantidade de Avaliações
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {avaliacoes.length}
                      </p>
                    </div>
                    <div className="bg-card rounded-lg p-4 text-center">
                      <p className="text-muted-foreground text-sm">Status</p>
                      <Badge className={getStatusColor(artigo.status)}>
                        {formatStatus(artigo.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {avaliacoes.map((avaliacao, index) => (
                  <div
                    key={avaliacao.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-secondary/30 p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Avaliador {index + 1}</h3>
                        <Badge variant="outline" className="font-mono">
                          ID: {avaliacao.avaliador_id}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>
                            Nota: <strong>{avaliacao.nota}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Data: {formatDate(avaliacao.data_avaliacao)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t">
                      <h4 className="font-medium mb-2">Observações Gerais</h4>
                      <p className="text-muted-foreground">
                        {avaliacao.observacao}
                      </p>
                    </div>

                    <div className="p-4 border-t">
                      <h4 className="font-medium mb-4">
                        Respostas ao Checklist
                      </h4>
                      <div className="space-y-4">
                        {/* Renderização dinâmica das perguntas do checklist */}
                        {Object.entries(avaliacao.respostas).map(
                          ([perguntaId, resposta]) => {
                            // Aqui teriamos que buscar o texto da pergunta de um checklist armazenado
                            // Para demonstração, vamos usar um mapeamento estático
                            const perguntasSimuladas = {
                              1: "O artigo está formatado de acordo com o template?",
                              2: "A metodologia está claramente descrita?",
                              3: "As referências seguem o padrão da ABNT?",
                              4: "O resumo está completo e claro?",
                              5: "Os resultados são apresentados de forma adequada?",
                              6: "As conclusões são consistentes com os resultados?",
                              7: "A contribuição do trabalho para a área é significativa?",
                              8: "Comentários adicionais para os autores:",
                            };

                            const perguntaTexto =
                              perguntasSimuladas[perguntaId] ||
                              `Pergunta ${perguntaId}`;

                            // Renderização baseada no tipo de resposta
                            let respostaRenderizada;
                            if (resposta === "sim" || resposta === "nao") {
                              respostaRenderizada = (
                                <Badge
                                  className={
                                    resposta === "sim"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {resposta === "sim" ? "Sim" : "Não"}
                                </Badge>
                              );
                            } else if (typeof resposta === "number") {
                              // Resposta em escala
                              respostaRenderizada = (
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <div
                                      key={value}
                                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        value <= resposta
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-muted text-muted-foreground"
                                      }`}
                                    >
                                      {value}
                                    </div>
                                  ))}
                                </div>
                              );
                            } else {
                              // Resposta em texto
                              respostaRenderizada = (
                                <div className="bg-muted p-3 rounded-md">
                                  <p className="text-muted-foreground italic">
                                    {resposta}
                                  </p>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={perguntaId}
                                className="border-b pb-4 last:border-b-0"
                              >
                                <p className="font-medium mb-2">
                                  {perguntaTexto}
                                </p>
                                {respostaRenderizada}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Sem Avaliações Disponíveis
                </h3>
                <p className="text-muted-foreground">
                  Seu artigo ainda não recebeu avaliações ou elas ainda não
                  estão disponíveis para visualização.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {artigo.status === "aguardando_correcao" && (
        <Card className="mt-6 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">
              Orientações para Revisão
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Com base nas avaliações recebidas, você deve fazer as correções
              solicitadas e submeter uma nova versão.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-yellow-800">
            <div className="space-y-4">
              <h3 className="font-medium">
                Principais pontos a serem revisados:
              </h3>
              <ul className="space-y-2 ml-6 list-disc">
                {/* Gerar pontos com base nas respostas negativas do checklist */}
                {avaliacoes.some((av) => av.respostas[2] === "nao") && (
                  <li>
                    Melhorar a descrição da metodologia, tornando-a mais clara e
                    detalhada.
                  </li>
                )}
                {avaliacoes.some((av) => av.respostas[6] < 4) && (
                  <li>
                    Revisar a contribuição do trabalho, destacando melhor a
                    relevância e originalidade.
                  </li>
                )}
                {avaliacoes.some((av) => av.respostas[5] < 4) && (
                  <li>
                    Fortalecer a conexão entre os resultados apresentados e as
                    conclusões.
                  </li>
                )}
                <li>
                  Atentar-se aos comentários específicos dos avaliadores ao
                  realizar as correções.
                </li>
              </ul>

              <div className="bg-white p-4 rounded-md border border-yellow-200 mt-6">
                <h4 className="font-medium mb-2">Próximos Passos</h4>
                <ol className="space-y-2 ml-6 list-decimal">
                  <li>Analise cuidadosamente todas as avaliações recebidas.</li>
                  <li>
                    Faça as alterações necessárias no seu artigo, abordando os
                    pontos levantados.
                  </li>
                  <li>
                    Submeta a versão revisada do artigo utilizando o botão
                    abaixo.
                  </li>
                  <li>Aguarde a reavaliação do seu trabalho.</li>
                </ol>
              </div>

              <div className="flex justify-center mt-6">
                <Button asChild>
                  <Link href={`/autor/artigos/${artigo.id}/editar`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Enviar Revisão
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
