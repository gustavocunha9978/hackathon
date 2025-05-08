import { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  name: string;
  labelClass?: string;
}

export const Label = ({ name, labelClass, ...props }: LabelProps) => {
  const labelClassName = labelClass ? labelClass : '';

  return (
    <label className={`font-bold ${labelClassName}`} {...props}>
      {name}
    </label>
  );
};
