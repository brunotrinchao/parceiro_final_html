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
                html: msg.replace("\n", "<br>"),
                showConfirmButton: true,
            });
        },
        showSuccess: function(msgn) {
            Swal.fire({
                type: 'success',
                title: 'Sucesso',
                html: msg.replace("\n", "<br>"),
                showConfirmButton: true,
            });
        },
        showError: function(msg) {
            Swal.fire({
                type: 'error',
                title: 'Erro',
                html: msg.replace(/\n/g, "<br />"),
                showConfirmButton: true,
            });
        }
    }
}(jQuery));