import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { Label } from '../Label';

interface DropdownInputProps extends DropdownProps {
  errors: {
    [key: string]: string | undefined;
  };
  touched: {
    [key: string]: boolean;
  };
  inputClassName?: string;
  labelClassName?: string;
  divClassName?: string;
  value: any;
  label: string;
  name: string;
  id?: string;
  onChange: () => Promise<void>;
}

export const DropdownInput = ({
  errors,
  touched,
  inputClassName,
  labelClassName,
  divClassName,
  onChange,
  value,
  label,
  name,
  id,
  ...props
}: DropdownInputProps) => {
  const formatClassName = (className: string | undefined) => {
    return className ?? '';
  };

  const hasError = !!errors[name] && !!touched[name];

  return (
    <div className={`field sm:col-12 md:col-6 `}>
      <Label name={label} />
      <Dropdown 
        className={`w-full ${hasError ? 'p-invalid block' : ''}`}
        id={id ?? name} 
        value={value} 
        onChange={onChange}
        {...props}
      />
      <small id={name + '-help'} className="p-error block">
        {hasError ? <div>{errors[name]}</div> : null}
      </small>
    </div>
  );
};
