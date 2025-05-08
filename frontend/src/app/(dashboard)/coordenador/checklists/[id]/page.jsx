'use client';

import { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  ListChecks, 
  CheckCircle2, 
  CheckCheck,
  AlertTriangle
} from 'lucide-react';

// Simula buscar um checklist pelo ID
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
      {
        id: 2,
        nome: 'Critérios de Qualidade Técnica',
        descricao: 'Checklist específico para avaliação de aspectos técnicos dos artigos.',
        evento_id: 1,
        evento_nome: 'Congresso Biopark de Inovação 2025',
        criado_em: '2025-03-18',
        ultima_atualizacao: '2025-03-18',
        perguntas: [
          { id: 1, texto: 'A metodologia utilizada é adequada?', tipo: 'escala', obrigatoria: true },
          { id: 2, texto: 'Os experimentos são reproduzíveis?', tipo: 'sim_nao', obrigatoria: true },
          { id: 3, texto: 'Os dados estão bem organizados e apresentados?', tipo: 'escala', obrigatoria: true },
          { id: 4, texto: 'A análise estatística é adequada?', tipo: 'escala', obrigatoria: true },
          { id: 5, texto: 'As limitações do estudo são discutidas?', tipo: 'sim_nao', obrigatoria: true },
          { id: 6, texto: 'As conclusões são justificadas pelos dados?', tipo: 'sim_nao', obrigatoria: true },
          { id: 7, texto: 'O trabalho apresenta originalidade?', tipo: 'escala', obrigatoria: true },
          { id: 8, texto: 'O trabalho traz contribuições relevantes para a área?', tipo: 'escala', obrigatoria: true },
          { id: 9, texto: 'A literatura citada é atual e relevante?', tipo: 'sim_nao', obrigatoria: true },
          { id: 10, texto: 'A qualidade da escrita e da apresentação é adequada?', tipo: 'escala', obrigatoria: true },
          { id: 11, texto: 'Há problemas éticos identificados?', tipo: 'sim_nao', obrigatoria: true },
          { id: 12, texto: 'Comentários para os autores:', tipo: 'texto', obrigatoria: false }
        ]
      },
      {
        id: 3,
        nome: 'Checklist para Artigos de Pesquisa',
        descricao: 'Critérios específicos para avaliação de artigos de pesquisa científica.',
        evento_id: 2,
        evento_nome: 'Simpósio de Pesquisa Acadêmica',
        criado_em: '2025-04-02',
        ultima_atualizacao: '2025-04-15',
        perguntas: [
          { id: 1, texto: 'O problema de pesquisa está claramente definido?', tipo: 'sim_nao', obrigatoria: true },
          { id: 2, texto: 'Os objetivos da pesquisa estão claramente definidos?', tipo: 'sim_nao', obrigatoria: true },
          { id: 3, texto: 'A revisão de literatura é abrangente e atual?', tipo: 'escala', obrigatoria: true },
          { id: 4, texto: 'A metodologia é adequada aos objetivos?', tipo: 'escala', obrigatoria: true },
          { id: 5, texto: 'Os resultados são apresentados de forma clara?', tipo: 'escala', obrigatoria: true },
          { id: 6, texto: 'A análise dos resultados é crítica e fundamentada?', tipo: 'escala', obrigatoria: true },
          { id: 7, texto: 'As conclusões respondem aos objetivos propostos?', tipo: 'sim_nao', obrigatoria: true },
          { id: 8, texto: 'O artigo apresenta contribuição original?', tipo: 'escala', obrigatoria: true },
          { id: 9, texto: 'A qualidade da escrita é adequada?', tipo: 'escala', obrigatoria: true },
          { id: 10, texto: 'Sugestões para melhoria do artigo:', tipo: 'texto', obrigatoria: false }
        ]
      }
    ];
    
    return checklists.find(c => c.id === parseInt(id)) || null;
  };
  
  export default function ChecklistDetalhesPage() {
    const params = useParams();
    const router = useRouter();
    
    const [checklist, setChecklist] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchChecklist = async () => {
        setIsLoading(true);
        try {
          const checklistData = await getChecklist(parseInt(params.id));
          if (!checklistData) {
            setError('Checklist não encontrado');
          } else {
            setChecklist(checklistData);
          }
        } catch (error) {
          console.error('Erro ao buscar checklist:', error);
          setError('Ocorreu um erro ao buscar os detalhes do checklist');
        } finally {
          setIsLoading(false);
        }
      };
  
      if (params.id) {
        fetchChecklist();
      }
    }, [params.id]);
  
    // Função para renderizar o tipo de resposta
    const renderTipoResposta = (tipo) => {
      switch (tipo) {
        case 'sim_nao':
          return <Badge variant="outline">Sim/Não</Badge>;
        case 'escala':
          return <Badge variant="outline">Escala (1-5)</Badge>;
        case 'texto':
          return <Badge variant="outline">Texto</Badge>;
        default:
          return <Badge variant="outline">{tipo}</Badge>;
      }
    };
  
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <ListChecks className="h-12 w-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
            <p>Carregando checklist...</p>
          </div>
        </div>
      );
    }
  
    if (error || !checklist) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Erro ao carregar checklist</h2>
            <p className="text-muted-foreground mb-6">{error || 'Checklist não encontrado'}</p>
            <Button variant="outline" onClick={() => router.back()}>
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
          
          <Button asChild>
            <Link href={`/coordenador/checklists/${checklist.id}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Checklist
            </Link>
          </Button>
        </div>
  
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{checklist.nome}</CardTitle>
                {checklist.descricao && (
                  <CardDescription className="mt-2">
                    {checklist.descricao}
                  </CardDescription>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{checklist.evento_nome}</span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="flex items-center gap-1">
                  <ListChecks className="h-3 w-3" />
                  <span>{checklist.perguntas.length} perguntas</span>
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-2 md:mt-0">
                Atualizado em {new Date(checklist.ultima_atualizacao).toLocaleDateString('pt-BR')}
              </div>
            </div>
  
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Lista de Perguntas</h3>
              <div className="bg-muted rounded-md p-1">
                {checklist.perguntas.map((pergunta, index) => (
                  <div 
                    key={pergunta.id} 
                    className={`p-4 ${index % 2 === 0 ? 'bg-background' : ''} rounded-md mb-1`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">#{index + 1}</span>
                          <span>{pergunta.texto}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {renderTipoResposta(pergunta.tipo)}
                          {pergunta.obrigatoria ? (
                            <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                              Obrigatória
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                              Opcional
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Voltar
            </Button>
            <Button asChild>
              <Link href={`/coordenador/checklists/${checklist.id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Checklist
              </Link>
            </Button>
          </CardFooter>
        </Card>
  
        <Card>
          <CardHeader>
            <CardTitle>Uso do Checklist</CardTitle>
            <CardDescription>
              Este checklist está sendo utilizado para avaliação de artigos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <CheckCheck className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Checklist Ativo</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Este checklist está disponível para avaliadores utilizarem na análise de artigos submetidos ao evento {checklist.evento_nome}.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }