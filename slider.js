// requires jQuery

// constructor
var Slider = function(element, options) {
	this.element = element;
	this.options = options || jQuery.parseJSON(element.getAttribute('data-slider'));
	if(typeof this.options.fadeIn === 'undefined')
		this.options.fadeIn = 500;
	this.init();
}


Slider.prototype.init = function() {
	this.slides = [];
	this.currentSlide = null;
	var i,l=this.options.slides.length;
	var slide;
	this.element.innerHTML = '';
	for(i=0;i<l;i++) {
		this.addSlide(this.options.slides[i]);
	}

	this.showSlide(0, 0);
	if(this.options.timeout > 0) {
		this.registerTimeout(this.options.timeout);
	}
};


Slider.prototype.timeoutHandler = function() {
	this.timeoutHandle = null;
	this.next(null, this.registerTimeout.bind(this));
};


Slider.prototype.registerTimeout = function(time) {
	this.timeoutHandle = window.setTimeout(this.timeoutHandler.bind(this), time || this.options.timeout);
};


Slider.prototype.clearTimeout = function() {
	if(this.timeoutHandle !== null) {
		window.clearTimeout(this.timeoutHandle);
		this.timeoutHandle = null;
	}
};


Slider.prototype.getSlide = function(index) {
	if(index < 0 || index >= this.slides.length)
		throw new Error("Slide index out of range");
	return this.slides[index];
};


Slider.prototype.addSlide = function(data) {
	var slide = document.createElement('img');
	slide.setAttribute('src', data);
	slide.setAttribute('class', 'slide');
	this.element.appendChild(slide);
	this.slides.push(slide);
	return slide;
};


Slider.prototype.correctIndex = function(index) {
	var l = this.slides.length;
	while(index < 0) { index += l; }
	while(index >= l) { index -= l; }
	return index;
};


Slider.prototype.showSlide = function(index, duration, callback) {
	this.clearTimeout();

	if(typeof duration === 'undefined' || duration === null)
		duration = this.options.fadeIn;

	var that = this;
	var prevSlide = null;

	if(this.currentSlide !== null) {
		prevSlide = $(this.getSlide(this.currentSlide)).removeClass('curr').addClass('prev');
	}

	index = this.correctIndex(index);

	var next = $(this.getSlide(index));
	next.addClass('curr');

	var completed = function(){
		that.currentSlide = index;
		if(prevSlide !== null) prevSlide.removeClass('prev');
		if(callback) callback();
	};

	if(duration != 0) {
		next.hide();
		next.fadeIn(duration, completed);
	} else {
		next.show();
		completed();
	}
};


Slider.prototype.next = function(duration, callback) {
	this.showSlide(this.currentSlide === null ? 0 : this.currentSlide+1, duration, callback);
}


Slider.prototype.prev = function(duration, callback) {
	this.showSlide(this.currentSlide === null ? -1 : this.currentSlide-1, duration, callback);
}


var sliders = [];

$(function() {
	$('.slider').each(function(i,el){
		sliders.push(new Slider(el));
	});
});


