Parceiro = function() {
    $this = this;

    ParceiroMethods = {
        initialize: function() {
            // jQuery.gDisplay.loadStart();
            this.onLoad();
        },
        onLoad: function() {

            $this.ParceiroMethods.loadPage();

            // Carrega produtos
            if (!jQuery.lockrStorage.get('produtos')) {
                jQuery.gApi.exec('GET', 'http://integracaogtsis.tempsite.ws/api/ProdutosIndicacao', {},
                    function(json) {
                        if (json.length > 0) {
                            jQuery.lockrStorage.set('produtos', json)
                        }
                    },
                    function(err) {
                        console.log(err);
                    });
            } else {
                // Produtos
                var listaProdutos = this.buildListPro();
                console.log(listaProdutos);
                var menuProdutos = this.buidDropDown('Indicar', listaProdutos);
                $('.nav-item-produtos').html(menuProdutos);
                // console.log(this.buidDropDown('teste', jQuery.lockrStorage.get('produtos')));
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
            switch (data.produto) {
                case 1: // Imóvel
                    console.log('Carrega Imóvel');
                    break;
                case 2: // Financiamento
                    console.log('Carrega Financiamento');
                    break;
                case 3: // Consorcio
                    console.log('Carrega Consórcio');
                    break;

                default:
                    break;
            }
        },
        loadPage: function() {
            $('#load_page').load('pages/home.html', function() {
                console.log('ok');
            });
        }
    };
    ParceiroMethods.initialize();
};

$(function() {
    Parceiro();
});