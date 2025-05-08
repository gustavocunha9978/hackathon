import styles from './style.module.css';

export function AboutGdi() {
  return (
    <div className={styles.wrapper + ' card'}>
      <div>
        <h4 className={styles.title + ' font-bold'}>
          GDI - Gestor de Dados Integrados
        </h4>
        <br />
        <p className={styles.text}>
          O GDI (Gestor de Dados Integrados) é a plataforma web de controle de
          dados internos do Biopark. O desenvolvimento desse projeto foi
          iniciado em janeiro de 2021 pela equipe de Trainees composta por
          Beatriz, Jonas, Milena e Wagner.
        </p>
        <p className={styles.text}>
          O Sistema tem como principal objetivo padronizar e centralizar os
          dados de todas as pessoas e empresas que possuem relação ou tiveram
          interação com o Biopark. Ele é composto por 4 módulos: Comercial,
          Novos Negócios, Compras e Diretoria. Cada módulo foi desenvolvido
          focado na regra de negócio do setor para trazer mais facilidade e
          segurança com o controle dos dados.
        </p>
      </div>
    </div>
  );
}
