import { Label } from '../Label';
import { MultiSelect, MultiSelectProps } from 'primereact/multiselect';

interface MultiSelectInputProps extends MultiSelectProps {
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

export const MultiSelectInput = ({
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
}: MultiSelectInputProps) => {
  const formatClassName = (className: string | undefined) => {
    return className ?? '';
  };

  const hasError = !!errors[name] && !!touched[name];

  const panelFooterTemplate = () => {
    const selectedItems = value;
    const length = selectedItems ? selectedItems.length : 0;
    return (
        <div className="py-2 px-3">
            <b>{length}</b> selecionados.
        </div>
    );
}

  return (
    <div>
      <Label name={label} />
      <MultiSelect
        className={`w-full ${hasError ? 'p-invalid block' : ''}`}
        id={id ?? name} 
        value={value}
        onChange={onChange}
        filter 
        panelFooterTemplate={panelFooterTemplate}
        {...props}
      />
      
      <small id={name + '-help'} className="p-error block">
        {hasError ? <div>{errors[name]}</div> : null}
      </small>
    </div>
  );
};



