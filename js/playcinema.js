var serviceURL = "http://playcinema.net/cinemaApp/";
var pelas;

$(document).bind( "pagebeforechange", function( e, data ) {
    if ( typeof data.toPage === "string" ) {
        var u = $.mobile.path.parseUrl( data.toPage );
        var params = hashParams(u.hash);
        
        var re1 = /^#cartelera/;
        var re2 = /^#pelicula/;
        
        if ( u.hash.search(re1) !== -1 ) {
            getPeliculas();
        } else if( u.hash.search(re2) !== -1 ){            
            getDetallePelicula(u, params, data.options);            
            e.preventDefault()
        } else {
            //e.preventDefault();
        }
    }
});


        
function getPeliculas() {        
        $.getJSON(serviceURL + 'cartelera.php?jsoncallback=?').done(function(data) {
            $('#carteleraList li').remove();    
            pelas = data.items;
            $.each(pelas, function(index, pela) {
                rpta = '<li>';
                rpta += '<a href="#pelicula?id='+pela.id+'">';
                rpta += '<img src="'+pela.thumb+'" />';
                rpta += '<h3>'+pela.title+'</h3>';
                rpta += '<p>Horarios: '+pela.horarios+'</p>';
                rpta += '</a>';
                rpta += '</li>';
                $("#carteleraList").append(rpta);
                $('#carteleraList').listview('refresh');    
            });
        });        
    }

function getDetallePelicula(url, params, options) {
    var id = params['id'];
    var $page = $('#pelicula');
    var contenido = 'No se encontró';
    
    // Establecer header
    //$header = $page.children( ":jqmData(role=header)" );    
    //$header.find( "h1" ).html( 'Mi Pelicula' );
    
    
    $.each(pelas, function(index, pela) {
        if(pela.id == id) {
            detalles = '<p><b>Duración: </b>'+pela.duracion+'</p>';
            detalles += '<p><b>Género: </b>'+pela.genero+'</p>';
            detalles += '<p><b>Clasificación: </b>'+pela.clasificacion+'</p>';
            detalles += '<p><b>Reparto: </b>'+pela.reparto+'</p>';
            
            contenido = '<h2 class="page-title">'+pela.title+'</h2>';
            contenido += '<p><img src="'+pela.thumb+'" /></p>';
            // Horarios
            contenido += '<div data-role="collapsible-set">';
            contenido += '<h3>Horarios</h3>';
            contenido += '<p>Horarios: '+pela.horarios+'</p>';
            contenido += '</div>';
            // Datos
            contenido += '<div data-role="collapsible-set">';
            contenido += '<h3>Datos</h3>';
            contenido += '<p>'+detalles+'</p>';
            contenido += '</div>';
            // Sinopsis
            sinopsis = pela.content;
            sinopsis = sinopsis.replace(new RegExp("\n","g"));
            contenido += '<div data-role="collapsible-set">';
            contenido += '<h3>Sinopsis</h3>';
            contenido += '<p>'+sinopsis+'</p>';
            contenido += '</div>';
        }
    });
    
    // Get the content element for the page to set it
    $content = $page.children( ":jqmData(role=content)" );
    $content.html(contenido);
    $content.find('div[data-role=collapsible-set]').collapsible({theme:'e',refresh:true});
    
    // Actualizar URL
    options.dataUrl = url.href;
    $.mobile.pageContainer.pagecontainer("change", $page, { 
        transition: 'flip',
        changeHash: false
    });
        
}


// parse params in hash
function hashParams(hash) {
		var ret = {};
	    var match;
	    var plus   = /\+/g;
	    var search = /([^\?&=]+)=([^&]*)/g;
	    var decode = function(s) { 
	    	return decodeURIComponent(s.replace(plus, " ")); 
	    };
	    while( match = search.exec(hash) ) ret[decode(match[1])] = decode(match[2]);
	    
	    return ret
	};