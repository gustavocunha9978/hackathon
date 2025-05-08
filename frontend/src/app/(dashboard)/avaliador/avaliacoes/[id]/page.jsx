'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getAvaliacao, getArtigo, submitAvaliacao } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  FileText,
  Download,
  Award,
  Tag,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

export default function AvaliacaoPage() {
  const params = useParams();
  const router = useRouter();
  const [avaliacao, setAvaliacao] = useState(null);
  const [artigo, setArtigo] = useState(null);
  const [formData, setFormData] = useState({
    nota: '',
    observacao: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const avaliacaoData = await getAvaliacao(params.id);
        
        if (!avaliacaoData) {
          setError('Avaliação não encontrada');
        } else {
          setAvaliacao(avaliacaoData);
          
          // Preenche o formulário se já houver uma avaliação
          if (avaliacaoData.nota !== null) {
            setFormData({
              nota: avaliacaoData.nota,
              observacao: avaliacaoData.observacao || '',
            });
          }
          
          // Busca os detalhes do artigo
          const artigoData = await getArtigo(avaliacaoData.artigo_id);
          if (artigoData) {
            setArtigo(artigoData);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Ocorreu um erro ao buscar os detalhes da avaliação');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    // Validação básica
    if (!formData.nota || parseFloat(formData.nota) < 0 || parseFloat(formData.nota) > 10) {
      setError('Por favor, insira uma nota válida entre 0 e 10.');
      setIsSaving(false);
      return;
    }

    try {
      // Envio da avaliação
      await submitAvaliacao({
        id: avaliacao.id,
        artigo_id: avaliacao.artigo_id,
        nota: parseFloat(formData.nota),
        observacao: formData.observacao,
      });

      setSuccess('Avaliação salva com sucesso!');
      
      // Atualiza o estado local
      setAvaliacao(prev => ({
        ...prev,
        nota: parseFloat(formData.nota),
        observacao: formData.observacao,
        data_avaliacao: new Date().toISOString().split('T')[0],
      }));
      
      // Redireciona após alguns segundos
      setTimeout(() => {
        router.push('/avaliador');
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      setError('Ocorreu um erro ao salvar a avaliação. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error && !avaliacao) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
  }

  const avaliacaoConcluida = avaliacao?.nota !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        {artigo && (
          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Download Artigo
          </Button>
        )}
      </div>

      {/* Detalhes do Artigo */}
      {artigo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{artigo.titulo}</CardTitle>
            <CardDescription>
              Artigo #{artigo.id} • Submetido em {formatDate(artigo.versao_atual.data_cadastro)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Resumo</h3>
              <p className="text-muted-foreground">{artigo.resumo}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Área Temática</p>
                  <p className="text-muted-foreground">{artigo.area_tematica}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Palavras-chave</h3>
                <div className="flex flex-wrap gap-2">
                  {artigo.palavras_chave.map((palavra, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {palavra}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Avaliação */}
      <Card>
        <CardHeader>
          <CardTitle>
            {avaliacaoConcluida ? 'Detalhes da Avaliação' : 'Avaliar Artigo'}
          </CardTitle>
          <CardDescription>
            {avaliacaoConcluida 
              ? `Avaliação realizada em ${formatDate(avaliacao.data_avaliacao)}` 
              : 'Preencha o formulário abaixo para avaliar este artigo'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
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
              <Label htmlFor="nota">Nota (0-10) *</Label>
              <Input
                id="nota"
                name="nota"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.nota}
                onChange={handleChange}
                disabled={avaliacaoConcluida || isSaving}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacao">Comentários e Observações *</Label>
              <Textarea
                id="observacao"
                name="observacao"
                rows={6}
                value={formData.observacao}
                onChange={handleChange}
                placeholder="Forneça feedback detalhado sobre o artigo, incluindo pontos fortes e sugestões de melhoria..."
                disabled={avaliacaoConcluida || isSaving}
                required
              />
              {!avaliacaoConcluida && (
                <p className="text-sm text-muted-foreground">
                  Estes comentários serão compartilhados com os autores (de forma anônima) e com os coordenadores do evento.
                </p>
              )}
            </div>
          </CardContent>
          {!avaliacaoConcluida && (
            <CardFooter className="flex justify-end gap-4">
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
                    <Award className="mr-2 h-4 w-4" />
                    Submeter Avaliação
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
}