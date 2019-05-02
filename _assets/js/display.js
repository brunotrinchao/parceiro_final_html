(function($) {

    $.gDisplay = {
        loadStart: function() {
            Swal.fire({
                title: 'Carregando...',
                showConfirmButton: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });
        },
        loadStop: function(target) {
            Swal.close();
        },
        showAlert: function(json) {
            Swal.fire({
                type: 'warning',
                title: 'Atenção',
                html: msg,
                showConfirmButton: false,
            });
        },
        showSuccess: function(msgn) {
            Swal.fire({
                type: 'success',
                title: 'Sucesso',
                html: msg,
                showConfirmButton: false,
            });
        },
        showError: function(msg) {
            Swal.fire({
                type: 'error',
                title: 'Erro',
                html: msg,
                showConfirmButton: false,
            });
        }
    }
}(jQuery));