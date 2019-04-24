(function($) {
    var prefix = "parceiro_";
    Lockr.prefix = prefix;

    $.gApi = {
        exec: function(method, endpoint, param, callbackSuccess, callbackError) {
            var headers = {};
            headers.Authorization = "YnJ1bm86SW50ZWdyYWNhb1BhcmNlaXJvcw==";

            var new_param = jQuery.isEmptyObject(param) ?
                null :
                JSON.stringify(param);

            jQuery.ajax({
                type: method,
                url: endpoint,
                data: new_param,
                dataType: "json",
                async: true,
                contentType: "application/json",
                processData: true,
                headers: headers,
                beforeSend: function() {
                    jQuery.gDisplay.loadStart();
                },
                error: function(xhr) {
                    jQuery.gDisplay.loadStop();
                    if (typeof callbackError === "function") {
                        callbackError.call(this, xhr);
                    }
                },
                success: function(json) {
                    jQuery.gDisplay.loadStop();

                    if (typeof callbackSuccess === "function") {
                        callbackSuccess.call(this, json);
                    }
                }
            });
        },
        load: function(page, container, param, callBack) {
            jQuery.gDisplay.loadStart();
            var new_container = !container || container === undefined || container == "" ?
                "#load_page" :
                container;
            var new_param = jQuery.isEmptyObject(param) ? null : $.param(param);
            $("#load_page").load("./pages/" + page, new_param, function() {
                jQuery.gDisplay.loadStop();
                if (typeof callbackSuccess === "function") {
                    callbackSuccess.call(this);
                }
            });
        }
    };

    $.lockrStorage = {
        set: function(key, param) {
            Lockr.set(key, param);
        },
        get: function(key) {
            var ret = JSON.parse(localStorage.getItem(prefix + key));
            if (ret) {
                return ret.data;
            }
            return;
        },
        add: function(key, value) {
            Lockr.sadd(key, value);
        },
        item: function(key) {
            Lockr.smembers(key);
        },
        exist: function(key, value) {
            return Lockr.sismember(key, value);
        },
        removeItem: function(key, value) {
            Lockr.srem(key, value);
        },
        getAll: function() {
            return Lockr.getAll(true);
        },
        clear: function() {
            Lockr.flush();
        }
    };
})(jQuery);

$.fn.serializeObject = function() {
    limparPlaceHolder();
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    carregarPlaceHolder();
    return o;
};

function carregarPlaceHolder() {
    if (!$.support.placeholder) {
        $('[placeholder]').each(function() {
            var input = $(this);
            if ($(input).val() == '')
                $(input).val(input.attr('placeholder'));
            $(input).focus(function() {
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            });
            $(input).blur(function() {
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.val(input.attr('placeholder'));
                }
            });
        });
    }
}

function limparPlaceHolder() {
    if (!$.support.placeholder) {
        $('[placeholder]').each(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder'))
                input.val('');
        });
    }
}

function sizeObj(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function alerta(titulo, texto, tipo, texto_botao) {
    var config = {};
    var _tipo = (tipo == undefined || tipo == null) ? 'error' : tipo;
    var _titulo = (_tipo == 'error') ? 'Erro' : (_tipo == 'success') ? 'Sucesso' : (_tipo == 'warning') ? 'Atenção' : titulo;

    config.title = _titulo;
    config.type = _tipo;
    if (texto != undefined || texto != null) {
        config.html = texto.replace("\n", "<br>");
    }
    if (texto_botao != undefined || texto_botao != null) {
        config.confirmButtonText = texto_botao;
    }

    Swal.fire(config);
}

function checkNull(value) {
    return (value == null || value == '' || value == undefined) ? '' : value;
}

function addInput(label, atributos, span, placeholder) {
    var html = '<input ';
    $.each(atributos, function(key, value) {
        html += key + '="' + value + '"';
    });
    if(placeholder){
    html += ' placeholder="'+label+'"';
	}
    html += ' class="form-control"';
    html += '>';

    return addControlForm(label, html, null, span);

}
function addTextarea(label, atributos,value, span, placeholder) {
    var html = '<textarea ';
    $.each(atributos, function(key, value) {
        html += key + '="' + value + '"';
    });
	if(placeholder){
    html += ' placeholder="'+label+'"';
	}
    html += ' class="form-control"';
    html += '>'+value+'</textarea>';

    return addControlForm(label, html, null, span);

}

function addControlForm(label, input, classe, span) {
    var new_class = (!classe) ? '' : classe;
    var new_label = (!label) ? '' : '<label>' + label + '</label>';
    var new_input = (!input) ? '' : input;

    var html = '<div class="' + span + '">';
    html += '<div class="form-group ' + new_class + '">';
    html += new_label;
    html += new_input;
    html += '</div>';
    html += '</div>';

    return html;

}