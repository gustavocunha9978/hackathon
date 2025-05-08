import { FormHTMLAttributes, ReactNode } from 'react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  className?: string;
  onSubmit: () => Promise<void>;
}

export const Form = ({
  onSubmit,
  children,
  className,
  ...props
}: FormProps) => {
  return (
    <form
      {...props}
      className={className + ' formgrid grid'}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
};
