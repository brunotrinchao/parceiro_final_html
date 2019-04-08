(function($) {
    Swal.fire({
        title: 'Carregando'
    });
    $.gDisplay = {
        loadStart: function() {

            Swal.showLoading();
        },
        loadStop: function(target) {
            Swal.hideLoading()
        },
        loadError: function(target, msg) {},
        showAlert: function(json, success, error) {},
        showSuccess: function(msg, success, plugin) {},
        showError: function(msg, error, plugin) {}
    }
}(jQuery));