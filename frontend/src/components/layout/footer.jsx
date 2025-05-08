import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 px-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Submita. Todos os direitos reservados.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <nav className="flex gap-4">
            <Link
              href="/termos"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Termos
            </Link>
            <Link
              href="/privacidade"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacidade
            </Link>
            <Link
              href="/contato"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Contato
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
