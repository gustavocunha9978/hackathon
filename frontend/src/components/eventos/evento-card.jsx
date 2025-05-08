import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Calendar, Info, Upload } from 'lucide-react';

export function EventoCard({ evento, userRole = null }) {
  // Determina as ações disponíveis com base no papel do usuário
  const podeSubmeter = userRole === 'autor';
  const podeEditar = userRole === 'coordenador';
  const statusAtivo = evento.status === 'ativo';
  
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-muted">
        {evento.banner ? (
          <img 
            src={evento.banner} 
            alt={evento.nome} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <span className="text-secondary-foreground opacity-50">
              Banner não disponível
            </span>
          </div>
        )}
        <Badge className="absolute top-4 right-4">
          {evento.status === 'ativo' ? 'Ativo' : 
           evento.status === 'encerrado' ? 'Encerrado' : 'Planejado'}
        </Badge>
      </div>
      
      <CardHeader className="p-6">
        <CardTitle className="text-xl">{evento.nome}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <p className="text-muted-foreground mb-4">{evento.descricao}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Início: {formatDate(evento.data_inicio)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Término: {formatDate(evento.data_fim)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <Link href={`/eventos/${evento.id}`}>
            <Info className="h-4 w-4 mr-2" />
            Detalhes
          </Link>
        </Button>
        
        {podeSubmeter && statusAtivo && (
          <Button asChild>
            <Link href={`/autor/submissao?evento=${evento.id}`}>
              <Upload className="h-4 w-4 mr-2" />
              Submeter Artigo
            </Link>
          </Button>
        )}
        
        {podeEditar && (
          <Button variant="outline" asChild>
            <Link href={`/coordenador/eventos/${evento.id}/editar`}>
              Editar
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}