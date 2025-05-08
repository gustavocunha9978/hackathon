'use client';

import { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { getUsuarios } from '@/lib/api';
import { Search, Plus, User, Mail, Calendar, Users, Award, CheckCircle, AlertTriangle } from 'lucide-react';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [cargoFilter, setCargoFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [novoUsuarioDialog, setNovoUsuarioDialog] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    data_nascimento: '',
    cargos: ['autor']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      setIsLoading(true);
      try {
        const usuariosData = await getUsuarios();
        setUsuarios(usuariosData);
        setFilteredUsuarios(usuariosData);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    // Filtra os usuários com base no cargo e na busca
    let filtered = [...usuarios];
    
    if (cargoFilter !== 'todos') {
      filtered = filtered.filter(usuario => 
        usuario.cargos.includes(cargoFilter)
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        usuario => 
          usuario.nome.toLowerCase().includes(query) || 
          usuario.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredUsuarios(filtered);
  }, [cargoFilter, searchQuery, usuarios]);

  const handleCargoFilter = (cargo) => {
    setCargoFilter(cargo);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCargoChange = (cargo) => {
    setFormData(prev => {
      if (prev.cargos.includes(cargo)) {
        return { ...prev, cargos: prev.cargos.filter(c => c !== cargo) };
      } else {
        return { ...prev, cargos: [...prev.cargos, cargo] };
      }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    // Validação básica
    if (!formData.nome || !formData.email || !formData.data_nascimento) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Simulação de criação de usuário
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novoUsuario = {
        id: Math.floor(Math.random() * 1000) + 100,
        ...formData
      };
      
      // Adiciona o novo usuário à lista
      setUsuarios(prev => [...prev, novoUsuario]);
      
      setSuccess('Usuário criado com sucesso!');
      setNovoUsuarioDialog(false);
      
      // Limpa o formulário
      setFormData({
        nome: '',
        email: '',
        data_nascimento: '',
        cargos: ['autor']
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      setError('Ocorreu um erro ao criar o usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h2>
        <Dialog open={novoUsuarioDialog} onOpenChange={setNovoUsuarioDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo usuário na plataforma.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                <Input
                  id="data_nascimento"
                  name="data_nascimento"
                  type="date"
                  value={formData.data_nascimento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Cargos *</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cargo-autor" 
                      checked={formData.cargos.includes('autor')}
                      onCheckedChange={() => handleCargoChange('autor')}
                    />
                    <label htmlFor="cargo-autor" className="text-sm">
                      Autor
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cargo-avaliador" 
                      checked={formData.cargos.includes('avaliador')}
                      onCheckedChange={() => handleCargoChange('avaliador')}
                    />
                    <label htmlFor="cargo-avaliador" className="text-sm">
                      Avaliador
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cargo-coordenador" 
                      checked={formData.cargos.includes('coordenador')}
                      onCheckedChange={() => handleCargoChange('coordenador')}
                    />
                    <label htmlFor="cargo-coordenador" className="text-sm">
                      Coordenador
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNovoUsuarioDialog(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Criando...' : 'Criar Usuário'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md flex items-start gap-2">
          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuários por nome ou email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={cargoFilter === 'todos' ? 'default' : 'outline'}
            onClick={() => handleCargoFilter('todos')}
          >
            Todos
          </Button>
          <Button 
            variant={cargoFilter === 'autor' ? 'default' : 'outline'}
            onClick={() => handleCargoFilter('autor')}
          >
            <User className="mr-2 h-4 w-4" />
            Autores
          </Button>
          <Button 
            variant={cargoFilter === 'avaliador' ? 'default' : 'outline'}
            onClick={() => handleCargoFilter('avaliador')}
          >
            <Award className="mr-2 h-4 w-4" />
            Avaliadores
          </Button>
          <Button 
            variant={cargoFilter === 'coordenador' ? 'default' : 'outline'}
            onClick={() => handleCargoFilter('coordenador')}
          >
            <Users className="mr-2 h-4 w-4" />
            Coordenadores
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando usuários...</p>
        </div>
      ) : filteredUsuarios.length > 0 ? (
        <div className="space-y-4">
          {filteredUsuarios.map(usuario => (
            <Card key={usuario.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{usuario.nome}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{usuario.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Nascimento: {usuario.data_nascimento}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {usuario.cargos.map(cargo => (
                        <Badge key={cargo} variant="outline">
                          {cargo === 'autor' ? (
                            <User className="mr-1 h-3 w-3" />
                          ) : cargo === 'avaliador' ? (
                            <Award className="mr-1 h-3 w-3" />
                          ) :(
                            <Users className="mr-1 h-3 w-3" />
                          )}
                          {cargo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Gerenciar Permissões
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {searchQuery || cargoFilter !== 'todos'
              ? 'Nenhum usuário encontrado com os filtros aplicados.'
              : 'Não há usuários cadastrados.'}
          </p>
          <Button asChild onClick={() => setNovoUsuarioDialog(true)}>
            <div>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Usuário
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}