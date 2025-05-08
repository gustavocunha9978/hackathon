import { Calendar, CalendarProps } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { SelectItemOptionsType } from 'primereact/selectitem';
import { SyntheticEvent } from 'react';
import { Label } from '../Label';

interface CalendarInputProps extends CalendarProps {
  errors: {
    [key: string]: string | undefined;
  };
  touched: {
    [key: string]: boolean;
  };
  inputClassName?: string;
  labelClassName?: string;
  divClassName?: string;
  value: Date;
  label: string;
  name: string;
  id?: string;
  onChange: () => Promise<void>;
}

export const CalendarInput = ({
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
}: CalendarInputProps) => {
  const formatClassName = (className: string | undefined) => {
    return className ?? '';
  };

  const hasError = !!errors[name] && !!touched[name];

  const monthNavigatorTemplate = (e: { value: any; options: SelectItemOptionsType | undefined; onChange: (arg0: SyntheticEvent<Element, Event>, arg1: any) => void; }) => {
    return (
      <Dropdown
        value={e.value}
        options={e.options}
        onChange={event => e.onChange(event.originalEvent, event.value)}
        style={{ lineHeight: 1 }}
      />
    );
  };

  const yearNavigatorTemplate = (e: { value: any; options: SelectItemOptionsType | undefined; onChange: (arg0: SyntheticEvent<Element, Event>, arg1: any) => void; }) => {
    return (
      <Dropdown
        value={e.value}
        options={e.options}
        onChange={event => e.onChange(event.originalEvent, event.value)}
        className='p-ml-2'
        style={{ lineHeight: 1 }}
      />
    );
  };

  return (
    <div className={`field sm:col-12 md:col-6 `}>
      <Label name={label} />
      <Calendar  
        className={`w-full ${hasError ? 'p-invalid block' : ''}`}
        id={id ?? name} 
        value={value} 
        onChange={onChange} 
        showIcon
        monthNavigator
        yearNavigator
        monthNavigatorTemplate={monthNavigatorTemplate}
        yearNavigatorTemplate={yearNavigatorTemplate}
        yearRange='2019:2050'
        dateFormat='dd/mm/yy'
        placeholder='dd/mm/aaaa'
        mask='99/99/9999'
        {...props}
      />
      <small id={name + '-help'} className="p-error block">
        {hasError ? <div>{errors[name]}</div> : null}
      </small>
    </div>
  );
};
