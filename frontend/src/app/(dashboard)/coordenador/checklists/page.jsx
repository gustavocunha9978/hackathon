'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getEventos } from '@/lib/api';
import { CheckSquare, Plus, Search, Edit, Trash, Calendar, ListChecks } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Simula uma API para buscar checklists
const getChecklists = async () => {
  // Em um caso real, isso seria uma chamada API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 1,
      nome: 'Checklist de Avaliação Padrão',
      evento_id: 1,
      evento_nome: 'Congresso Biopark de Inovação 2025',
      quantidade_perguntas: 8,
      criado_em: '2025-03-15',
      ultima_atualizacao: '2025-04-10'
    },
    {
      id: 2,
      nome: 'Critérios de Qualidade Técnica',
      evento_id: 1,
      evento_nome: 'Congresso Biopark de Inovação 2025',
      quantidade_perguntas: 12,
      criado_em: '2025-03-18',
      ultima_atualizacao: '2025-03-18'
    },
    {
      id: 3,
      nome: 'Checklist para Artigos de Pesquisa',
      evento_id: 2,
      evento_nome: 'Simpósio de Pesquisa Acadêmica',
      quantidade_perguntas: 10,
      criado_em: '2025-04-02',
      ultima_atualizacao: '2025-04-15'
    }
  ];
};

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Busca checklists
        const checklistsData = await getChecklists();
        setChecklists(checklistsData);
        
        // Busca eventos para o filtro
        const eventosData = await getEventos();
        setEventos(eventosData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtra checklists com base na busca
  const filteredChecklists = checklists.filter(
    checklist => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        checklist.nome.toLowerCase().includes(query) ||
        checklist.evento_nome.toLowerCase().includes(query)
      );
    }
  );

  const handleDeleteChecklist = (checklist) => {
    setSelectedChecklist(checklist);
    setConfirmDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      // Simulação de exclusão
      setChecklists(checklists.filter(c => c.id !== selectedChecklist.id));
      setConfirmDeleteDialog(false);
    } catch (error) {
      console.error('Erro ao excluir checklist:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Checklists de Avaliação</h2>
        <Button asChild>
          <Link href="/coordenador/checklists/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Checklist
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar checklists por nome ou evento..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando checklists...</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead className="text-center">Perguntas</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChecklists.length > 0 ? (
                  filteredChecklists.map((checklist) => (
                    <TableRow key={checklist.id}>
                      <TableCell className="font-medium">{checklist.nome}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{checklist.evento_nome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="rounded-sm px-2 py-1">
                          <ListChecks className="h-3 w-3 mr-1" />
                          {checklist.quantidade_perguntas}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(checklist.ultima_atualizacao).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/coordenador/checklists/${checklist.id}`}>
                              <CheckSquare className="h-4 w-4 mr-2" />
                              Ver
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/coordenador/checklists/${checklist.id}/editar`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteChecklist(checklist)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <ListChecks className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          {searchQuery 
                            ? 'Nenhum checklist encontrado com os filtros aplicados.' 
                            : 'Nenhum checklist cadastrado. Crie um novo checklist para começar.'}
                        </p>
                        {!searchQuery && (
                          <Button className="mt-4" asChild>
                            <Link href="/coordenador/checklists/novo">
                              <Plus className="mr-2 h-4 w-4" />
                              Novo Checklist
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={confirmDeleteDialog} onOpenChange={setConfirmDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o checklist{' '}
              <span className="font-semibold">
                {selectedChecklist?.nome}
              </span>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}