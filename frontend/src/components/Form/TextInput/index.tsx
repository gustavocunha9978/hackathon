import { InputText, InputTextProps } from 'primereact/inputtext';
import { Label } from '../Label';

interface TextInputProps extends InputTextProps {
  errors: {
    [key: string]: string | undefined;
  };
  touched: {
    [key: string]: boolean;
  };
  inputClassName?: string;
  labelClassName?: string;
  divClassName?: string;
  value: string;
  label: string;
  name: string;
  id?: string;
  onChange: () => Promise<void>;
}

export const TextInput = ({
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
}: TextInputProps) => {
  const formatClassName = (className: string | undefined) => {
    return className ?? '';
  };

  const hasError = !!errors[name] && !!touched[name];

  const divClass = formatClassName(divClassName); // ? divClassName : '';
  const inputClass = formatClassName(inputClassName); //  inputClassName : '';
  const labelClass = formatClassName(labelClassName); // ? labelClassName : '';

  return (
    <div className={`field sm:col-12 md:col-6 ${divClass} `}>
      <Label name={label} labelClass={labelClass} />
      <InputText
        className={`w-full ${hasError ? 'p-invalid block' : ''} ${inputClass}`} //+ formatClassName(inputClassName)
        id={id ?? name}
        name={name}
        type="text"
        onChange={onChange}
        value={value}
        {...props}
      />
      <small id={name + '-help'} className="p-error block">
        {hasError ? <div>{errors[name]}</div> : null}
      </small>
    </div>
  );
};
