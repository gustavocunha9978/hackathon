'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getEventos } from '@/lib/api';
import { ArrowLeft, Plus, Trash, Save, AlertTriangle, CheckCircle } from 'lucide-react';

// Reutilizando a mesma função simulada da página de detalhes
const getChecklist = async (id) => {
  // Em um caso real, isso seria uma chamada API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const checklists = [
    {
      id: 1,
      nome: 'Checklist de Avaliação Padrão',
      descricao: 'Critérios para avaliação básica de todos os artigos submetidos ao congresso.',
      evento_id: 1,
      evento_nome: 'Congresso Biopark de Inovação 2025',
      criado_em: '2025-03-15',
      ultima_atualizacao: '2025-04-10',
      perguntas: [
        { id: 1, texto: 'O artigo está formatado de acordo com o template?', tipo: 'sim_nao', obrigatoria: true },
        { id: 2, texto: 'A metodologia está claramente descrita?', tipo: 'sim_nao', obrigatoria: true },
        { id: 3, texto: 'As referências seguem o padrão da ABNT?', tipo: 'sim_nao', obrigatoria: true },
        { id: 4, texto: 'O resumo está completo e claro?', tipo: 'sim_nao', obrigatoria: true },
        { id: 5, texto: 'Os resultados são apresentados de forma adequada?', tipo: 'escala', obrigatoria: true },
        { id: 6, texto: 'As conclusões são consistentes com os resultados?', tipo: 'escala', obrigatoria: true },
        { id: 7, texto: 'A contribuição do trabalho para a área é significativa?', tipo: 'escala', obrigatoria: true },
        { id: 8, texto: 'Comentários adicionais para os autores:', tipo: 'texto', obrigatoria: false }
      ]
    },
    // ... outros checklists omitidos para brevidade
  ];
  
  return checklists.find(c => c.id === parseInt(id)) || null;
};

export default function EditarChecklistPage() {
  const params = useParams();
  const router = useRouter();
  
  const [eventos, setEventos] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    evento_id: '',
    perguntas: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Busca o checklist
        const checklistData = await getChecklist(parseInt(params.id));
        if (!checklistData) {
          setError('Checklist não encontrado');
        } else {
          // Preenche o formulário com os dados do checklist
          setFormData({
            nome: checklistData.nome,
            descricao: checklistData.descricao || '',
            evento_id: String(checklistData.evento_id),
            perguntas: checklistData.perguntas
          });
        }
        
        // Busca eventos para o select
        const eventosData = await getEventos();
        const eventosAtivos = eventosData.filter(evento => 
          evento.status === 'ativo' || evento.status === 'planejado'
        );
        setEventos(eventosAtivos);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePerguntaChange = (index, field, value) => {
    const updatedPerguntas = [...formData.perguntas];
    updatedPerguntas[index] = { ...updatedPerguntas[index], [field]: value };
    setFormData(prev => ({ ...prev, perguntas: updatedPerguntas }));
  };

  const addPergunta = () => {
    // Gerar um ID simulado para a nova pergunta
    const newId = Math.max(0, ...formData.perguntas.map(p => p.id)) + 1;
    
    setFormData(prev => ({
      ...prev,
      perguntas: [
        ...prev.perguntas, 
        { id: newId, texto: '', tipo: 'sim_nao', obrigatoria: false }
      ]
    }));
  };

  const removePergunta = (index) => {
    const updatedPerguntas = [...formData.perguntas];
    updatedPerguntas.splice(index, 1);
    setFormData(prev => ({ ...prev, perguntas: updatedPerguntas }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Validação básica
    if (!formData.nome || !formData.evento_id) {
      setError('Por favor, preencha os campos obrigatórios.');
      setIsSubmitting(false);
      return;
    }

    if (formData.perguntas.length === 0) {
      setError('Adicione pelo menos uma pergunta ao checklist.');
      setIsSubmitting(false);
      return;
    }

    // Valida se todas as perguntas têm texto
    const perguntasVazias = formData.perguntas.some(p => !p.texto.trim());
    if (perguntasVazias) {
      setError('Todas as perguntas devem ter um texto.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulação de atualização do checklist
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui seria feita a chamada à API
      
      setSuccess('Checklist atualizado com sucesso!');
      
      // Redireciona após alguns segundos
      setTimeout(() => {
        router.push(`/coordenador/checklists/${params.id}`);
      }, 2000);
    } catch (error) {
      console.error('Erro ao atualizar checklist:', error);
      setError('Ocorreu um erro ao atualizar o checklist. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error && !formData.nome) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Erro</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
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
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Editar Checklist</h2>
        <p className="text-muted-foreground mt-2">
          Atualize as informações e perguntas do checklist de avaliação.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Edite o nome, descrição e evento associado ao checklist.
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
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evento_id">Evento Associado *</Label>
              <Select 
                value={formData.evento_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, evento_id: value }))}
                disabled={isSubmitting}
                required
              >
                <SelectTrigger id="evento_id">
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent>
                  {eventos.length > 0 ? (
                    eventos.map(evento => (
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
                Edite ou adicione novas perguntas para o checklist de avaliação.
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
                  <div key={pergunta.id} className="space-y-4 p-4 border rounded-md">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`pergunta-${index}`}>Pergunta {index + 1}</Label>
                        <Textarea
                          id={`pergunta-${index}`}
                          value={pergunta.texto}
                          onChange={(e) => handlePerguntaChange(index, 'texto', e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePergunta(index)}
                        disabled={isSubmitting || formData.perguntas.length === 1}
                        className="shrink-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`tipo-${index}`}>Tipo de Resposta</Label>
                        <Select 
                          value={pergunta.tipo} 
                          onValueChange={(value) => handlePerguntaChange(index, 'tipo', value)}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger id={`tipo-${index}`} className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sim_nao">Sim/Não</SelectItem>
                            <SelectItem value="escala">Escala (1-5)</SelectItem>
                            <SelectItem value="texto">Texto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <Checkbox 
                          id={`obrigatoria-${index}`}
                          checked={pergunta.obrigatoria}
                          onCheckedChange={(checked) => handlePerguntaChange(index, 'obrigatoria', checked)}
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
                  Salvar Alterações
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}