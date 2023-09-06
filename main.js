const canvas = document.getElementById('micanvas');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var velocidad = 5;
let score = 0;
let pausa = false;
let c = 0;

let alienImg = new Image();
let vaca = new Image();
let sonido = new Audio();

alienImg.src = 'alien.png';
vaca.src = 'vaca.png';
sonido.src = 'sonido.mp3';

class Figura {
	constructor({
		posicion = { x: 200, y: 200 },
		width = 50,
		height = 50,
		img = null,
		color = 'transparent',
		velocidad = { x: 0, y: 0 },
	}) {
		this.posicion = posicion;
		this.width = width;
		this.height = height;
		this.img = img;
		this.color = color;
		this.velocidad = velocidad;
	}
	draw() {
		if (this.img != null) {
			ctx.drawImage(
				this.img,
				this.posicion.x,
				this.posicion.y,
				this.width,
				this.height
			);
		} else {
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'black';
			ctx.strokeRect(this.posicion.x, this.posicion.y, this.width, this.height);

			ctx.fillStyle = this.color;
			ctx.fillRect(this.posicion.x, this.posicion.y, this.width, this.height);
		}
	}

	animacion() {
		ctx.fillStyle = '#229954';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		if (this.img == null) {
			this.colorRandom();
		}
		this.posicion.x += this.velocidad.x;
		this.posicion.y += this.velocidad.y;
		this.draw();
	}
	colision(obj) {
		return (
			this.posicion.x + this.width >= obj.posicion.x &&
			obj.posicion.x + obj.width >= this.posicion.x &&
			this.posicion.y + this.height >= obj.posicion.y &&
			obj.posicion.y + obj.height >= this.posicion.y
		);
	}
	limites() {
		if (this.posicion.x < -this.width) {
			this.posicion.x = canvas.width;
		}
		if (this.posicion.x > canvas.width) {
			this.posicion.x = 0;
		}

		if (this.posicion.y < -this.height) {
			this.posicion.y = canvas.height;
		}
		if (this.posicion.y > canvas.height) {
			this.posicion.y = 0;
		}
	}
	colorRandom() {
		let rojo = Math.floor(Math.random() * 256);
		let verde = Math.floor(Math.random() * 256);
		let azul = Math.floor(Math.random() * 256);
		let color = `rgb(${rojo},${verde},${azul})`;

		this.color = color;
	}
	posicionRandom() {
		this.posicion.x = Math.random() * (canvas.width - 50 - 0) + 1;
		this.posicion.y = Math.random() * (canvas.height - 50 - 0) + 1;
	}
}
const center = {
	x: canvas.width / 2,
	y: canvas.height / 2,
};

const alien = new Figura({
	posicion: {
		x: center.x - 150,
		y: center.y - 40,
	},
	height: 50,
	width: 50,
	img: alienImg,
	velocidad: {
		x: 5,
		y: 0,
	},
});

const moneda = new Figura({
	posicion: {
		x: center.x + 150,
		y: center.y - 30,
	},
	height: 50,
	width: 50,
	img: vaca,
});

const muros = [];

muros.push(
	new Figura({
		posicion: {
			x: center.x - 250,
			y: 100,
		},
		height: 30,
		width: 500,
		color: '#873600',
	})
);
muros.push(
	new Figura({
		posicion: {
			x: center.x - 250,
			y: canvas.height - 100,
		},
		height: 30,
		width: 500,
		color: '#873600',
	})
);
muros.push(
	new Figura({
		posicion: {
			x: 250,
			y: center.y - 150,
		},
		height: 300,
		width: 30,
		color: '#873600',
	})
);
muros.push(
	new Figura({
		posicion: {
			x: canvas.width - 250,
			y: center.y - 150,
		},
		height: 300,
		width: 30,
		color: '#873600',
	})
);

function control() {
	window.addEventListener('keydown', (e) => {
		switch (e.keyCode) {
			case 87: //arriba
				alien.velocidad.x = 0;
				alien.velocidad.y = -velocidad;
				break;
			case 83: // abajo
				alien.velocidad.x = 0;
				alien.velocidad.y = velocidad;
				break;
			case 68: //derecha
				alien.velocidad.y = 0;
				alien.velocidad.x = velocidad;
				break;
			case 65: //izquierda
				alien.velocidad.y = 0;
				alien.velocidad.x = -velocidad;
				break;
			case 32:
				c++;
				if (c % 2 <= 0) {
					pausa = false;
					c = 0;
				} else {
					pausa = true;
					ctx.fillStyle = 'rgba(0,0,0,0.5)';
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.beginPath();
					ctx.fillStyle = '#fff';
					ctx.font = '80px Arial';
					ctx.fillText('Pausa', center.x - 80, center.y - 40);
					ctx.closePath();
				}

				console.log(pausa);
				break;
		}
	});
}

function actualizar() {
	window.requestAnimationFrame(actualizar);
	if (pausa != true) {
		alien.animacion();
		alien.limites();
		if (alien.colision(moneda)) {
			score += 10;
			velocidad++;
			moneda.posicionRandom();
			sonido.play();
		}
		muros.forEach((muro) => {
			muro.draw();
			if (alien.colision(muro)) {
				alien.velocidad.x = 0;
				alien.velocidad.y = 0;
			}
		});
		moneda.draw();
		ctx.beginPath();
		ctx.fillStyle = '#000';
		ctx.font = '40px Arial';
		ctx.fillText('Score: ' + score, 40, 40);
	}
}
control();

actualizar();
