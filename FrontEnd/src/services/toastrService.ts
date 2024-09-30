// src/services/toastrService.ts
import toastr from 'toastr';

// Configuración de Toastr
toastr.options = {
    closeButton: true,
    debug: false,
    positionClass: 'toast-top-center', // Posicionar en el centro superior
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
    // Eliminar opacidad y transparencia
    opacity: 1,
    progressBar: true
};


export const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    toastr[type](message);
};
