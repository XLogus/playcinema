<?php
require_once("../wp-load.php");
$nuevos="w=120&h=120&zc=1&q=80";
$json = array();
$args = array(
    'post_type' => 'pelicula',
    'post_per_page' => 10,
    'featured' => 'yes'
);

$the_query = new WP_Query( $args );
if ( $the_query->have_posts() ) {        
	while ( $the_query->have_posts() ) {
		$the_query->the_post();
        $post_id = get_the_ID();
        $thumb = get_post_meta($post_id, 'sn_image_post_preview', true);
        $custom_fields = get_post_custom();
                
		$json[] = array (
            'id' => $post_id,
            'title' => get_the_title(),
            'content' => $custom_fields['pelicula_sinopsis'][0],
            'reparto' => $custom_fields['pelicula_reparto'][0],
            'genero' => $custom_fields['pelicula_genero'][0],
            'clasificacion' => $custom_fields['pelicula_clasificacion'][0],
            'duracion' => $custom_fields['pelicula_duracion'][0],
            'trailer' => $custom_fields['pelicula_trailer'][0],
            //'thumb' => get_the_post_thumbnail( $post_id, 'medium' )
            //'thumb' => wp_get_attachment_image_src(get_the_post_thumbnail($post_id, 'thumb'))            
            'thumb' => get_image('pelicula_imagen_destacada',1,1,0,NULL,$nuevos)
        );
	}        
} else {
	// no posts found
}
/* Restore original Post Data */
wp_reset_postdata();

echo $_GET['jsoncallback'].'({"items":'. json_encode($json).'})';
?> 