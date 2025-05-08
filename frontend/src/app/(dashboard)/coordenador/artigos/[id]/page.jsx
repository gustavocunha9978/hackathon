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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getArtigo, getUsuarios } from "@/lib/api";
import { formatDate, formatStatus, getStatusColor } from "@/lib/utils";
import {
  Calendar,
  Clock,
  FileText,
  Tag,
  Users,
  Download,
  ChevronLeft,
  Award,
  BarChart,
  Mail,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function ArtigoDetalhesPage() {
  const params = useParams();
  const router = useRouter();

  const [artigo, setArtigo] = useState(null);
  const [avaliadores, setAvaliadores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusDialog, setStatusDialog] = useState(false);
  const [avaliadoresDialog, setAvaliadoresDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [selectedAvaliadores, setSelectedAvaliadores] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Busca os detalhes do artigo
        const artigoData = await getArtigo(params.id);
        if (!artigoData) {
          setError("Artigo não encontrado");
        } else {
          setArtigo(artigoData);
          setSelectedStatus(artigoData.status);

          // Busca usuários que podem ser avaliadores
          const usuariosData = await getUsuarios();
          const avaliadoresData = usuariosData.filter((user) =>
            user.cargos.includes("avaliador")
          );
          setAvaliadores(avaliadoresData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Ocorreu um erro ao buscar os detalhes do artigo");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleStatusChange = async () => {
    setIsSubmitting(true);
    try {
      // Simulação de atualização do status
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Atualiza o estado local
      setArtigo((prev) => ({
        ...prev,
        status: selectedStatus,
      }));

      setSuccess(`Status atualizado para "${formatStatus(selectedStatus)}"`);
      setStatusDialog(false);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setError("Ocorreu um erro ao atualizar o status do artigo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvaliadoresAssign = async () => {
    setIsSubmitting(true);
    try {
      // Simulação de atribuição de avaliadores
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(`Avaliadores atribuídos com sucesso!`);
      setAvaliadoresDialog(false);
    } catch (error) {
      console.error("Erro ao atribuir avaliadores:", error);
      setError("Ocorreu um erro ao atribuir avaliadores");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex gap-2">
          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md flex items-start gap-2">
          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Detalhes</h3>
              <div className="space-y-3">
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
        </CardContent>
      </Card>

      {/* Ações do Coordenador */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gerenciar Status</CardTitle>
            <CardDescription>
              Altere o status do artigo e notifique os autores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status Atual</p>
                  <p className="text-muted-foreground">
                    {formatStatus(artigo.status)}
                  </p>
                </div>
                <Dialog open={statusDialog} onOpenChange={setStatusDialog}>
                  <DialogTrigger asChild>
                    <Button>Alterar Status</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alterar Status do Artigo</DialogTitle>
                      <DialogDescription>
                        Selecione o novo status e adicione uma observação se
                        necessário.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Novo Status</Label>
                        <Select
                          value={selectedStatus}
                          onValueChange={setSelectedStatus}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submetido">
                              Aguardando avaliação
                            </SelectItem>
                            <SelectItem value="aguardando_correcao">
                              Aguardando correção
                            </SelectItem>
                            <SelectItem value="aprovado">Aprovado</SelectItem>
                            <SelectItem value="reprovado">Reprovado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="note">Observação (opcional)</Label>
                        <Textarea
                          id="note"
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                          placeholder="Adicione uma observação aos autores..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setStatusDialog(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleStatusChange}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gerenciar Avaliadores</CardTitle>
            <CardDescription>
              Atribua avaliadores para revisar este artigo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Avaliadores Atribuídos</p>
                  <p className="text-muted-foreground">
                    {artigo.avaliadores ? artigo.avaliadores.length : 0}{" "}
                    avaliadores
                  </p>
                </div>
                <Dialog
                  open={avaliadoresDialog}
                  onOpenChange={setAvaliadoresDialog}
                >
                  <DialogTrigger asChild>
                    <Button>Atribuir Avaliadores</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Atribuir Avaliadores</DialogTitle>
                      <DialogDescription>
                        Selecione os avaliadores para revisar este artigo.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="max-h-[300px] overflow-auto space-y-2">
                        {avaliadores.map((avaliador) => (
                          <div
                            key={avaliador.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`avaliador-${avaliador.id}`}
                              value={avaliador.id}
                              checked={selectedAvaliadores.includes(
                                avaliador.id
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAvaliadores([
                                    ...selectedAvaliadores,
                                    avaliador.id,
                                  ]);
                                } else {
                                  setSelectedAvaliadores(
                                    selectedAvaliadores.filter(
                                      (id) => id !== avaliador.id
                                    )
                                  );
                                }
                              }}
                              className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                            />
                            <label
                              htmlFor={`avaliador-${avaliador.id}`}
                              className="text-sm"
                            >
                              {avaliador.nome} ({avaliador.email})
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setAvaliadoresDialog(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAvaliadoresAssign}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Salvando..." : "Confirmar Atribuição"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Avaliações</CardTitle>
          <CardDescription>
            Visualize as avaliações recebidas para este artigo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {artigo.avaliacoes && artigo.avaliacoes.length > 0 ? (
            <div className="space-y-4">
              {artigo.avaliacoes.map((avaliacao, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        Avaliador #{index + 1}
                      </span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Nota: {avaliacao.nota}/10
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    {avaliacao.observacao}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Avaliado em {formatDate(avaliacao.data_avaliacao)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                Este artigo ainda não recebeu avaliações.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações adicionais em botões */}
      <div className="flex flex-wrap gap-4">
        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Enviar E-mail aos Autores
        </Button>
        <Button variant="outline">
          <BarChart className="mr-2 h-4 w-4" />
          Ver Estatísticas de Avaliação
        </Button>
      </div>
    </div>
  );
}
