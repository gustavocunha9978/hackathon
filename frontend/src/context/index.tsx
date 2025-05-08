import { ChildrenType } from '../types/ReactChildren';
import AuthProvider from './AuthContext';
import { ErrorHandlerProvider } from './ErrorHandler';
// import LoadingDataProvider from './LoadingDataContext';
import ToastProvider from './ToastContext';
/**
 * Todos as páginas e componentes tem acesso a esses contexts
 * @param param0
 * @returns
 */
export const AppProvider = ({ children }: ChildrenType) => {
  return (
    <ToastProvider>
      <ErrorHandlerProvider>
        <AuthProvider>
        {/* <LoadingDataProvider> */}
        {children}
        {/* </LoadingDataProvider> */}
        </AuthProvider>
      </ErrorHandlerProvider>
    </ToastProvider>
  );
};
