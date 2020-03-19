class Card {
	constructor() {
		if(this.visual) this.visual()
	}
	addToScene(app) {
		app.stage.addChild(this.container)
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

	let demoMastercard = new Mastercard()
	demoMastercard.addToScene(app)

})();