// Atalhos 
const qs = ( e ) => document.querySelector( e );
const qsa = ( e ) => document.querySelectorAll( e );

// Variáveis
let pizzaQntd;
let cart = [];
let selectedPizza;

/* 
Mapeia o JSON que contém as informações sobre as pizzas e adiciona elas na tela
*/
pizzaJson.map( ( item, key ) => {
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
	pizza.querySelector( 'a' ).addEventListener( 'click', ( e ) => {
		e.preventDefault();

		// Pega o ID da pizza clicada
		let pizzaId = e.target.closest( '.pizza-item' ).getAttribute( 'data-key' );
		pizzaQntd = 1;
		selectedPizza = pizzaId;

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

/* Eventos do Popup */

// Fechar popup
const closePopup = () => {
	qs( '.pizzaWindowArea' ).style.opacity = 0;

	setTimeout( () => {
		qs( '.pizzaWindowArea' ).style.display = 'none';
	}, 500 );
}

qsa( '.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton' ).forEach( ( item ) => {
	item.addEventListener( 'click', closePopup );
} );

// Botão de menos do popup
qs( '.pizzaInfo--qtmenos' ).addEventListener( 'click', () => {
	if (pizzaQntd > 1) { 
		pizzaQntd--;
		qs( '.pizzaInfo--qt' ).innerHTML =  pizzaQntd;	
	}
} );

// Botão de mais do popup 
qs( '.pizzaInfo--qtmais' ).addEventListener( 'click', () => {
	pizzaQntd++;
	qs( '.pizzaInfo--qt' ).innerHTML =  pizzaQntd;
} );

// Controle do tamanho de pizza escolhido
qsa( '.pizzaInfo--size' ).forEach( ( size, sizeIndex ) => {
	size.addEventListener( 'click', (e) => {
		qs( '.pizzaInfo--size.selected' ).classList.remove( 'selected' );
		size.classList.add( 'selected' );
	} );
} );

// Funcionalidade do botão de adicionar pizzas do popup
qs( '.pizzaInfo--addButton' ).addEventListener( 'click', () => {
	let pizzaSize = parseInt( qs( '.pizzaInfo--size.selected' ).getAttribute('data-key') );

	// Identificador de pizza de acordo com o tamanho9
	let identifier = pizzaJson[ selectedPizza ].id + '@' + pizzaSize;

	// Checa se a pizza adicionada já existe no  carrinho
	let key = cart.findIndex( item => item.identifier == identifier );

	// Se a pizza adiciona já existir aumenta a quantidade, se não adiciona uma nova pizza
	if ( key > -1 ) {
		cart[ key ].qt += pizzaQntd;
	} else {
		// Adiciona pizza ao carrinho
		cart.push( {
			identifier,
			id: pizzaJson[ selectedPizza ].id,
			pizzaSize,
			qt: pizzaQntd
		});
	}

	// Fecha o popup
	updateCart();
	closePopup();
} );

// Atualiza o carrinho 
function updateCart() {
	qs( '.menu-openner span' ).innerHTML = cart.length;

	if (cart.length > 0) {
		qs( 'aside' ).classList.add( 'show' );
		qs( '.cart' ).innerHTML = '';

		let subtotal = 0;
		let total = 0;
		let discount = 0;


		for ( let i in cart ) {
			let pizza = pizzaJson.find( item => item.id == cart[ i ].id ) ;

			subtotal += pizza.price * cart[ i ].qt;

			let cartItem = qs( '.models .cart--item' ).cloneNode( true );
			let pizzaSizeName;

			switch ( cart[ i ].pizzaSize ) {
                case 0:
                    pizzaSizeName = 'P'; 
                    break;
                case 1:
                    pizzaSizeName = 'M'; 
                    break;
                case 2:
                    pizzaSizeName = 'G'; 
                    break;
                default:
                    break;
            	}

			let pizzaName = `${ pizza.name } (${ pizzaSizeName })`;

			// Imprimi na aba do carrinho as informações da pizza selecionada
			cartItem.querySelector( 'img' ).src = pizza.img;
			cartItem.querySelector( '.cart--item-nome' ).innerHTML = pizzaName;
			cartItem.querySelector( '.cart--item--qt' ).innerHTML = cart[ i ].qt;

			// Alterar quantidade de pizzas pelo carrinho
			cartItem.querySelector( '.cart--item-qtmais' ).addEventListener( 'click', () => {
				cart[ i ].qt++;
				updateCart();
			} );

			cartItem.querySelector( '.cart--item-qtmenos' ).addEventListener( 'click', () => {
				if ( cart[ i ].qt > 1 ) {
					cart[ i ].qt--;
				} else {
					cart.splice( i, 1 );					
				}
				updateCart();
			} );

			qs( '.cart' ).append( cartItem );
		}

		// Desconto e valor total da pizza
		discount = subtotal * 0.1
		total = subtotal - discount;

		// Imprimi os preços na tela formatados em real
		qs( '.subtotal span:last-child' ).innerHTML = subtotal.toLocaleString( 'pt-br', { style: 'currency', currency: 'BRL' } );
		qs( '.desconto span:last-child' ).innerHTML = discount.toLocaleString( 'pt-br', { style: 'currency', currency: 'BRL' } );
		qs( '.total span:last-child' ).innerHTML = total.toLocaleString( 'pt-br', { style: 'currency', currency: 'BRL' } );
	} else {
		qs( 'aside' ).classList.remove( 'show' );
		qs( 'aside' ).style.left = '100vw';
	}
}

// Abre o carrinho no mobile
qs( '.menu-openner' ).addEventListener( 'click', () => {
	if ( cart.length > 0 ) {
		qs( 'aside' ).style.left = '0';
	}
} );

// Fecha o carrinho no mobile 
qs( '.menu-closer' ).addEventListener( 'click', () => {
	if ( cart.length > 0 ) {
		qs( 'aside' ).style.left = '100vw';
	}
} );