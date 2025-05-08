import React, { createContext, useContext } from 'react';
import { AxiosError } from 'axios';
import { ChildrenType } from '../types/ReactChildren';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

type ErrorHandlerType = {
  handleError: (error: AxiosError) => void;
};

const ErrorHandlerContext = createContext<ErrorHandlerType | undefined>(
  undefined
);

export const ErrorHandlerProvider = ({ children }: ChildrenType) => {
  const { signOut } = useAuth();
  const { showToast } = useToast();

  const handleError = (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      showToast(
        'error',
        'Token de Acesso Expirado/Inválido',
        'Realize o Login Novamente!'
      );

      signOut();
    } else if (error.response?.data?.duplicity) {
      showToast('error', 'Falha ao cadastrar', error.response.data.message);
    } else if (error.response?.data?.message) {
      showToast('error', '', error.response.data.message);
    } else if (error.code === 'ERR_BAD_REQUEST') {
      showToast(
        'error',
        'Não encontrado',
        'Caso o erro persista entre em contato com um administrador'
      );
    } else {
      showToast(
        'error',
        'Erro não mapeado!',
        'Caso o erro persista entre em contato com um administrador'
      );
    }
  };

  return (
    <ErrorHandlerContext.Provider
      value={{
        handleError,
      }}
    >
      {children}
    </ErrorHandlerContext.Provider>
  );
};

export function useErrorHandler() {
  const context = useContext(ErrorHandlerContext);

  if (!context)
    throw new Error(
      'useErrorHandler must be used within a ErrorHandlerProvider'
    );

  return context;
}
