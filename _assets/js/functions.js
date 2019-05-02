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
        load: function(page, container, param, callbackSuccess) {
            jQuery.gDisplay.loadStart();
            var new_container = !container || container === undefined || container == "" ?
                "#load_page" :
                container;
            var new_param = jQuery.isEmptyObject(param) ? null : $.param(param);


            jQuery.ajax({
                type: "GET",
                url: "./pages/" + page,
                data: param,
                async: true,
                beforeSend: function() {
                    jQuery.gDisplay.loadStart();
                },
                error: function(xhr, textStatus, errorThrown) {
                    jQuery.gDisplay.loadStop();

                    jQuery(new_container).prepend('Carregamento interrompido...');

                    var debug = {
                        page: page,
                        status: xhr.status,
                        statusText: xhr.statusText,
                        params: param
                    }

                    console.warn('Erro ao carregar ajax: ', debug);
                },
                success: function(resp) {
                    jQuery.gDisplay.loadStop();

                    jQuery(new_container).html(resp);

                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess.call(this, param);
                    }
                }
            });



            // $("#load_page").load("./pages/" + page, new_param, function(e) {
            //     jQuery.gDisplay.loadStop();
            //     if (typeof callback === "function") {
            //         callback.call(this);
            //     }
            // });
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
            return Lockr.smembers(key);
        },
        exist: function(key, value) {
            return Lockr.sismember(key, value);
        },
        removeItem: function(key) {
            Lockr.rm(key);
        },
        getAll: function() {
            return Lockr.getAll(true);
        },
        clear: function() {
            Lockr.flush();
        }
    };

    $.gPaginate = {
        show: function(links, callback) {
            if (links.Count > 1) {
                var url = new URL(links.Self);
                console.log(url);
                var html = '<nav class="pt-5">';
                html += '<ul class="pagination justify-content-center">';
                // html += '<li class="page-item disabled">';
                // html += '<a class="page-link" href="1" aria-label="Previous">';
                // html += '<span aria-hidden="true">&laquo;</span>';
                // html += '</a>';
                // html += '</li>';
                for (var i = 0; i < links.Count; i++) {
                    var n = i + 1;
                    var active = (n == 1) ? ' active' : '';
                    var params = getParams(links.Self);
                    params.NumeroPagina = n;

                    var urlLink = url.origin + '' + url.pathname + '?' + $.param(params);
                    html += '<li class="page-item ' + active + '">';
                    html += '<a class="page-link" id="page-link-' + n + '" data-link="' + n + '" href="' + urlLink + '">';
                    html += n;
                    html += '</a>';
                    html += '</li>';
                }
                // html += '<li class="page-item">';
                // html += '<a class="page-link" href="2" aria-label="Next">';
                // html += '<span aria-hidden="true">&raquo;</span>';
                // html += '</a>';
                // html += '</li>';
                html += '</ul>';
                html += '</nav>';
            }
            if (typeof callback === "function") {
                callback.call(this, html);
            }
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
    var id = '';
    var html = '<input ';
    var classe = '';
    $.each(atributos, function(key, value) {
        if (key != 'class') {
            html += key + '="' + value + '"';
        } else {
            classe += ' ' + value;

        }
        if (key == 'id') {
            id = value;
        }

    });
    if (placeholder) {
        html += ' placeholder="' + label + '"';
    }
    html += ' class="form-control ' + classe + '"';
    html += '>';

    var required = campoRequerido(atributos);

    return addControlForm(label, html, required, span, id);

}

function addRadio(label, type, atributos, span, options, checkFirst) {
    var id = '';
    var html = '<div>';
    var i = 1;
    $.each(options, function(key, value) {
        html += '<div class="form-check form-check-inline">';

        html += '<input class="form-check-input "';
        $.each(atributos, function(key, value) {
            html += key + '="' + value + '"';
            if (checkFirst && i == 1) {
                html += ' checked= checked '
            }
            if (key == 'id') {
                id = value;
            }
            i++;
        });
        html += ' type="' + type + '" id="inline' + type + '' + key + '" value="' + key + '">';
        html += '<label class="form-check-label" for="inline' + type + '' + key + '">' + value + '</label>';

        html += '</div>';
    });
    html += '</div>';

    var required = campoRequerido(atributos);

    return addControlForm(label, html, required, span, id);

}

function addTextarea(label, atributos, value, span, placeholder) {
    var id = '';
    var html = '<textarea ';
    $.each(atributos, function(key, value) {
        html += key + '="' + value + '"';
        if (key == 'id') {
            id = value;
        }
    });
    if (placeholder) {
        html += ' placeholder="' + label + '"';
    }
    html += ' class="form-control"';
    html += '>' + value + '</textarea>';

    var required = campoRequerido(atributos);

    return addControlForm(label, html, required, span, id);

}

function addSelect(label, atributos, span, options) {
    var id = '';
    var html = '<select ';
    $.each(atributos, function(key, value) {
        html += key + '="' + value + '"';
        if (key == 'id') {
            id = value;
        }
    });
    html += ' class="form-control"';
    html += '>';
    html += '<option value="">.: Selecione :.</option>';
    $.each(options, function(key, value) {
        html += '<option value="' + key + '">' + value + '</option>';
    });
    html += '</select>';

    var required = campoRequerido(atributos);

    return addControlForm(label, html, required, span, id);

}

function addControlForm(label, input, required, span, id) {
    var new_required = (!required) ? '' : '*';
    var new_label = (!label) ? '' : '<label id="lbl_' + id + '" class="font-weight-bold">' + label + ''+new_required+'</label>';
    var new_input = (!input) ? '' : input;

    var html = '<div class="' + span + '" id="box_'+id+'">';
    html += '<div class="form-group">';
    html += new_label;
    html += new_input;
    html += '</div>';
    html += '</div>';

    return html;
}

function campoRequerido(atributos) {
    return (atributos.validate == 'required')? true : false;
}

function getParams(url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};


function getFieldsFormCliente() {
    var html = '';
    html += '<div class="col-12 mb-3">';
    html += '<div class="card">';
    html += '<div class="card-header">';
    html += 'Dados do cliente';
    html += '</div>';
    html += '<div class="card-body">';

    html += '<div class="row">';
    html += addInput(null, { type: "hidden", value: 1, name: 'produto' }, '');
    html += addInput('Nome', { type: "text", id: 'Cliente', validate: 'required', name: 'Cliente' }, 'col-md-12 col-lg-4');
    html += addInput('E-mail', { type: "email", id: 'Email', validate: 'required', name: 'email' }, 'col-md-12 col-lg-4');
    html += addRadio('Tipo', 'radio', {id: 'TipoCliente', name: 'TipoCliente', validate: 'required' }, 'col-md-12 col-lg-4', { F: 'Pessoa Física', J: 'Pessoa Jurídica' }, true);
    html += addInput('<span class="pessoa_cliente">CPF</span>', { type: "text", id: 'pessoaTipo', validate: 'required', name: 'CPF' }, 'col-md-12 col-lg-3');
    html += addInput('Telefone', { type: "text", id: 'Tefefone', validate: 'required', name: 'telefone', class: 'phone' }, 'col-md-12 col-lg-3');
    html += addInput('Celular', { type: "text", id: 'Celular', name: 'celular', class: 'phone' }, 'col-md-12 col-lg-3');
    html += addInput('Nascimento', { type: "date", id: 'Nascimento', name: 'Nascimento', class: 'calendar' }, 'col-md-12 col-lg-3');
    html += addSelect('Sexo', { id: 'Sexo', name: 'Sexo' }, 'col-md-12 col-lg-3', { 1: 'Masculino', 2: 'Feminino' });
    html += addInput('Contato', { type: "text", id: 'Contato', name: 'Contato', }, 'col-md-12 col-lg-9');
    html += '<script>';
    html += '$(function() {';
    html += "$('#pessoaTipo').mask('999.999.999-99', {reverse: true});";
    html += "$('input[name=TipoCliente]').change(";
    html += "function(){";
    html += "var vTipo =  $(this).val();";
    html += "var maskTipo = (vTipo == 'F')? '999.999.999-99' : '99.999.999/9999-99';";
    html += "$('span.pessoa_cliente').text((vTipo == 'F')? 'CPF' : 'CNPJ');";
    html += "$('#pessoaTipo').mask(maskTipo, {reverse: true});";
    html += "}";
    html += ")";
    html += '});';
    html += '<\/script>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
}

function getFieldsFormEndereco() {
    var html = '';
    html += '<div class="col-12 mb-3">';
    html += '<div class="card">';
    html += '<div class="card-header">';
    html += 'Endereço';
    html += '</div>';
    html += '<div class="card-body">';
    html += '<div class="row">';
    html += addInput('CEP', { type: "text", id: 'cep', validate: 'required', name: 'Cep' }, 'col-md-12 col-lg-3');
    html += addInput('Endereço', { type: "text", id: 'Logradouro', validate: 'required', name: 'Logradouro', class: 'autocomplete-address' }, 'col-md-12 col-lg-9');
    html += addInput('Número', { type: "text", id: 'Numero', validate: 'required', name: 'Numero' }, 'col-md-12 col-lg-3');
    html += addInput('Bairro', { type: "text", id: 'Bairro', validate: 'required', name: 'Bairro', class: 'autocomplete-neighborhood' }, 'col-md-12 col-lg-3');
    html += addInput('Cidade', { type: "text", id: 'Cidade', validate: 'required', name: 'Cidade', class: 'autocomplete-city' }, 'col-md-12 col-lg-3');
    html += addInput('Estado', { type: "text", id: 'UF', validate: 'required', name: 'UF', class: 'autocomplete-state' }, 'col-md-12 col-lg-3');
    html += addTextarea('Complemento', { row: "3", name: 'Complemento', id: 'Complemento' }, '', 'col-md-12 col-lg-12');

    html += '<script>';
    html += '$(function() {';
    html += "$('#cep').mask('99.999-999', {reverse: true});";
    html += "$('#cep').autocompleteAddress({";
    html += "setReadonly: true,";
    html += "setDisabled: false";
    html += "});";
    html += '});';
    html += '<\/script>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
}