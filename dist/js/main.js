class Card {
	constructor(app, canvas) {
		if(this.visual) this.visual()
		this.app = app;
		this.canvas = canvas
	}
	addToScene(DOMElement) {
		let ready = true
		if(this.container) {
			if(this.container.width < 2) {
				ready = false
			}
		} else {
			ready = false
		}
		if(!ready) return setTimeout(function(){this.addToScene()}.bind(this), 100)
		this.container.alpha = 0;
		this.app.stage.addChild(this.container)
		console.log(this.canvas)
		this.containThenTrim()
		this.fadeIn()
	}
	containThenTrim() {
		//Get height and width ratio between container and app canvas
		let wRatio = parseFloat(this.app.screen.width) / this.container.width
		let hRatio = parseFloat(this.app.screen.height) / this.container.height

		//Use the smallest ratio as the global ratio
		let scaleFactor = (wRatio > hRatio ? hRatio : wRatio)

		//Set the container scale based on scaleFactor
		this.container.scale.set(scaleFactor, scaleFactor)

		//Resize the canvas to fit container
		this.canvas.setAttribute('width',(this.container.width)+'px')
		this.canvas.setAttribute('height',(this.container.height)+'px')
	}
	fadeIn() {
		if(this.container.alpha < 1) {
			this.container.alpha += 0.1;
		} else {
			return this.container.alpha = 1;
		}
		requestAnimationFrame(function(){this.fadeIn()}.bind(this))
	}
}
class Mastercard extends Card {
	visual() {
		this.container = new PIXI.Container()
		this.background = new PIXI.Sprite.from('assets/generic/mastercard.png')
		this.container.addChild(this.background)
	}
}

(function() {
	//Get DOMElement with ID = ccw
	var DOMElement = document.querySelector("#ccw")

	//Stop execution if the element is not found, or PIXIJS not loaded
	if(!DOMElement || !window.PIXI) return console.log("Failed to initiate CCW");

	//Parse element for data attribute
	let HTMLConfig = [].filter.call(DOMElement.attributes, function(at) { return /^data-/.test(at.name); });

	//Assign HTML data-attributes to internal config omitting the data- part of the property
	let providedConfig = {}
	for(let prop in HTMLConfig) { 
		providedConfig[HTMLConfig[prop].name.replace('data-','')] = HTMLConfig[prop].value 
	}

	let bgProp = ""
	let bgVal = ""

	if(providedConfig.background) {
	}

	//Spin up the renderer	
	const app = new PIXI.Application({
	    width: providedConfig.width || 800, 
	    height: providedConfig.height || 600,
	    
	    //Don't change this unless you want a pixelated image
	    resolution: window.devicePixelRatio || 1,

	    //Use #color if set in data attribute, otherwise use transparent = true
	    [(providedConfig.background ? 'backgroundColor' : 'transparent')]: (providedConfig.background ? providedConfig.background.replace('#','0x') : true)
	});

	DOMElement.appendChild(app.view);

	let demoMastercard = new Mastercard(app, DOMElement.querySelector('canvas'))
	demoMastercard.addToScene()

})();