import { Toast } from 'primereact/toast';

export const showMessage = {
    success: (toast: Toast, msg: string) =>
        toast.show({ severity: 'success', summary: 'Sucesso', detail: msg }),
    error: (toast: Toast, msg: string) =>
        toast.show({ severity: 'error', summary: 'Erro', detail: msg }),
    warn: (toast: Toast, msg: string) =>
        toast.show({ severity: 'warn', summary: 'Aviso', detail: msg }),
    warning: (toast: Toast, msg: string) =>
        toast.show({ severity: 'warn', summary: 'Aviso', detail: msg }),
    info: (toast: Toast, msg: string) =>
        toast.show({ severity: 'info', summary: 'Info', detail: msg }),
    // dismiss: (toast: Toast) => toast.dismiss(),
    // confirm: (data: string, onClosing: (confirmation: boolean) => void) =>
    //   toast(Dialog, {
    //     data,
    //     onClose: confirmation => {
    //       if (confirmation) return onClosing(true);
    //       return onClosing(false);
    //     },
    //     autoClose: false,
    //     closeOnClick: false,
    //     closeButton: false,
    //     draggable: false,
    //   }),
};
