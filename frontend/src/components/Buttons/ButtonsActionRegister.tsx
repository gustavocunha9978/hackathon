import { Button, ButtonProps } from 'primereact/button';

interface ButtonsActionsRegisterProps extends ButtonProps {
  handleCancel: () => void;
  disableButton?: boolean;
  form: string;
}

const ButtonsActionsRegister = ({
  handleCancel,
  disableButton,
  form,
}: ButtonsActionsRegisterProps) => {
  return (
    <div className="flex gap-3 align-items-center justify-content-end">
      <div>
        <Button
          id="idBtnCancelar"
          label="Cancelar"
          className="p-button-outlined p-button-danger"
          icon="pi pi-times"
          iconPos="right"
          type="button"
          onClick={handleCancel}
        />
      </div>
      <div>
        <Button
          id="idBtnSalvar"
          label="Salvar"
          type="submit"
          className="p-button-raised p-button-success"
          icon="pi pi-check"
          iconPos="right"
          form={form}
          //onClick={handleSave}
          disabled={disableButton}
        />
      </div>
    </div>
  );
};

export default ButtonsActionsRegister;
