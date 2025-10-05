// src/pages/Entrar.tsx (VERSÃO FINAL SEM AVISOS)

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import api from '../services/api';
// --- ADIÇÃO 1: Importação do AxiosError para tipagem de erro ---
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Entrar: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setApiError(null);
    try {
      const response = await api.post('/auth/login', data);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setUser(user);
      setIsLoggedIn(true);
      navigate('/home');
    } catch (error) {
      // --- CORREÇÃO 2: Lógica de erro atualizada para ser type-safe ---
      let errorMessage = 'Erro ao tentar fazer login. Verifique suas credenciais.';
      
      if (error instanceof AxiosError && error.response) {
        // Agora acessamos a mensagem de erro da API de forma segura
        errorMessage = error.response.data?.message || errorMessage;
      }
      
      setApiError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Entrar na sua Conta</CardTitle>
          <CardDescription>Bem-vindo de volta! Faça login para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            
            {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Não tem uma conta?{' '}
            <NavLink to="/cadastrar" className="text-primary hover:underline">
              Registre-se
            </NavLink>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Entrar;