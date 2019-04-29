Parceiro = function() {
    $this = this;
    PARAM_PAGE = {};
    ParceiroMethods = {
        initialize: function() {
            // jQuery.gDisplay.loadStart();
            this.onLoad();
        },
        onLoad: function() {

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
                                // ParceiroMethods.showProdutos();
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
                var data = $(this).data();
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
                }
                return false;
            });

            // nova indicação
            $(document).on('submit', '#nova-indicacao', function(e) {
                var dados = $(this).serializeObject();
                console.log(dados);
                if ($('form#nova-indicacao').gValidate()) {
                    jQuery.gApi.exec('GET', 'http://integracaogtsis.tempsite.ws/api/Parceiros/Usuarios/' + dados.login + '/' + dados.senha, {},
                        function(json) {
                            if (sizeObj(json) > 0) {
                                jQuery.lockrStorage.set('usuario', json);
                                // ParceiroMethods.showProdutos();
                                ParceiroMethods.showLogado(true);
                            }
                        },
                        function(err) {
                            console.log(err);
                        });
                }
                return false;
            });
        },
        buidDropDown: function(titulo, data) {
            // Monta menu

            var html = '';
            html += '<li class="nav-item dropdown">';
            html += '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
            html += titulo;
            html += '</a>';
            html += '<div class="dropdown-menu" aria-labelledby="navbarDropdown">';
            $.each(data, function(i, item) {
                html += '<a class="dropdown-item item-load-page" href="#" data-page="indicar" data-title="Indicação" data-produto="' + item.id + '">';
                html += item.Titulo;
                html += '</a>';
            });
            html += '</div>';
            html += '</li>';
            // html += '<div class="dropdown">';
            // html += '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
            // html += titulo;
            // html += '</a>';
            // html += '<ul class="dropdown-menu">';
            // $.each(data, function(i, item) {
            //     html += '<li class="dropdown-submenu">';
            //     html += '<a tabindex="-1" href="#" class="test dropdown-item item-load-page"  data-page="indicar" data-title="Indicação" data-produto="' + item.id + '">';
            //     html += item.Titulo;
            //     // if (item.Submenu) {
            //     //     html += '<i class="fas fa-caret-right"></i>';
            //     // }
            //     // html += '</a>';
            //     // if (item.Submenu) {
            //     //     html += '<ul class="dropdown-menu">';
            //     //     $.each(item.Submenu, function(i, submenu) {
            //     //         html += '<li class="dropdown-submenu">';
            //     //         html += '<a tabindex="-1" href="#" data-page="indicar" data-title="Indicação" data-produto="' + item.id + '" data-tipo="' + submenu.Url + '" class="dropdown-item item-load-page">';
            //     //         html += submenu.Titulo;
            //     //         html += '</a>';
            //     //         html += '</li>';
            //     //     })
            //     //     html += '</ul>';
            //     // }
            //     html += '</li>';
            // })
            // html += '</ul>';
            // html += '</div>';
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
                PARAM_PAGE = params;
            });
        },
        showProdutos: function() {
            // Carrega produtos
            var produtoStorage = jQuery.lockrStorage.get('produtos')
            console.log(produtoStorage);
            if (!produtoStorage || produtoStorage === undefined) {
                jQuery.gApi.exec('GET', 'http://integracaogtsis.tempsite.ws/api/ProdutosIndicacao', {},
                    function(json) {
                        if (json.length > 0) {
                            jQuery.lockrStorage.set('produtos', json);
                            var listaProdutos = $this.ParceiroMethods.buildListPro();
                            var menuProdutos = $this.ParceiroMethods.buidDropDown('Indicar', listaProdutos);
                            $('.nav-item-produtos').html(menuProdutos);
                            jQuery.gApi.load('home.html');
                        }
                    },
                    function(err) {
                        console.log(err);
                    });
            } else {
                // Produtos
                var listaProdutos = this.buildListPro();
                var menuProdutos = this.buidDropDown('Indicar', listaProdutos);
                $('.nav-item-produtos').html(menuProdutos);
                jQuery.gApi.load('home.html');
            }
        },
        showLogado: function(logado) {
            if (logado) {
                $('html').addClass('user-logado');
                $('.menu-lista').css('display', 'inline-flex');
                $('.logado').css('display', 'block');
                $('.logado .load-nome').text(jQuery.lockrStorage.get('usuario').Nome);
                $('form[name=form-login]').css('display', 'none');
            } else {
                $('html').removeClass('user-logado');
                $('.menu-lista').css('display', 'none');
                $('.logado').css('display', 'none');
                $('form[name=form-login]').css('display', 'inline-flex');
                $('.logado .load-nome').text('');
                ParceiroMethods.buildLoadPage({ page: home });
            }
        }
    };
    ParceiroMethods.initialize();
};


$(function() {
    Parceiro();
});