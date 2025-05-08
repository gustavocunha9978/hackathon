"use client";

import { useState, useEffect } from "react";
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
import { getEventos, createArtigo } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Upload, AlertTriangle, CheckCircle } from "lucide-react";

export default function SubmissaoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventoParam = searchParams.get("evento");

  const [formData, setFormData] = useState({
    titulo: "",
    resumo: "",
    area_tematica: "",
    palavras_chave: "",
    evento_id: eventoParam || "",
    arquivo: null,
  });

  const [eventos, setEventos] = useState([]);
  const [coautores, setCoautores] = useState([{ nome: "", email: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const eventosData = await getEventos();
        const eventosAtivos = eventosData.filter(
          (evento) => evento.status === "ativo"
        );
        setEventos(eventosAtivos);

        // Se não tem evento selecionado e há eventos ativos, seleciona o primeiro
        if (!formData.evento_id && eventosAtivos.length > 0) {
          setFormData((prev) => ({
            ...prev,
            evento_id: String(eventosAtivos[0].id),
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        setError("Não foi possível carregar os eventos disponíveis.");
      }
    };

    fetchEventos();
  }, [formData.evento_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoautorChange = (index, field, value) => {
    const updatedCoautores = [...coautores];
    updatedCoautores[index] = { ...updatedCoautores[index], [field]: value };
    setCoautores(updatedCoautores);
  };

  const addCoautor = () => {
    setCoautores([...coautores, { nome: "", email: "" }]);
  };

  const removeCoautor = (index) => {
    const updatedCoautores = [...coautores];
    updatedCoautores.splice(index, 1);
    setCoautores(updatedCoautores);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, arquivo: file }));
      setError("");
    } else {
      setFormData((prev) => ({ ...prev, arquivo: null }));
      setError("Por favor, selecione um arquivo PDF válido.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    // Validações básicas
    if (
      !formData.titulo ||
      !formData.resumo ||
      !formData.area_tematica ||
      !formData.evento_id ||
      !formData.arquivo
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const user = getUser();
      const palavrasChaveArray = formData.palavras_chave
        .split(",")
        .map((palavra) => palavra.trim())
        .filter((palavra) => palavra.length > 0);

      // Simula o envio do artigo
      const novoArtigo = await createArtigo({
        titulo: formData.titulo,
        resumo: formData.resumo,
        area_tematica: formData.area_tematica,
        evento_id: parseInt(formData.evento_id),
        palavras_chave: palavrasChaveArray,
        autores: [
          { id: user.id, nome: user.name },
          ...coautores
            .filter((coautor) => coautor.nome && coautor.email)
            .map((coautor, index) => ({
              id: 1000 + index,
              nome: coautor.nome,
            })),
        ],
        // Na versão real, aqui teria o upload do arquivo
        arquivo: formData.arquivo.name,
      });

      setSuccess("Artigo submetido com sucesso!");

      // Limpa o formulário após sucesso
      setTimeout(() => {
        router.push(`/autor/artigos/${novoArtigo.id}`);
      }, 2000);
    } catch (error) {
      console.error("Erro ao submeter artigo:", error);
      setError("Ocorreu um erro ao submeter seu artigo. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nova Submissão</h2>
        <p className="text-muted-foreground mt-2">
          Preencha o formulário abaixo para submeter seu artigo científico.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Artigo</CardTitle>
            <CardDescription>
              Forneça os detalhes principais sobre seu trabalho.
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
              <Label htmlFor="evento_id">Evento *</Label>
              <Select
                value={formData.evento_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, evento_id: value }))
                }
                disabled={isSubmitting}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent>
                  {eventos.length > 0 ? (
                    eventos.map((evento) => (
                      // <SelectItem key={evento.id} value={String(evento.id)}>
                      <SelectItem key={evento.id} value={String(evento.id)}>
                        {evento.nome}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value={null} disabled>
                      Nenhum evento disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Artigo *</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resumo">Resumo *</Label>
              <Textarea
                id="resumo"
                name="resumo"
                rows={5}
                value={formData.resumo}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area_tematica">Área Temática *</Label>
              <Input
                id="area_tematica"
                name="area_tematica"
                value={formData.area_tematica}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="palavras_chave">
                Palavras-chave (separadas por vírgula)
              </Label>
              <Input
                id="palavras_chave"
                name="palavras_chave"
                value={formData.palavras_chave}
                onChange={handleChange}
                placeholder="Ex: inteligência artificial, saúde, tecnologia"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arquivo">Arquivo PDF do Artigo *</Label>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  id="arquivo"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Somente arquivos PDF são aceitos. Tamanho máximo: 10MB.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Coautores</CardTitle>
            <CardDescription>
              Adicione os coautores do artigo, se houver.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coautores.map((coautor, index) => (
                <div
                  key={index}
                  className="space-y-4 p-4 border rounded-md bg-secondary/20"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Coautor {index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCoautor(index)}
                        disabled={isSubmitting}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`coautor-nome-${index}`}>Nome</Label>
                      <Input
                        id={`coautor-nome-${index}`}
                        value={coautor.nome}
                        onChange={(e) =>
                          handleCoautorChange(index, "nome", e.target.value)
                        }
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`coautor-email-${index}`}>E-mail</Label>
                      <Input
                        id={`coautor-email-${index}`}
                        type="email"
                        value={coautor.email}
                        onChange={(e) =>
                          handleCoautorChange(index, "email", e.target.value)
                        }
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addCoautor}
                className="mt-2"
                disabled={isSubmitting}
              >
                Adicionar Coautor
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
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
                Submetendo...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submeter Artigo
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
