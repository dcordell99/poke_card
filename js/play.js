let currPokemon = {}
let pokemonInput = document.querySelector('.pokemon-select-input');
let pokeball = document.querySelector('.pokeball');
let pokeballTop = document.querySelector('.pokeball__top');
let cardContainer = document.querySelector('.card-container');
let viewCollectionBtn = document.querySelector('.viewcollection');
let myCollectionContainer = document.querySelector('.mydeck-container');
let myCollection = document.querySelector('.mydeck')

function hasPokemons() {
	if(window.localStorage.getItem('pokemons') !== null) return true;
}

function showOrHideCollectionBtn() {
  if(hasPokemons()) {
	viewCollectionBtn.classList.add('active');
  } 
  pokeball.addEventListener('click', function(e) {
	console.log('ball')
	setTimeout(function() { 
		e.preventDefault();
		console.log(pokeballTop.classList.contains('open'))
		if (pokeballTop.classList.contains('open') && hasPokemons()) {
			console.log('close');
			viewCollectionBtn.classList.remove('active');
		}
	},1000);
  });
  cardContainer.addEventListener('click', function(e) {
	console.log('card')
	setTimeout(function() { 
		e.preventDefault();
		if (pokeballTop.classList.contains('close')) {
			viewCollectionBtn.classList.add('active');
		}
	},1000);
  });
}

function buildCollection() {
	if(hasPokemons()) {
		let storedCollection = window.localStorage.getItem('pokemons').split('|');
		storedCollection.forEach(item => {
			let div = document.createElement('div');
			let pokeImg = document.createElement('img');
			pokeImg.classList.add('pokemon-image')
			pokeImg.setAttribute('src', JSON.parse(item).imageURL);
		
			div.appendChild(pokeImg);
			myCollection.appendChild(div);
		});
	}
}

showOrHideCollectionBtn();
buildCollection();

