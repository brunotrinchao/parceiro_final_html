(function($) {
    var pilhaApi = 0;

    $.gApi = {

        exec: function(method, endpoint, param, callbackSuccess, callbackError, preloader) {
            var headers = {}
            headers.Authorization = 'Bearer ' + authLocalStorage;

            var new_param = (jQuery.isEmptyObject(param)) ? null : JSON.stringify(param);

            jQuery.ajax({
                type: method,
                url: endpoint,
                data: new_param,
                dataType: 'json',
                async: trie,
                contentType: 'application/json',
                processData: true,
                headers: headers,
                beforeSend: function() {
                    jQuery.gDisplay.loadStart();
                },
                error: function(xhr) {
                    jQuery.gDisplay.loadStop();
                },
                success: function(json) {
                    jQuery.gDisplay.loadStop();

                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess.call(this, json);
                    }
                }
            });
        }
    }
})(jQuery);