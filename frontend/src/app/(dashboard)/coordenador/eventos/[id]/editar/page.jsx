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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getEvento } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  Save,
  Trash,
  AlertTriangle,
  CheckCircle,
  Image,
  Upload,
  Award
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';

export default function EditarEventoPage() {
  const params = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    status: '',
    banner: null
  });
  
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchEvento = async () => {
      setIsLoading(true);
      try {
        const eventData = await getEvento(params.id);
        if (!eventData) {
          setError('Evento não encontrado');
        } else {
          // Formata as datas para o formato esperado pelo input date (YYYY-MM-DD)
          const formatDateToInput = (dateString) => {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
          };
          
          setFormData({
            nome: eventData.nome,
            descricao: eventData.descricao || '',
            data_inicio: formatDateToInput(eventData.data_inicio),
            data_fim: formatDateToInput(eventData.data_fim),
            status: eventData.status,
            banner: null // O arquivo atual não é carregado
          });
          
          // Define a URL de preview do banner se existir
          if (eventData.banner) {
            setPreviewUrl(eventData.banner);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar evento:', error);
        setError('Ocorreu um erro ao buscar os detalhes do evento');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchEvento();
    }
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Gera uma URL para preview da imagem
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setFormData(prev => ({ ...prev, banner: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Validações básicas
    if (!formData.nome || !formData.descricao || !formData.data_inicio || !formData.data_fim || !formData.status) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setIsSubmitting(false);
      return;
    }

    // Verifica se a data de término é posterior à data de início
    if (new Date(formData.data_fim) <= new Date(formData.data_inicio)) {
      setError('A data de término deve ser posterior à data de início.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulação de atualização de evento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui seria feita a chamada à API para atualizar o evento
      // const updatedEvento = await updateEvento(params.id, formData);
      
      setSuccess('Evento atualizado com sucesso!');
      
      // Redireciona após alguns segundos
      setTimeout(() => {
        router.push(`/coordenador/eventos/${params.id}`);
      }, 2000);
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      setError('Ocorreu um erro ao atualizar o evento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      // Simulação de exclusão de evento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui seria feita a chamada à API para excluir o evento
      // await deleteEvento(params.id);
      
      setConfirmDeleteDialog(false);
      
      // Redireciona para a lista de eventos
      router.push('/coordenador/eventos');
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      setError('Ocorreu um erro ao excluir o evento. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Carregando dados do evento...</p>
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
        <h2 className="text-3xl font-bold tracking-tight">Editar Evento</h2>
        <p className="text-muted-foreground mt-2">
          Atualize as informações do evento.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Evento</CardTitle>
            <CardDescription>
              Edite os detalhes básicos do evento.
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
              <Label htmlFor="nome">Nome do Evento *</Label>
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
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                name="descricao"
                rows={4}
                value={formData.descricao}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data de Início *</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="data_inicio"
                    name="data_inicio"
                    type="date"
                    value={formData.data_inicio}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fim">Data de Término *</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="data_fim"
                    name="data_fim"
                    type="date"
                    value={formData.data_fim}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                disabled={isSubmitting}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejado">Planejado</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="encerrado">Encerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner">Banner do Evento</Label>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  id="banner"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Recomendado: imagem de 1200 x 400 pixels no formato JPEG ou PNG.
              </p>
              
              {/* Preview do Banner */}
              {previewUrl && (
                <div className="mt-4 rounded-md overflow-hidden border">
                  <div className="relative aspect-[3/1] bg-muted">
                    <img 
                      src={previewUrl} 
                      alt="Preview do Banner" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog open={confirmDeleteDialog} onOpenChange={setConfirmDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" type="button" disabled={isSubmitting}>
                  <Trash className="mr-2 h-4 w-4" />
                  Excluir Evento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Exclusão</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja excluir o evento <span className="font-semibold">{formData.nome}</span>?
                    Esta ação não pode ser desfeita e todos os dados associados, incluindo artigos submetidos, serão perdidos.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDeleteDialog(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Excluindo...' : 'Sim, Excluir Evento'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
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

      <Card>
        <CardHeader>
          <CardTitle>Opções Avançadas</CardTitle>
          <CardDescription>
            Configurações adicionais para o evento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <Link href={`/coordenador/eventos/${params.id}/avaliadores`}>
                <Award className="mr-2 h-4 w-4" />
                Gerenciar Avaliadores
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href={`/coordenador/checklists/novo?evento=${params.id}`}>
                <Upload className="mr-2 h-4 w-4" />
                Criar Checklist
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}