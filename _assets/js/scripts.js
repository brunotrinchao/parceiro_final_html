Parceiro = function() {
    $this = this;
    PARAM_PAGE = {};
    ParceiroMethods = {
        initialize: function() {
            // jQuery.gDisplay.loadStart();
            this.onLoad();
        },
        onLoad: function() {
			ParceiroMethods.initLogado();
            // Login
            var usuariosStorage = jQuery.lockrStorage.get('usuario');
            if (!usuariosStorage || usuariosStorage === undefined) {
                $('form[name=form-login]').submit(function(e) {
                    e.preventDefault();
                    var dados = $(this).serializeObject();
                    jQuery.gApi.exec('GET', 'http://integracaogtsis.tempsite.ws/api/Parceiros/Usuarios/' + dados.login + '/' + dados.senha, {},
                        function(json) {
                            if (sizeObj(json) > 0) {
                                jQuery.lockrStorage.set('usuario', json);
                                ParceiroMethods.getAdm();
                                ParceiroMethods.showLogado(true);
                            }
                        },
                        function(err) {
                            console.log(err);
                        });
                });
            } else {
                $('.menu-lista').show();
                ParceiroMethods.showLogado(true);
            }
            ParceiroMethods.showProdutos();

            // DropDown
            $(".dropdown-submenu a.test").on("click", function(e) {
                $(this).parent().parent().find('.dropdown-menu').hide();
                $(this).next('ul').toggle();
                e.stopPropagation();
                e.preventDefault();
            });

            // Carrega Pagina
            $(document).on('click', '.item-load-page', function(e) {
                e.preventDefault();
				var usuariosStorage = jQuery.lockrStorage.get('usuario');
				if (!usuariosStorage || usuariosStorage === undefined) {
					jQuery.gDisplay.showError('Acesso negado!');
					return;
				}
                var data = $(this).data();
				console.log(data);
                ParceiroMethods.buildLoadPage(data);
                var li = $(this).parents('li.nav-item');
                $('.nav-item').removeClass('active');
                $(li).addClass('active');
            });

            $(document).on('click', '#logout', function() {
                jQuery.lockrStorage.removeItem('usuario');
                if (!jQuery.lockrStorage.get('usuario') ||
                    jQuery.lockrStorage.get('usuario') === undefined) {
                    ParceiroMethods.showLogado(false);
                    document.location.reload();
                }
                return false;
            });

            // nova indicação
            $(document).on('submit', '#nova-indicacao', function(e) {
                var dados = $(this).serializeObject();
                if ($('form#nova-indicacao').gValidate()) {
                    var param = ParceiroMethods.montaObjPost(dados);
                    jQuery.gApi.exec('POST', 'http://integracaogtsis.tempsite.ws/api/V1/Indicacoes/Supercredito', param,
                        function(json) {
                            if (json.Code >= 200 && json.Code < 300) {
                                jQuery.gDisplay.showSuccess(json.Message.Success, function() {
                                    $('form#nova-indicacao')[0].reset();
                                });
                            } else {
                                jQuery.gDisplay.showAlert(json.Message.Error);
                            }
                        },
                        function(xhr, status, error) {
                            jQuery.gDisplay.showError(montaErro(xhr.responseJSON.Message.Error));
                        });
                }
                return false;
            });
        },
		initLogado: function(){
			var usuario = jQuery.lockrStorage.get('usuario');
			if(usuario){
				ParceiroMethods.showLogado(true);
				return;
			}
			ParceiroMethods.showLogado(false);
		},
        buidDropDown: function(titulo, data) {
            // Monta menu
            console.log(data);
            var html = '';
            html += '<li class="nav-item dropdown">';
            html += '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
            html += titulo;
            html += '</a>';
            html += '<div class="dropdown-menu" aria-labelledby="navbarDropdown">';
            $.each(data, function(i, item) {
                if(item.Ativo){
                var classLoad = (ParceiroMethods.serachString(item.Url, 'http')) ? '' : 'item-load-page';
                var linkUrl = (!ParceiroMethods.serachString(item.Url, 'http')) ? '' : item.Url;
                html += '<a class="dropdown-item ' + classLoad + '" href="' + linkUrl + '" target="_blank" data-page="indicacao" data-url="' + item.Url + '" data-title="Indicação - ' + item.Titulo + '" data-produto="' + item.id + '">';
                html += item.Titulo;
                html += '</a>';
                }
            });
            html += '</div>';
            html += '</li>';
            return html;
        },
        buildListPro: function() {
            var listaProdutos = jQuery.lockrStorage.get('produtos');
            $.each(listaProdutos, function(i, item) {
                switch (item.Url) {
                    case 'imovel':
                        listaProdutos[i].Submenu = [{
                            Titulo: 'Proprietário',
                            Url: 'proprietario'
                        }, {
                            Titulo: 'Interessado',
                            Url: 'interessado'
                        }]
                        break;
                    case 'financiamento':
                        listaProdutos[i].Submenu = [{
                            Titulo: 'Tradicional',
                            Url: 'tradicional'
                        }, {
                            Titulo: 'Refinanciamento',
                            Url: 'refinanciamento'
                        }]
                        break;
                    case 'consorcio':
                        listaProdutos[i].Submenu = [{
                            Titulo: 'Auto',
                            Url: 'auto'
                        }, {
                            Titulo: 'Imóvel',
                            Url: 'imovel'
                        }]
                        break;
                        // case 'regula':
                        //     listaProdutos[i].Submenu = [{
                        //         Titulo: 'Auto' 
                        //     }, {
                        //         Titulo: 'Imóvel'
                        //     }]
                        break;

                    default:
                        break;
                }
            })
            return listaProdutos;
        },
        buildLoadPage: function(data) {
            // window.history.pushState(data.page, data.title, data.page + '.html');
            $('#navbarToggler').collapse('hide');
            jQuery.gApi.load(data.page + '.html', '', data, function(params) {
                PARAM_PAGE.title = (params.title) ? params.title : PARAM_PAGE.title;
                PARAM_PAGE.page = (params.page) ? params.page : PARAM_PAGE.page;
                PARAM_PAGE.url = (params.url) ? params.url : PARAM_PAGE.url;
                PARAM_PAGE.produto = (params.produto) ? params.produto : PARAM_PAGE.produto;
                $('.titulo_pagina h1').text(PARAM_PAGE.title);
            });
        },
        showProdutos: function() {
            // Carrega produtos
            var produtoStorage = jQuery.lockrStorage.get('produtos');
            if (!produtoStorage || produtoStorage === undefined) {
                jQuery.gApi.exec('GET', 'http://integracaogtsis.tempsite.ws/api/ProdutosIndicacao', {},
                    function(json) {
                        if (json.length > 0) {
                            jQuery.lockrStorage.set('produtos', json);
                            var listaProdutos = $this.ParceiroMethods.buildListPro();
                            var menuProdutos = $this.ParceiroMethods.buidDropDown('Indicação', listaProdutos);
                            $('.nav-item-produtos').html(menuProdutos);
                            // jQuery.gApi.load('dashboard.html');
                        }
                    },
                    function(err) {
                        console.log(err);
                    });
            } else {
                // Produtos
                var listaProdutos = this.buildListPro();
                var menuProdutos = this.buidDropDown('Indicação', listaProdutos);
                $('.nav-item-produtos').html(menuProdutos);
                // jQuery.gApi.load('dashboard.html');
            }
        },
        showLogado: function(logado) {
            if (logado) {
                $('html').addClass('user-logado');
                $('.menu-lista').css('display', 'inline-flex');
                $('.logado').css('display', 'block');
                $('.logado .load-nome').text(jQuery.lockrStorage.get('usuario').Nome);
                $('form[name=form-login]').css('display', 'none');
                ParceiroMethods.getAdm();
				var usuario = jQuery.lockrStorage.get('usuario');
				if(usuario.EhMaster){
					ParceiroMethods.buildLoadPage({ page: 'dashboard' });
				}
            } else {
                $('html').removeClass('user-logado');
                $('.menu-lista').css('display', 'none');
                $('.logado').css('display', 'none');
                $('form[name=form-login]').css('display', 'inline-flex');
                $('.logado .load-nome').text('');
                $('.item-nav-admin').html('');
                ParceiroMethods.buildLoadPage({ page: 'home' });
            }
        },
        serachString: function(str, search) {
            var string = str,
                substring = search;
            return string.indexOf(substring) !== -1;
        },
        montaObjPost: function(data) {
            var ret = {};
            var prod = {};
            $.each(data, function(i, item) {
                var exp = i.split('_');
                if (exp[1]) {
                    prod[exp[1]] = item;
                } else {
                    ret[i] = item;
                }
            });
            ret.idUsuarioParceiro = ParceiroMethods.getIdParceiro();
            ret['Produto'] = prod;
            return ret;
        },
        getIdParceiro() {
            var usuario = jQuery.lockrStorage.get('usuario');
            if (usuario.id) {
                return usuario.id
            }
            return false;
        },
        getAdm: function() {
            var usuario = jQuery.lockrStorage.get('usuario');
            var html = '';
            if (usuario.EhMaster) {
                html += '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownAdm" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Admin</a>';
                html += '<div class="dropdown-menu" aria-labelledby="navbarDropdownAdm">';
                html += '<a class="dropdown-item item-load-page" data-page="admin/admin-ajuda" data-title="Admin - Ajuda" href="#">Ajuda</a>';
                html += '<a class="dropdown-item item-load-page" data-page="admin/admin-arquivo" data-title="Admin - Arquivos" href="#">Arquivos</a>';
                html += '<a class="dropdown-item item-load-page" data-page="admin/admin-produto" data-title="Admin - Produtos" href="#">Produto</a>';
                html += '</div>';
            }
            $('.nav-item-admin').html(html);
        }
    };
    ParceiroMethods.initialize();
};


$(function() {
    Parceiro();
});