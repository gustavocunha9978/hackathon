import { DataTable, DataTableProps } from 'primereact/datatable';

interface IDataTable extends DataTableProps {
  children: React.ReactNode;
  /**
   * teste
   */
  value: any[];
  loading: boolean;
  globalFilter: string;
}

export const Table = ({
  children,
  value,
  loading,
  globalFilter,
  ...props
}: IDataTable) => {
  return (
    <DataTable
      value={value}
      paginator
      loading={loading}
      globalFilter={globalFilter}
      responsiveLayout="scroll"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="{first} de {last}, Total {totalRecords}"
      rows={10}
      // removableSort
      emptyMessage="Nenhum dado cadastrado"
      rowsPerPageOptions={[10, 20, 50]}
      {...props}
    >
      {children}
    </DataTable>
  );
};