function HSLToHex(h, s, l) {
	s /= 100;
	l /= 100;

	let c = (1 - Math.abs(2 * l - 1)) * s,
		x = c * (1 - Math.abs((h / 60) % 2 - 1)),
		m = l - c / 2,
		r = 0,
		g = 0,
		b = 0;

	if (0 <= h && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (60 <= h && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (120 <= h && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (180 <= h && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (240 <= h && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (300 <= h && h < 360) {
		r = c;
		g = 0;
		b = x;
	}
	// Having obtained RGB, convert channels to hex
	r = Math.round((r + m) * 255).toString(16);
	g = Math.round((g + m) * 255).toString(16);
	b = Math.round((b + m) * 255).toString(16);

	// Prepend 0s, if necessary
	if (r.length == 1) r = '0' + r;
	if (g.length == 1) g = '0' + g;
	if (b.length == 1) b = '0' + b;

	return '#' + r + g + b;
}

async function buildCard() {
	let cardContainer = document.querySelector('.card-container');
	let nameInput = document.querySelector('.pokemon-select-input');

	currPokemon.name = nameInput.value.toLowerCase();

	// name = name.toLowerCase();
	const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${currPokemon.name}`;
	const pokemonResponse = await fetch(pokemonURL);

	let status = pokemonResponse.statusText;

	if(status == "Not Found") {
		return false;
	}

	const pokemonData = await pokemonResponse.json();

	currPokemon.type = pokemonData.types[0].type.name;
	currPokemon.stats = pokemonData.stats;
	currPokemon.pokemonImageLink =
		pokemonData.sprites.other['official-artwork'].front_default;

		console.log(currPokemon.pokemonImageLink)

	nameInput.value = '';

	const pokemonID = Date.now() + Math.random().toFixed(0);

	const pokemonCard = `<div id="${pokemonID}" class="card">
	<div class="card-outer">
		<div class="card-outer-close">X</div>
		<div class="card-inner card-inner${pokemonID}">
			<div class="card-inner__silver-icon"><span>PokeGen</span></div>
			<div class="card-inner__name-hp">
				<h2 class="card-inner__name card-inner__name${pokemonID}"></h2>
				<h2 class="card-inner__hp card-inner__hp${pokemonID}">0</h2>
				<div class="card-inner__hp-img card-inner__hp-img${pokemonID}">
					<span class="card-inner__hp-img_iconWhite"></span>
					<span class="card-inner__hp-img_iconBack card-inner__hp-img_iconBack${pokemonID}"></span>
					<span class="card-inner__hp-img_icon card-inner__hp-img_icon${pokemonID}"></span>
				</div>
			</div>
			<div class="card-inner__img">
				<div class="card-inner__img-pokemon card-inner__img-pokemon${pokemonID}"></div>
				<div class="card-inner__img-silver-icon"><span>Gotta Catch 'Em All</span></div>
			</div>
			<div class="card-inner__bottom-silver-icon"></div>
		</div>
	</div>`;

	cardContainer.innerHTML = pokemonCard;

	setName(currPokemon.name);
	setStats(currPokemon.stats);
	setTypeIcon(currPokemon.type);
	setImage(currPokemon.pokemonImageLink);
	setColors(currPokemon.type);

	addToCollection();
}

function setName(name) {
	let nameField = document.querySelector('.card-inner__name');

	nameField.textContent = name[0].toUpperCase() + name.substr(1);
}

function setStats(stats) {
	let hp = document.querySelector('.card-inner__hp');

	for (let stat of stats) {
		if (stat.stat['name'] == 'hp') hp.textContent = stat.base_stat;
	}
}

function setTypeIcon(type) {
	let typeIcon = document.querySelector('.card-inner__hp-img_icon');

	typeIcon.style.backgroundImage = `url('images/${type}_type.png')`;
}

function setImage(link) {
	let pokeImage = document.querySelector('.card-inner__img-pokemon');

	pokeImage.style.background = `url(${link}) no-repeat center`;
	pokeImage.style.backgroundSize = 'contain';
}

function setColors(type) {
	let colorMain = null;
	let inner = document.querySelector('.card-inner');
	let iconBack = document.querySelector('.card-inner__hp-img_iconBack');

	switch (type) {
		case 'bug':
			colorMain = [ 80, 100, 38 ];
			break;
		case 'dark':
			colorMain = [ 263, 10, 36 ];
			break;
		case 'dragon':
			colorMain = [ 207, 100, 39 ];
			break;
		case 'electric':
			colorMain = [ 60, 100, 50 ];
			break;
		case 'fairy':
			colorMain = [ 308, 93, 76 ];
			break;
		case 'fighting':
			colorMain = [ 340, 74, 53 ];
			break;
		case 'fire':
			colorMain = [ 27, 100, 63 ];
			break;
		case 'flying':
			colorMain = [ 218, 62, 71 ];
			break;
		case 'ghost':
			colorMain = [ 222, 40, 50 ];
			break;
		case 'grass':
			colorMain = [ 128, 55, 48 ];
			break;
		case 'ground':
			colorMain = [ 5, 45, 35 ];
			break;
		case 'ice':
			colorMain = [ 165, 80, 10 ];
			break;
		case 'normal':
			colorMain = [ 27, 89, 34 ];
			break;
		case 'poison':
			colorMain = [ 285, 51, 61 ];
			break;
		case 'psychic':
			colorMain = [ 285, 34, 45 ];
			break;
		case 'rock':
			colorMain = [ 44, 38, 65 ];
			break;
		case 'steel':
			colorMain = [ 197, 29, 49 ];
			break;
		case 'water':
			colorMain = [ 207, 70, 54 ];
			break;
		default:
			break;
	}

	let colorFull = HSLToHex(colorMain[0], colorMain[1], colorMain[2]);
	let colorMid = HSLToHex(colorMain[0], colorMain[1], colorMain[2] + 15);
	let colorLow = HSLToHex(colorMain[0], colorMain[1], colorMain[2] + 20);
	let innerBorderColor = HSLToHex(colorMain[0], colorMain[1], colorMain[2] - 8);

	inner.style.background = `linear-gradient(to top left, ${colorLow}, ${colorMid}, ${colorFull}`;
	inner.style.border = `1px solid ${innerBorderColor}`;
	iconBack.style.background = `linear-gradient(to bottom right, ${colorFull}, ${colorMid}, ${colorLow}`;
}

function getPokemonNames() {
	let arrOfNames = []
	let pokenames = fetch('https://pogoapi.net/api/v1/pokemon_names.json')
		.then(response => response.json())
		.then(val => {
			let len = Object.keys(val).length;
			for(i = 1; i < len+1; i++) {
					arrOfNames.push(val[i]["name"])
			}
	});
	return arrOfNames;
}

function autoComplete(input) {
	let pokemonSelectContainer = document.querySelector('.pokemon-select')
	let cardContainer = document.querySelector('.card-container')
	let pokemonNames = getPokemonNames();
	input.addEventListener('input', function() {
		let len = this.value.length;
		closeList();

		if(!this.value) return;

		suggestions = document.createElement('div');
		suggestions.setAttribute('class', 'suggestions');
		pokemonSelectContainer.appendChild(suggestions);

		pokemonNames.forEach(name => {
			if(name.toLowerCase().slice(0, len) == this.value.toLowerCase()) {
				suggestion = document.createElement('div');
				suggestion.setAttribute('class', 'suggestion');
				suggestion.innerHTML = name;
				suggestion.style.cursor = 'pointer';

				suggestions.appendChild(suggestion);

				suggestion.addEventListener('click', (e) => {
					input.value = e.target.textContent;
					closeList();
				});
			}
		});
		if(suggestions.childElementCount < 1) closeList();
	});
}

function closeList() {
	let suggestions = document.querySelector('.suggestions');
	if (suggestions) {
		suggestions.remove();
	}
}

function addToCollection() {
	let pokeObj = {}
	let pokeStatsArr = [];

	pokeObj.name = currPokemon.name;
	pokeObj.imageURL = currPokemon.pokemonImageLink;
	
	currPokemon.stats.forEach((stat, i) => { 
		let name = stat.stat.name;
		let baseStat = stat.base_stat;
		pokeStatsArr.push(`${name}: ${baseStat}`);
	});

	pokeObj.stats = pokeStatsArr;

	let currStorage = window.localStorage.getItem('pokemons');

	if(currStorage == null) {
		window.localStorage.setItem('pokemons', JSON.stringify(pokeObj));
	} else {
		let arrayOfPokemons = currStorage.split('|');
		let names = [];

		arrayOfPokemons.forEach((pokemon, i) => {
			pokemon = JSON.parse(pokemon);
			let match = false;

			names.push(pokemon.name);
			if (i == arrayOfPokemons.length -1) {
				names.forEach(name => {
					if(name == currPokemon.name) {
						match = true;
					}
				})
				if (!match) {
					window.localStorage.setItem('pokemons', currStorage + '|' + JSON.stringify(pokeObj));
				}
			}
		});
	}
	let div = document.createElement('div');
	let pokeImg = document.createElement('img');
	pokeImg.setAttribute('src', pokeObj.imageURL);
	pokeImg.classList.add('pokemon-image')

	div.appendChild(pokeImg);
	myCollection.appendChild(div);
}



function showCollection() {

}

autoComplete(pokemonInput);

async function populateCard() {
	let pokemonInput = document.querySelector('.pokemon-select-input')
	let pokemonInputValue = pokemonInput.value;
	let suggestions = document.querySelector('.suggestions');

	if(pokemonInputValue == '') {
		return;
	}

	let status = await buildCard();

	if(status == false) return;

	pokemonInput.classList.toggle('hide');
	if(suggestions !== null) suggestions.classList.toggle('hide')

	pokeballTop.classList.add('open');
	pokeballTop.classList.remove('close');

	let cardContainer = document.querySelector('.card-container');
	let cardClose = document.querySelector('.card-outer-close');

	cardContainer.classList.remove('invisible');
	cardContainer.classList.add('visible');
	cardClose.classList.add('appear');

	cardClose.addEventListener('click', async function(e) {
		cardContainer.classList.add('invisible');
		cardContainer.classList.remove('visible');
		cardClose.classList.remove('appear');

		pokeballTop.classList.add('close');
		pokeballTop.classList.remove('open');

		setTimeout(() => { 
			pokemonInput.classList.toggle('hide') 
		},2300);
	});
}


pokeball.addEventListener('click', populateCard);

viewCollectionBtn.addEventListener('click', function() {
	let card = document.querySelector('.card');
	document.querySelector('.pokeball__top').classList.toggle('showdeck-top')
	document.querySelector('.pokeball__bottom').classList.toggle('showdeck-bottom')
	document.querySelector('.mydeck-container').classList.toggle('showdeck');

	if(card !== null) card.remove();

	document.querySelector('.pokemon-select').classList.toggle('hide');

	myCollectionContainer.style.zIndex = '9999';
})
