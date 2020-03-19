class Card {

}
class Mastercard extends Card {
	
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

	//Spin up the renderer	
	const app = new PIXI.Application({
	    width: providedConfig.width || 800, 
	    height: providedConfig.height || 600,

	    //Set background using #color -> hex
	    backgroundColor: (providedConfig.background || '#23db92').replace('#','0x'), 
	    
	    //Don't change this unless you want a pixelated image
	    resolution: window.devicePixelRatio || 1,
	});
	DOMElement.appendChild(app.view);
})();