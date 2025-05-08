"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getEventos } from "@/lib/api";
import {
  ArrowLeft,
  Plus,
  ListChecks,
  Trash,
  Save,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

function NovoChecklistPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventoIdParam = searchParams.get("evento");

  const [eventos, setEventos] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    evento_id: eventoIdParam || "",
    perguntas: [
      {
        texto: "O artigo está formatado de acordo com o template?",
        tipo: "sim_nao",
        obrigatoria: true,
      },
      {
        texto: "A metodologia está claramente descrita?",
        tipo: "sim_nao",
        obrigatoria: true,
      },
      {
        texto: "As referências seguem o padrão da ABNT?",
        tipo: "sim_nao",
        obrigatoria: true,
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchEventos = async () => {
      setIsLoading(true);
      try {
        const eventosData = await getEventos();
        const eventosAtivos = eventosData.filter(
          (evento) => evento.status === "ativo" || evento.status === "planejado"
        );
        setEventos(eventosAtivos);

        if (eventosAtivos.length > 0 && !formData.evento_id) {
          setFormData((prev) => ({
            ...prev,
            evento_id: String(eventosAtivos[0].id),
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        setError("Erro ao carregar eventos. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePerguntaChange = (index, field, value) => {
    const updatedPerguntas = [...formData.perguntas];
    updatedPerguntas[index] = { ...updatedPerguntas[index], [field]: value };
    setFormData((prev) => ({ ...prev, perguntas: updatedPerguntas }));
  };

  const addPergunta = () => {
    setFormData((prev) => ({
      ...prev,
      perguntas: [
        ...prev.perguntas,
        { texto: "", tipo: "sim_nao", obrigatoria: false },
      ],
    }));
  };

  const removePergunta = (index) => {
    const updatedPerguntas = [...formData.perguntas];
    updatedPerguntas.splice(index, 1);
    setFormData((prev) => ({ ...prev, perguntas: updatedPerguntas }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    // Validação básica
    if (!formData.nome || !formData.evento_id) {
      setError("Por favor, preencha os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    if (formData.perguntas.length === 0) {
      setError("Adicione pelo menos uma pergunta ao checklist.");
      setIsSubmitting(false);
      return;
    }

    // Valida se todas as perguntas têm texto
    const perguntasVazias = formData.perguntas.some((p) => !p.texto.trim());
    if (perguntasVazias) {
      setError("Todas as perguntas devem ter um texto.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulação de criação do checklist
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Aqui seria feita a chamada à API

      setSuccess("Checklist criado com sucesso!");

      // Redireciona após alguns segundos
      setTimeout(() => {
        router.push("/coordenador/checklists");
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar checklist:", error);
      setError("Ocorreu um erro ao criar o checklist. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Novo Checklist</h2>
        <p className="text-muted-foreground mt-2">
          Crie um novo checklist de avaliação para os artigos.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Defina o nome, descrição e evento associado ao checklist.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-100 text-green-800 p-4 rounded-md flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Checklist *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Critérios de Avaliação Técnica"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  rows={3}
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descreva o propósito deste checklist..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evento_id">Evento Associado *</Label>
                <Select
                  value={formData.evento_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, evento_id: value }))
                  }
                  disabled={isSubmitting}
                  required
                >
                  <SelectTrigger id="evento_id">
                    <SelectValue placeholder="Selecione um evento" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventos.length > 0 ? (
                      eventos.map((evento) => (
                        <SelectItem key={evento.id} value={String(evento.id)}>
                          {evento.nome}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Nenhum evento disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Perguntas do Checklist</CardTitle>
                <CardDescription>
                  Adicione as perguntas que farão parte do checklist de
                  avaliação.
                </CardDescription>
              </div>
              <Button
                type="button"
                onClick={addPergunta}
                disabled={isSubmitting}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Pergunta
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.perguntas.length > 0 ? (
                  formData.perguntas.map((pergunta, index) => (
                    <div
                      key={index}
                      className="space-y-4 p-4 border rounded-md"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`pergunta-${index}`}>
                            Pergunta {index + 1}
                          </Label>
                          <Textarea
                            id={`pergunta-${index}`}
                            value={pergunta.texto}
                            onChange={(e) =>
                              handlePerguntaChange(
                                index,
                                "texto",
                                e.target.value
                              )
                            }
                            placeholder="Digite a pergunta..."
                            disabled={isSubmitting}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePergunta(index)}
                          disabled={
                            isSubmitting || formData.perguntas.length === 1
                          }
                          className="shrink-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`tipo-${index}`}>
                            Tipo de Resposta
                          </Label>
                          <Select
                            value={pergunta.tipo}
                            onValueChange={(value) =>
                              handlePerguntaChange(index, "tipo", value)
                            }
                            disabled={isSubmitting}
                          >
                            <SelectTrigger
                              id={`tipo-${index}`}
                              className="w-[180px]"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sim_nao">Sim/Não</SelectItem>
                              <SelectItem value="escala">
                                Escala (1-5)
                              </SelectItem>
                              <SelectItem value="texto">Texto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                          <Checkbox
                            id={`obrigatoria-${index}`}
                            checked={pergunta.obrigatoria}
                            onCheckedChange={(checked) =>
                              handlePerguntaChange(
                                index,
                                "obrigatoria",
                                checked
                              )
                            }
                            disabled={isSubmitting}
                          />
                          <Label
                            htmlFor={`obrigatoria-${index}`}
                            className="text-sm font-normal"
                          >
                            Resposta obrigatória
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <ListChecks className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Nenhuma pergunta adicionada.
                    </p>
                    <Button
                      type="button"
                      onClick={addPergunta}
                      className="mt-4"
                      disabled={isSubmitting}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Pergunta
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                      </svg>
                    </span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Checklist
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NovoChecklistPage />
    </Suspense>
  );
}
