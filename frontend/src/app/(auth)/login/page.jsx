'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/auth';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
  
      try {
        const user = await login(email, password);
        router.push(
          user.role === 'coordenador' ? '/coordenador' : 
          user.role === 'avaliador' ? '/avaliador' : '/autor'
        );
      } catch (err) {
        setError('Credenciais inválidas. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar sua conta
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link href="/esqueci-senha" className="text-sm text-primary hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
                <div className="text-center text-sm">
                  Não tem uma conta?{' '}
                  <Link href="/registro" className="text-primary hover:underline">
                    Registre-se
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </main>
        
        <Footer />
      </div>
    );
  }