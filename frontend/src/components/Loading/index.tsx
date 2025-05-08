import { ProgressBar } from 'primereact/progressbar';

export function Loading() {
  return (
    <ProgressBar
      mode="indeterminate"
      color="#2e3a48"
      showValue
      value="Carregando Dados"
      style={{ height: '5px' }}
    />
  );
}
