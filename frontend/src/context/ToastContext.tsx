import React, { createContext, useContext, useRef } from 'react';
import { Toast, ToastSeverityType } from 'primereact/toast';
import { ChildrenType } from '../types/ReactChildren';
import { IActionType } from '../types/IActionsType';

interface ToastContextType {
  showToast: (
    severity: ToastSeverityType,
    summary: string,
    detail: string,
    life?: number
  ) => void;
  successMessage: (action: IActionType, title: string) => string;
}

const ToastContext = createContext({} as ToastContextType);

export default function ToastProvider({ children }: ChildrenType) {
  const toast = useRef<Toast>(null);

  const successMessage = (action: IActionType, title: string) => {
    const formattActionMessage = {
      Cadastrar: 'cadastrado(a)',
      Editar: 'editado(a)',
    };
    return `${title} ${formattActionMessage[action]} com sucesso`;
  };

  const showToast = (
    severity: ToastSeverityType,
    summary: string,
    detail: string,
    life = 3000
  ) => {
    toast?.current?.show({ severity, summary, detail, life });
  };

  return (
    <ToastContext.Provider value={{ showToast, successMessage }}>
      {children}
      <Toast ref={toast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) throw new Error('useToast must be used within a ToastProvider');

  return context;
}
