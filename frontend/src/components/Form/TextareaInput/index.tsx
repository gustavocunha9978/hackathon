import { InputTextarea, InputTextareaProps } from 'primereact/inputtextarea';
import { Label } from '../Label';

interface TextareaInputProps extends InputTextareaProps {
  errors: {
    [key: string]: string | undefined;
  };
  touched: {
    [key: string]: boolean;
  };
  label: string;
  value: string;
  onChange: () => void;
  name: string;
  id?: string;
}

export const TextareaInput = ({
  errors,
  touched,
  label,
  value,
  onChange,
  name,
  id,
  ...props
}: TextareaInputProps) => {
  const hasError = !!errors[name] && !!touched[name];

  return (
    <div className="field col-12">
      <Label name={label} />
      <InputTextarea
        id={id ?? name}
        name={name}
        className={`w-full ${hasError ? 'p-invalid block' : ''}`} //+ formatClassName(inputClassName)
        value={value}
        onChange={onChange}
        rows={5}
        cols={50}
        autoResize
        {...props}
      />
      <small id={name + '-help'} className="p-error block">
        {hasError ? <div>{errors[name]}</div> : null}
      </small>
    </div>
  );
};
