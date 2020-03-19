class FadingText {
	constructor(x, y, string, fontsize, container) {
		this.draw = new PIXI.Text(string,{fontFamily : 'Arial', fontSize: fontsize, fill : 0xffffff, align : 'left'});
		container.addChild(this.draw)
		this.draw.alpha = 0;
		this.draw.position.x = x
		this.draw.position.y = y
		requestAnimationFrame(function(d){this.animateIn(d)}.bind(this))
	}
	animateIn(d) {
		if(this.draw.alpha < 1) {
			this.draw.alpha += 0.1 * d/1000;
		} else {
			return this.draw.alpha = 1;
		}
		requestAnimationFrame(function(d){this.animateIn(d)}.bind(this))
	}
}
class Card {
	constructor(app, canvas) {
		if(this.visual) this.visual()
		this.app = app;
		this.canvas = canvas
	}
	changeName(name) {
		try {
			this.name.draw.text = name;
		} catch(e){
			return e
		}
	}
	addToScene(strings) {
		let ready = true
		if(this.container) {
			if(this.container.width < 2) {
				ready = false
			}
		} else {
			ready = false
		}
		if(!ready) return setTimeout(function(){this.addToScene(strings)}.bind(this), 100)
		this.app.stage.addChild(this.container)
		this.name = new FadingText(20*this.container.scale.x,this.background.height-(40*this.container.scale.y),strings.name || "Your name here", 17, this.container)
		this.validValue = new FadingText(20*this.container.scale.x,this.background.height-(60*this.container.scale.y),strings.valid || "12/23", 17, this.container)
		this.validLabel = new FadingText(22*this.container.scale.x,this.background.height-(68*this.container.scale.y),"VALID THRU", 6.5, this.container)
		this.validLabel = new FadingText(22*this.container.scale.x,this.background.height-(93*this.container.scale.y),strings.cardnumber || "2221 0012 3412 3456", 20, this.container)
		this.title = new FadingText(22*this.container.scale.x,20*this.container.scale.y,"Card Issuer", 20, this.container)

		this.containThenTrim()

		this.container.alpha = 0;
		requestAnimationFrame(function(d){this.animateIn(d)}.bind(this))
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
		this.container.pivot.x = this.canvas.width/2
		this.container.position.x = this.canvas.width/2
		this.container.pivot.y = this.canvas.height/2
		this.container.position.y = this.canvas.height/2
	}
	animateIn(d) {
		if(this.container.alpha < 1) {
			this.container.alpha += 0.1 * d/1000;
		} else {
			return this.container.alpha = 1;
		}
		requestAnimationFrame(function(d){this.animateIn(d)}.bind(this))
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
	    resolution: 1,

	    //Use #color if set in data attribute, otherwise use transparent = true
	    [(providedConfig.background ? 'backgroundColor' : 'transparent')]: (providedConfig.background ? providedConfig.background.replace('#','0x') : true)
	});

	DOMElement.appendChild(app.view);

	let demoMastercard = new Mastercard(app, DOMElement.querySelector('canvas'))
	demoMastercard.addToScene({
		name: "Your name here"
	})
	document.querySelector("#nameinput").addEventListener("keyup", event => {
	  	demoMastercard.changeName(event.target.value.toUpperCase())
	});
	VanillaTilt.init(DOMElement.querySelector('canvas'), {reverse:true, scale: 1.2, speed: 1000, max:10,"full-page-listening":true})
	document.querySelector("#nameinput").addEventListener("keydown", event => {
		demoMastercard.changeName(event.target.value.toUpperCase())
	});

})();