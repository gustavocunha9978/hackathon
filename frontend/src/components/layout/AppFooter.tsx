interface AppFooterProps {
  layoutColorMode: 'light' | 'dark';
}

export function AppFooter({ layoutColorMode }: AppFooterProps) {
  return (
    <div className="layout-footer">
      <img
        src={
          layoutColorMode === 'light'
            ? 'https://biopark.com.br/biopark-logo.svg'
            : 'https://biopark.com.br/incubadora/imagens/bioparkLogob.svg'
        }
        alt="Logo"
        height="34"
        className="mr-5"
      />

      <span className="font-medium">
        <strong>Versão: 0.0.0</strong>
      </span>
    </div>
  );
}
