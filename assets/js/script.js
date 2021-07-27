// Atalhos 
const qs = ( e ) => document.querySelector( e );
const qsa = ( e ) => document.querySelectorAll( e );

// Variáveis
let pizzaQntd ;

/* 
Mapeia o JSON que contém as informações sobre as pizzas e adiciona elas na tela
*/
pizzaJson.map( (item, key) => {
	// Clona o elemento que contém as informações da pizza
	let pizza = qs( '.models .pizza-item' ).cloneNode( true );

	// Adiciona o ID de identificação ao item clonado
	pizza.setAttribute( 'data-key', key);

	// Pega os valores do JSON e passa eles para o elementos em HTML preenchendo os campos
	pizza.querySelector( '.pizza-item--img img' ).src = item.img;
	pizza.querySelector( '.pizza-item--price' ).innerHTML =
	item.price.toLocaleString( 'pt-br', { style: 'currency', currency: 'BRL' } ); pizza.querySelector
	( '.pizza-item--name' ).innerHTML = item.name; pizza.querySelector
	( '.pizza-item--desc' ).innerHTML = item.description;


	// Abre o pop-up para usuário poder escolher como quer e pedir a pizza
	pizza.querySelector('a').addEventListener( 'click', (e) => {
		e.preventDefault();

		// Pega o ID da pizza clicada
		let pizzaId = e.target.closest( '.pizza-item' ).getAttribute( 'data-key' );
		pizzaQntd = 1;

		// Altera as informações de pizzaWindowArea para as informações da pizza clicada de acordo com o ID
		qs( '.pizzaBig img' ).src = pizzaJson[ pizzaId ].img;
		qs( '.pizzaInfo h1' ).innerHTML = pizzaJson[ pizzaId ].name;
		qs( '.pizzaInfo--desc' ).innerHTML = pizzaJson[ pizzaId ].description;
		qs( '.pizzaInfo--actualPrice' ).innerHTML = item.price.toLocaleString( 'pt-br', { style: 'currency', currency: 'BRL' } );
		
		// Reseta o tamanho selecionado da pizza
		qs( '.pizzaInfo--size.selected' ).classList.remove( 'selected' );

		// Pega o peso da pizza e imprimi na tela
		qsa( '.pizzaInfo--size' ).forEach( ( size, sizeIndex ) => {
			if (sizeIndex === 2) {
				size.classList.add( 'selected' );
			}

			size.querySelector( 'span' ).innerHTML = pizzaJson[ pizzaId ].sizes[ sizeIndex ];
		} );

		// Reseta o número de pizzas no carrinho
		qs( '.pizzaInfo--qt' ).innerHTML =  pizzaQntd;

		qs( '.pizzaWindowArea' ).style.opacity = 0;
		qs( '.pizzaWindowArea' ).style.display = 'flex';

		setTimeout( () => {
			qs( '.pizzaWindowArea' ).style.opacity = 1;
		}, 100 )
	} )

	// Adiciona os elementos na area que eles serão exibidos
	qs( '.pizza-area' ).append( pizza );
} );