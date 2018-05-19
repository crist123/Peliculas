angular.module('peliculasApp').controller('indexController', controllerPeliculas);

function controllerPeliculas($scope, $http, $timeout) {

    var vm = this;

    //Almacena los resultados de la búsqueda
    vm.resultados = [];
    vm.totalPag = 0;
    vm.pag = 1;
    vm.busqueda = "";

    vm.tabs = [
        {
            title: "Series",
            filtro: "tv",
            index: 1
        },
        {
            title: "Peliculas",
            filtro: "movie",
            index: 2
        },
        {
            title: "Compañias",
            filtro: "company",
            index: 3
        },
        {
            title: "Palabras Clave",
            filtro: "keyword",
            index: 4
        },
        {
            title: "Colecciones",
            filtro: "collection",
            index: 5
        }
    ];

    vm.init = function () {
        vm.obtenerInfo('a', null, 'multi', false);
    }

    vm.iniciarTab = function () {

        if (vm.busqueda) {
            vm.tabActiva = 0;
            vm.activarVistaPeli = true;

            $timeout(function () {
                $scope.$apply();

                $('html,body').animate({
                    scrollTop: $("#pelicula").offset().top - 10
                }, 1000);
                $('#busq2').focus();
            })
        }
    }

    /**
     * Obtiene la información de las peliculas acorde a la búsqueda
     * @param {string} accion Acción a ejecutar en el método (++,--,mover)
     * @param {string} filtro Filtra la query de acuerdo al tema
     * */
    vm.obtenerInfo = function (busqueda, accion, filtro, reiniciarTabs) {

        vm.totalPag = 1;
        vm.totalResults = 0;

        // No continua sin filtro
        if (!filtro)
            return;

        // Si hay acción incrementa o decrementa el contador de pag
        if (accion && accion != "mover")
            eval("vm.pag" + accion);
        else if (!accion)
            vm.pag = 1;

        // Si se desea reiniciar las tabs
        if (reiniciarTabs)
            vm.tabActiva = 0;

        // Hace la consulta en la api para obtener los datos
        if (busqueda) {
            vm.cargando = true;
            // vm.resultados = [];
            $http.get("https://api.themoviedb.org/3/search/" + filtro + "?api_key=627f5aa49c72d956816a42be38b338cd&language=es_ES&query=" + busqueda + (accion ? ("&page=" + vm.pag) : ""))
                .then(function (rpt) {

                    // Si hay respuesta
                    if (rpt && rpt.data.results.length) {

                        var temp = [];

                        _.each(rpt.data.results, function (result) {
                            result.titulo = result.title || result.name;
                            if (result.media_type != "person" && result.media_type != "network" && filtro == "multi")
                                temp.push(result);
                        });

                        vm.resultados = temp.length > 0 ? temp : rpt.data.results;
                        vm.totalPag = rpt.data.total_pages;
                        vm.totalResults = rpt.data.total_results;

                        if (accion == "mover")
                            vm.moverA("pelicula");

                    } else {
                        vm.error = "No se encontro la búsqueda";
                        vm.resultados = [];
                        $('#busq1').focus();
                    }
                    vm.cargando = false;
                }, function (data) {
                    vm.resultados = [];
                    vm.cargando = false;
                    vm.error = "No se encontro la búsqueda";
                });
        } else {
            vm.resultados = [];
            vm.cargando = false;
            vm.activarVistaPeli = false;
        }

    }

    vm.moverA = function (idSeccion) {
        if (idSeccion)
            $timeout(function () {
                $scope.$apply();

                $('html,body').animate({
                    scrollTop: $("#" + idSeccion).offset().top - 10
                }, 1000);
            });
    }

    vm.init();
}
