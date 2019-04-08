Parceiro = function() {
    $this = this;

    ParceiroMethods = {
        initialize: function() {
            jQuery.gDisplay.loadStart();
            this.onLoad();
        },
        onLoad: function() {
            // DropDown
            $(".dropdown-submenu a.test").on("click", function(e) {
                $(this)
                    .next("ul")
                    .toggle();
                e.stopPropagation();
                e.preventDefault();
            });
        }
    };
    ParceiroMethods.initialize();
};

$(function() {
    Parceiro();
});