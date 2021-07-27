const qs = ( e ) => document.querySelector( e );
const qsa = ( e ) => document.querySelectorAll( e );

/* 
Mapeia o JSON que contém as informações sobre as pizzas e adiciona elas na tela
*/
pizzaJson.map( (item, key) => {
	// Clona o elemento que contém as informações da pizza
	let pizza = qs( '.models .pizza-item' ).cloneNode( true );

	// Adiciona os elementos na area que eles serão exibidos
	qs( '.pizza-area' ).append( pizza );
} );