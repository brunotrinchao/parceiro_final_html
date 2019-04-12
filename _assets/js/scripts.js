Parceiro = function() {
    $this = this;

    ParceiroMethods = {
        initialize: function() {
            // jQuery.gDisplay.loadStart();
            this.onLoad();
        },
        onLoad: function() {

            // Carrega produtos
            if (!jQuery.lockrStorage.get('produtos')) {
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

            // DropDown
            $(".dropdown-submenu a.test").on("click", function(e) {
                $(this).parent().parent().find('.dropdown-menu').hide();
                $(this).next('ul').toggle();
                e.stopPropagation();
                e.preventDefault();
            });

            // Carrega Pagina
            $('.item-load-page').click(function(e) {
                e.preventDefault();
                var data = $(this).data();
                ParceiroMethods.buildLoadPage(data);
            });



        },
        buidDropDown: function(titulo, data) {
            // Monta menu
            var html = '';
            html += '<div class="dropdown">';
            html += '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
            html += titulo;
            html += '</a>';
            html += '<ul class="dropdown-menu">';
            $.each(data, function(i, item) {
                html += '<li class="dropdown-submenu">';
                html += '<a tabindex="-1" href="#" class="test dropdown-item">';
                html += item.Titulo;
                if (item.Submenu) {
                    html += '<i class="fas fa-caret-right"></i>';
                }
                html += '</a>';
                if (item.Submenu) {
                    html += '<ul class="dropdown-menu">';
                    $.each(item.Submenu, function(i, submenu) {
                        html += '<li class="dropdown-submenu">';
                        html += '<a tabindex="-1" href="#" data-page="indicar" data-produto="' + item.id + '" data-tipo="' + submenu.Url + '" class="dropdown-item item-load-page">';
                        html += submenu.Titulo;
                        html += '</a>';
                        html += '</li>';
                    })
                    html += '</ul>';
                }
                html += '</li>';
            })
            html += '</ul>';
            html += '</div>';
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
            console.log(data);
            jQuery.gApi.load(data.page + '.html', '', data, function() {
                console.log(teste);
            });
        }
    };
    ParceiroMethods.initialize();
};

$(function() {
    Parceiro();
});