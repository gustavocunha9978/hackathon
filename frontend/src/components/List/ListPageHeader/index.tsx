import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FormEvent } from 'react';

interface IListPageHeaderProps {
  title: string;
  globalFilter: string;
  filterTable: (value: string) => void;
  newRegister: () => void;
}

export const ListPageHeader = ({
  title,
  globalFilter,
  filterTable,
  newRegister,
}: IListPageHeaderProps) => {
  function handleChangeInput(event: FormEvent<HTMLInputElement>) {
    filterTable(event.currentTarget.value);
  }

  return (
    <div>
      <div className="flex flex-wrap justify-content-start ">
        <h3 className="font-bold text-2xl">{title}</h3>
      </div>
      <div className="flex flex-wrap justify-content-between mb-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            type="search"
            onInput={handleChangeInput}
            placeholder="Busca..."
          />
        </span>

        <Button
          label="Cadastrar"
          className="p-button-text p-button-success styled-white"
          icon="pi pi-plus"
          iconPos="left"
          onClick={newRegister}
          //tooltip="Cadastrar"
          //tooltipOptions={{ position: 'left' }}
        ></Button>
      </div>
    </div>
  );
};
