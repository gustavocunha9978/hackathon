'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Clock,
  ListChecks
} from 'lucide-react';

export default function AvaliacaoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const [avaliacao, setAvaliacao] = useState(null);
  const [artigo, setArtigo] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [formData, setFormData] = useState({
    nota: '',
    observacao: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checklistProgress, setChecklistProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Busca a avaliação
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

          // Simula busca de checklist para o evento associado ao artigo
          // Em um caso real, isso seria uma chamada à API
          await new Promise(resolve => setTimeout(resolve, 300));
          setChecklist({
            id: 1,
            nome: 'Checklist de Avaliação Padrão',
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
          });

          // Inicializa respostas do checklist (em caso real, buscaria respostas salvas)
          const respostasIniciais = {};
          if (avaliacaoData.respostas) {
            setRespostas(avaliacaoData.respostas);
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

  useEffect(() => {
    if (checklist) {
      const perguntasObrigatorias = checklist.perguntas.filter(p => p.obrigatoria).length;
      const perguntasRespondidasObrigatorias = checklist.perguntas
        .filter(p => p.obrigatoria)
        .filter(p => respostas[p.id] !== undefined)
        .length;
      
      const porcentagem = Math.round((perguntasRespondidasObrigatorias / perguntasObrigatorias) * 100);
      setChecklistProgress(porcentagem);
    }
  }, [respostas, checklist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChecklistResposta = (perguntaId, valor) => {
    setRespostas(prev => ({
      ...prev,
      [perguntaId]: valor
    }));
  };

  const handleEscalaChange = (perguntaId, valor) => {
    setRespostas(prev => ({
      ...prev,
      [perguntaId]: valor
    }));
  };

  const handleTextAreaChange = (perguntaId, valor) => {
    setRespostas(prev => ({
      ...prev,
      [perguntaId]: valor
    }));
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

    // Verifica se todas as perguntas obrigatórias foram respondidas
    if (checklist) {
      const perguntasObrigatorias = checklist.perguntas.filter(p => p.obrigatoria);
      for (const pergunta of perguntasObrigatorias) {
        if (respostas[pergunta.id] === undefined) {
          setError(`Por favor, responda a pergunta: "${pergunta.texto}"`);
          setIsSaving(false);
          return;
        }
      }
    }

    try {
      // Envio da avaliação
      await submitAvaliacao({
        id: avaliacao.id,
        artigo_id: avaliacao.artigo_id,
        nota: parseFloat(formData.nota),
        observacao: formData.observacao,
        respostas: respostas
      });

      setSuccess('Avaliação salva com sucesso!');
      
      // Atualiza o estado local
      setAvaliacao(prev => ({
        ...prev,
        nota: parseFloat(formData.nota),
        observacao: formData.observacao,
        data_avaliacao: new Date().toISOString().split('T')[0],
        respostas: respostas
      }));
      
      // Redireciona após alguns segundos
      setTimeout(() => {
        router.push('/avaliador/avaliacoes');
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
        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
          <p>Carregando dados da avaliação...</p>
        </div>
      </div>
    );
  }

  if (error && !avaliacao) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Erro</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const avaliacaoConcluida = avaliacao?.nota !== null;

  // Renderiza controle baseado no tipo da pergunta
  const renderPerguntaControle = (pergunta) => {
    const respostaAtual = respostas[pergunta.id];
    
    switch (pergunta.tipo) {
      case 'sim_nao':
        return (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id={`pergunta-${pergunta.id}-sim`}
                name={`pergunta-${pergunta.id}`}
                checked={respostaAtual === 'sim'}
                onChange={() => handleChecklistResposta(pergunta.id, 'sim')}
                disabled={avaliacaoConcluida || isSaving}
                className="w-4 h-4"
              />
              <label htmlFor={`pergunta-${pergunta.id}-sim`} className="text-sm">Sim</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id={`pergunta-${pergunta.id}-nao`}
                name={`pergunta-${pergunta.id}`}
                checked={respostaAtual === 'nao'}
                onChange={() => handleChecklistResposta(pergunta.id, 'nao')}
                disabled={avaliacaoConcluida || isSaving}
                className="w-4 h-4"
              />
              <label htmlFor={`pergunta-${pergunta.id}-nao`} className="text-sm">Não</label>
            </div>
          </div>
        );
      
      case 'escala':
        return (
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map(valor => (
              <div key={valor} className="flex flex-col items-center">
                <input
                  type="radio"
                  id={`pergunta-${pergunta.id}-${valor}`}
                  name={`pergunta-${pergunta.id}`}
                  checked={parseInt(respostaAtual) === valor}
                  onChange={() => handleEscalaChange(pergunta.id, valor)}
                  disabled={avaliacaoConcluida || isSaving}
                  className="w-4 h-4"
                />
                <label htmlFor={`pergunta-${pergunta.id}-${valor}`} className="text-sm mt-1">{valor}</label>
              </div>
            ))}
            <div className="flex justify-between w-full text-xs text-muted-foreground">
              <span>Ruim</span>
              <span>Excelente</span>
            </div>
          </div>
        );
      
      case 'texto':
        return (
          <Textarea
            id={`pergunta-${pergunta.id}`}
            value={respostaAtual || ''}
            onChange={(e) => handleTextAreaChange(pergunta.id, e.target.value)}
            rows={3}
            disabled={avaliacaoConcluida || isSaving}
            placeholder="Digite seu comentário..."
          />
        );
      
      default:
        return <p>Tipo de pergunta não suportado</p>;
    }
  };

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
      <form onSubmit={handleSubmit}>
        {/* Checklist de Avaliação */}
        {checklist && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Checklist de Avaliação
              </CardTitle>
              <CardDescription>
                Responda às perguntas abaixo para avaliar o artigo.
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
              
              <div className="space-y-6">
                {checklist.perguntas.map((pergunta) => (
                  <div key={pergunta.id} className="border rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor={`pergunta-${pergunta.id}`} className="text-base">
                        {pergunta.texto}
                        {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <Badge variant="outline">
                        {pergunta.tipo === 'sim_nao' ? 'Sim/Não' : 
                         pergunta.tipo === 'escala' ? 'Escala (1-5)' : 'Texto'}
                      </Badge>
                    </div>
                    {renderPerguntaControle(pergunta)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
          <CardContent className="space-y-6">
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
        </Card>
      </form>

      {/* Guia de Avaliação */}
      {!avaliacaoConcluida && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Dicas para uma boa avaliação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 mt-0.5 shrink-0"
                >
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span>Seja objetivo e imparcial na sua avaliação.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 mt-0.5 shrink-0"
                >
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span>Forneça feedback construtivo, destacando pontos fortes e oportunidades de melhoria.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 mt-0.5 shrink-0"
                >
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span>Leia o artigo completo antes de fazer a avaliação.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 mt-0.5 shrink-0"
                >
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span>Considere a relevância e originalidade da contribuição.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 mt-0.5 shrink-0"
                >
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span>Avalie a metodologia e a qualidade dos resultados apresentados.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}

      
    </div>
  );
}