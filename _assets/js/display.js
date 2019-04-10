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
        loadError: function(target, msg) {},
        showAlert: function(json, success, error) {},
        showSuccess: function(msg, success, plugin) {},
        showError: function(msg, error, plugin) {}
    }
}(jQuery));