(function($) {
    $.fn.gValidate = function() {
        var ret = true;
        var form = jQuery(this).attr('id');
        var msg = '';
        jQuery('input, select, textarea', this).each(function() {
            var typesValidates = jQuery(this).attr('validate');
            if (typesValidates !== undefined) {
                var idField = jQuery(this).attr('id');

                if (jQuery("#" + form + " #" + idField).parents('.form-group').length) {
                    jQuery("#" + form + " #" + idField).parents('.form-group').removeClass('error');
                } else {
                    jQuery("#lbl_" + idField).css('color', '#000');
                }

                // var $label = jQuery('#' + form + ' label[for="' + idField + '"]');
                var $label = jQuery('#lbl_' + idField);

                var nameField = ($label.html() != null) ? $label.html() : jQuery(this).attr('placeholder');

                if (nameField != null) {
                    nameField = $.trim(nameField.replace(/<script.*>.*<\/script>/im, ""));
                    nameField = nameField.replace(':', '');
                    nameField = nameField.replace('*', '');
                }
                var validates = typesValidates.split(";");
                for (var i = 0; i < validates.length; i++) {
                    msg += validate(idField, nameField, validates[i], $label, form);
                }
            }
        });
        if (msg.length > 0) {
            ret = false;
            Swal.close();
            alerta('Erro', montaErro(msg), 'error');
            // jQuery.gDisplay.showError(msg, '');
        }
        return ret;
    }

    function validate(idField, nameField, typeValidate, $label, form) {
        if (typeValidate.indexOf("~") >= 0) {
            if (jQuery("#" + form + " #" + idField).is(':visible')) {
                var valueField = jQuery("#" + form + " #" + idField).val();
                var param = typeValidate.split("|");
                var expressao = param[0];
                var msg = param[1];
                if (msg === undefined) {
                    msg = 'inválido!';
                }
                expressao = replaceAll(expressao, "[", "'");
                expressao = replaceAll(expressao, "]", "'");
                expressao = replaceAll(expressao, "~", valueField);
                if (!eval(expressao)) {
                    setFocus(idField, form);
                    return '<b>' + nameField + '</b> é ' + msg + '<br/>';
                }
            }
        } else {
            //            if(jQuery("#"+form+" #"+idField).is(':visible')){
            switch (typeValidate) {
                case "required":
                    var value = jQuery("#" + form + " #" + idField).val();
                    value = (Array.isArray(value) ? value[0] : value);
                    if ($.trim(value) == "" || value == null) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> é indispensável!<br>';
                    }
                    break;
                case "requiredVisible":
                    if ((jQuery("#" + form + " #" + idField).is(':visible')) && (strip_tags(trim(jQuery("#" + form + " #" + idField).val())) == "")) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> é indispensável!<br>';
                    }
                    break;
                case "radio":
                    if (!jQuery("#" + form + " input[type=radio][name=" + idField + "]:checked").val()) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> é indispensável!<br>';
                    }
                    break;
                case "checkbox":
                    if (!jQuery("#" + form + " input[type=checkbox][name=" + idField + "]:checked").val()) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> é indispensável!<br>';
                    }
                    break;
                case "cpf":
                    if ((jQuery("#" + form + " #" + idField).is(':visible')) && (!verifyCpf(jQuery("#" + form + " #" + idField).val()))) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> inválido!<br>';
                    }
                    break;
                case "cnpj":
                    if ((jQuery("#" + form + " #" + idField).is(':visible')) && (!verifyCnpj(jQuery("#" + form + " #" + idField).val()))) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> inválido!<br>';
                    }
                    break;
                case "email":
                    if (!verifyEmail(jQuery("#" + form + " #" + idField).val())) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> inválido!<br>';
                    }
                    break;
                case "usuario":
                    if (jQuery("#" + form + " #" + idField).val().length < 3) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> inválido!<br>';
                    }
                    break;
                case "senha":
                    if ((jQuery("#" + form + " #" + idField).val().length < 6) && (jQuery("#" + form + " #" + idField).val().length > 0)) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> deve conter no mínimo 6 caracteres!<br>';
                    }
                    break;
                case "time":
                    if (!validaHora(jQuery("#" + form + " #" + idField).val())) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> é uma hora inválida!<br>';
                    }
                    break;
                case "date":
                    if (!validaData(jQuery("#" + form + " #" + idField).val(), false)) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> é uma data inválida!<br>';
                    }
                    break;
                case "data":
                    if (!validaData(jQuery("#" + form + " #" + idField).val(), true)) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> é uma data inválida!<br>';
                    }
                    break;
                case "dateTime":
                    if (!validaDataHora(jQuery("#" + form + " #" + idField).val(), false)) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> é uma data/hora inválida!<br>';
                    }
                    break;
                case "dataHora":
                    if (!validaDataHora(jQuery("#" + form + " #" + idField).val(), true)) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> é uma data/hora inválida!<br>';
                    }
                    break;
                case "aniversario":
                    if (!validaAniversario(jQuery("#" + form + " #" + idField).val())) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> é inválido!<br>';
                    }
                    break;
                case "conferencia":
                    if (jQuery("#" + form + " #" + idField).val() !== jQuery("#" + form + " #" + idField + "_conf").val()) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> deve ser igual a senha de confimação!<br>';
                    }
                    break;
                case "celular":
                    if (!validaCelular(jQuery("#" + form + " #" + idField).val())) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> é inválido!<br>';
                    }
                    break;
                case "fixo":
                    if (!validaTelefoneFixo(jQuery("#" + form + " #" + idField).val())) {
                        setFocus(idField, form);
                        return '<b>' + nameField + '</b> é inválido!<br>';
                    }
                    break;
                default:
                    return 'O validação não encontrada!<br>';
            }
            //            } else {
            //                if(strip_tags(trim(jQuery("#"+form+" #"+idField).val())) == ""){
            //                    setFocus(idField,form);
            //                    return '<b>'+nameField+'</b> é necessário.<br>';
            //                }
            //            }
        }
        return '';
    }

    function replaceAll(string, token, newtoken) {
        while (string.indexOf(token) != -1) {
            string = string.replace(token, newtoken);
        }
        return string;
    }

    function verifyCpf(cpf) {
        cpf = retirarMask(cpf);
        if (cpf == '') {
            return true;
        }
        var numeros, digitos, soma, i, resultado, digitos_iguais;
        digitos_iguais = 1;
        if (cpf.length < 11) {
            return false;
        }
        for (i = 0; i < cpf.length - 1; i++)
            if (cpf.charAt(i) != cpf.charAt(i + 1)) {
                digitos_iguais = 0;
                break;
            }
        if (!digitos_iguais) {
            numeros = cpf.substring(0, 9);
            digitos = cpf.substring(9);
            soma = 0;
            for (i = 10; i > 1; i--) {
                soma += numeros.charAt(10 - i) * i;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0)) {
                return false;
            }
            numeros = cpf.substring(0, 10);
            soma = 0;
            for (i = 11; i > 1; i--) {
                soma += numeros.charAt(11 - i) * i;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1)) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    function verifyCnpj(cnpj) {
        cnpj = retirarMask(cnpj);
        if (cnpj == '') {
            return true;
        }
        var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
        digitos_iguais = 1;
        if (cnpj.length < 14 && cnpj.length < 15) {
            return false;
        }

        for (i = 0; i < cnpj.length - 1; i++) {
            if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
                digitos_iguais = 0;
                break;
            }
        }
        if (!digitos_iguais) {
            tamanho = cnpj.length - 2
            numeros = cnpj.substring(0, tamanho);
            digitos = cnpj.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }
            resultado = (soma % 11 < 2) ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0)) {
                return false;
            }
            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1)) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    function countCaracters(e, elemento, quant) {
        var tecla = (window.event) ? event.keyCode : e.which;

        if (tecla == 0) {
            return true;
        }
        if (tecla == 8) {
            return true;
        }
        var valor = jQuery(elemento).val();
        var total = valor.length;
        if (total < quant) {
            return true;
        } else {
            jQuery(elemento).val(valor.substr(0, quant));
            jAlert('error', 'Quantidade de caracteres máximo (' + quant + ') atingido.', 'Atenção');
            return false;
        }
    }

    function verifyEmail(email) {
        email = trim(email);
        if (trim(email) === '') {
            return true;
        }
        if (email.substr(0, 1) === '.' || email.substr(email.length - 1, 1) === '.') {
            return false;
        }
        var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
        if (er.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    function validaData(value, brasil) {
        if (value.length != 0) {
            if (value.length != 10) {
                return false;
            }
            if (brasil) {
                var data = value;
                var dia = data.substr(0, 2);
                var barra1 = data.substr(2, 1);
                var mes = data.substr(3, 2);
                var barra2 = data.substr(5, 1);
                var ano = data.substr(6, 4);
                if ((data.length != 10) || barra1 != "/" || barra2 != "/" || isNaN(dia) || isNaN(mes) || isNaN(ano) || dia > 31 || mes > 12 || dia === '00' || mes === '00' || ano === '0000') {
                    return false;
                }
                if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia == 31) {
                    return false;
                }
                if (mes == 2 && (dia > 29 || (dia == 29 && ano % 4 != 0))) {
                    return false;
                }
            } else {
                var dataA = value;
                var anoA = dataA.substr(0, 4);
                var barra1A = dataA.substr(4, 1);
                var mesA = dataA.substr(5, 2);
                var barra2A = dataA.substr(7, 1);
                var diaA = dataA.substr(8, 2);
                if ((dataA.length != 10) || barra1A != "-" || barra2A != "-" || isNaN(diaA) || isNaN(mesA) || isNaN(anoA) || diaA > 31 || mesA > 12) {
                    return false;
                }
                if ((mesA == 4 || mesA == 6 || mesA == 9 || mesA == 11) && diaA == 31) {
                    return false;
                }
                if (mesA == 2 && (diaA > 29 || (diaA == 29 && anoA % 4 != 0))) {
                    return false;
                }

            }
        }
        return true;
    }

    function validaHora(value) {
        if (value.length != 0) {
            var horario = value;
            var hora = horario.substr(0, 2);
            var doispontos = horario.substr(2, 1);
            var minuto = horario.substr(3, 2);
            if ((horario.length != 5) || isNaN(hora) || isNaN(minuto) || hora > 23 || minuto > 59 || doispontos != ":") {
                return false;
            }
        }
        return true;
    }

    function validaDataHora(value, brasil) {
        if (value.length != 0) {
            if (value.length != 16) {
                return false;
            }
            var arrOpcoes = value.split(' ');
            if (arrOpcoes.length != 2) {
                return false;
            }
            if ((!validaData(arrOpcoes[0], brasil)) || (!validaHora(arrOpcoes[1]))) {
                return false;
            }
        }
        return true;
    }

    function validaAniversario(value) {
        if (value.length != 0) {
            var data = value + '/2012';
            return validaData(data, true);
        }
        return true;
    }

    function validaCelular(value) {
        value = value.replace("(", "");
        value = value.replace(")", "");
        value = value.replace("-", "");
        value = value.replace(" ", "").trim();
        if (value == '0000000000') {
            return false;
        } else if (value == '00000000000') {
            return false;
        }
        if (["00", "01", "02", "03", , "04", , "05", , "06", , "07", , "08", "09", "10"].indexOf(value.substring(0, 2)) != -1) {
            return false;
        }
        if (value.length < 10 || value.length > 11) {
            return false;
        }
        if (["6", "7", "8", "9"].indexOf(value.substring(2, 3)) == -1) {
            return false;
        }
        return true;
    }

    function validaTelefoneFixo(value) {
        value = value.replace("(", "");
        value = value.replace(")", "");
        value = value.replace("-", "");
        value = value.replace(" ", "").trim();
        if (value == '0000000000') {
            return false;
        } else if (value == '00000000000') {
            return false;
        }
        if (["00", "01", "02", "03", , "04", , "05", , "06", , "07", , "08", "09", "10"].indexOf(value.substring(0, 2)) != -1) {
            return false;
        }
        if (value.length < 10 || value.length > 11) {
            return false;
        }
        if (["1", "2", "3", "4", "5"].indexOf(value.substring(2, 3)) == -1) {
            return false;
        }
        return true;
    }


})(jQuery);

function setFocus(idField, form) {
    if (jQuery("#" + form + " #" + idField).parents('.control-group').length) {
        jQuery("#" + form + " #" + idField).parents('.control-group').addClass('error');
    } else {
        jQuery("#lbl_" + idField).css('color', '#b94a48');
    }

    jQuery("#" + form + " #" + idField).focus();

    var idTab = jQuery('#' + form + ' #' + idField + '').parents('.tab-pane').attr('id');
    jQuery('#' + form + ' a[href="#' + idTab + '"]').tab('show');
}