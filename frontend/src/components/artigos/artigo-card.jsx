import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatStatus, getStatusColor } from '@/lib/utils';
import { FileText, Calendar, Tag } from 'lucide-react';

export function ArtigoCard({ artigo, userRole = 'autor' }) {
  // Determina o link com base no papel do usuário
  let detailsLink = `/autor/artigos/${artigo.id}`;
  
  if (userRole === 'avaliador') {
    detailsLink = `/avaliador/avaliacoes/${artigo.id}`;
  } else if (userRole === 'coordenador') {
    detailsLink = `/coordenador/artigos/${artigo.id}`;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{artigo.titulo}</CardTitle>
          <Badge className={getStatusColor(artigo.status)}>
            {formatStatus(artigo.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="text-muted-foreground mb-4">{artigo.resumo}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {artigo.palavras_chave?.map((palavra, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {palavra}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{artigo.area_tematica}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(artigo.versao_atual.data_cadastro)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {artigo.autores?.map(autor => autor.nome).join(', ')}
        </div>
        <Button variant="outline" asChild>
          <Link href={detailsLink}>
            Ver Detalhes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}