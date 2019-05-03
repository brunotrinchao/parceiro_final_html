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
        showAlert: function(msg, callBackAfter) {
            Swal.fire({
                type: 'warning',
                title: 'Atenção',
                html: msg.replace("\n", "<br>"),
                showConfirmButton: true,
                onAfterClose: function() {
                    if (typeof callBackAfter === "function") {
                        callBackAfter.call(this);
                    }
                }
            });
        },
        showSuccess: function(msg, callBackAfter) {
            Swal.fire({
                type: 'success',
                title: 'Sucesso',
                html: msg.replace("\n", "<br>"),
                showConfirmButton: true,
                onAfterClose: function() {
                    if (typeof callBackAfter === "function") {
                        callBackAfter.call(this);
                    }
                }
            });
        },
        showError: function(msg, callBackAfter) {
            Swal.fire({
                type: 'error',
                title: 'Erro',
                html: msg.replace(/\n/g, "<br />"),
                showConfirmButton: true,
                onAfterClose: function() {
                    if (typeof callBackAfter === "function") {
                        callBackAfter.call(this);
                    }
                }
            });
        }
    }
}(jQuery));