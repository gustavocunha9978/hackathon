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
} from "lucide-react";
import Link from "next/link";

export default function DetalheArtigoPage() {
  const params = useParams();
  const router = useRouter();
  const [artigo, setArtigo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Verifica se o artigo pode ser editado (somente se estiver em revisão ou recém submetido)
  const podeEditar = artigo && ["submetido", "revisao"].includes(artigo.status);

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
    </div>
  );
}
