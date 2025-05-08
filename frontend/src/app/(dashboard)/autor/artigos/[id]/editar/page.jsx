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
import { getArtigo } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash,
  Upload,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function EditarArtigoPage() {
  const params = useParams();
  const router = useRouter();

  const [artigo, setArtigo] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    resumo: "",
    area_tematica: "",
    palavras_chave: "",
    arquivo: null,
  });

  const [coautores, setCoautores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchArtigo = async () => {
      setIsLoading(true);
      try {
        const artigoData = await getArtigo(params.id);
        if (!artigoData) {
          setError("Artigo não encontrado");
        } else {
          setArtigo(artigoData);

          // Preenche o formulário com os dados do artigo
          setFormData({
            titulo: artigoData.titulo,
            resumo: artigoData.resumo,
            area_tematica: artigoData.area_tematica,
            palavras_chave: artigoData.palavras_chave.join(", "),
            arquivo: null,
          });

          // Preenche os coautores
          if (artigoData.autores && artigoData.autores.length > 1) {
            setCoautores(
              artigoData.autores.slice(1).map((autor) => ({
                nome: autor.nome,
                email: autor.email || "",
              }))
            );
          }
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
    setIsSaving(true);
    setError("");
    setSuccess("");

    // Validações básicas
    if (!formData.titulo || !formData.resumo || !formData.area_tematica) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsSaving(false);
      return;
    }

    try {
      // Simulação de atualização do artigo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Processamento das palavras-chave
      const palavrasChaveArray = formData.palavras_chave
        .split(",")
        .map((palavra) => palavra.trim())
        .filter((palavra) => palavra.length > 0);

      // Em uma implementação real, aqui faria uma chamada para a API
      // para atualizar o artigo

      setSuccess("Artigo atualizado com sucesso!");

      // Redireciona após alguns segundos
      setTimeout(() => {
        router.push(`/autor/artigos/${params.id}`);
      }, 2000);
    } catch (error) {
      console.error("Erro ao atualizar artigo:", error);
      setError("Ocorreu um erro ao atualizar seu artigo. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Clock className="mx-auto h-10 w-10 text-muted-foreground animate-spin" />
          <p className="mt-4">Carregando dados do artigo...</p>
        </div>
      </div>
    );
  }

  if (error && !artigo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
          <p className="mt-4 text-destructive">{error}</p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Verifica se o artigo pode ser editado (somente se estiver Aguardando correção ou recém submetido)
  const podeEditar = artigo && ["submetido", "revisao"].includes(artigo.status);

  if (!podeEditar) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold">
            Artigo não pode ser editado
          </h2>
          <p className="mt-2 text-muted-foreground">
            Este artigo não pode ser editado no momento devido ao seu status
            atual.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
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
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Editar Artigo</h2>
        <p className="text-muted-foreground mt-2">
          Atualize as informações do seu artigo e envie uma nova versão.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Artigo</CardTitle>
            <CardDescription>
              Edite os detalhes principais sobre seu trabalho.
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
              <Label htmlFor="titulo">Título do Artigo *</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                disabled={isSaving}
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
                disabled={isSaving}
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
                disabled={isSaving}
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
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arquivo">
                Arquivo PDF do Artigo (Nova Versão) *
              </Label>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  id="arquivo"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={isSaving}
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Somente arquivos PDF são aceitos. Tamanho máximo: 10MB.
                {artigo?.versao_atual && (
                  <span className="block mt-1">
                    Versão atual: {artigo.versao_atual.versao} (enviada em{" "}
                    {formatDate(artigo.versao_atual.data_cadastro)})
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Coautores</CardTitle>
            <CardDescription>
              Adicione ou edite os coautores do artigo, se houver.
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
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCoautor(index)}
                      disabled={isSaving}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
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
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                disabled={isSaving}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Coautor
              </Button>
            </div>
          </CardContent>
        </Card>

        {artigo.status === "revisao" && (
          <Card className="mt-6 bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800">
                Comentários do Avaliador
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Leia os comentários dos avaliadores e faça as correções
                necessárias.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-yellow-800">
              <div className="bg-white p-4 rounded-md border border-yellow-200">
                <h4 className="font-medium mb-2">Observações</h4>
                <p className="text-muted-foreground">
                  {artigo.comentarios_avaliador ||
                    "O artigo precisa de melhorias na metodologia e resultados. Por favor, revise a seção de métodos e inclua mais detalhes sobre os experimentos realizados."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
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
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
