/// <reference path="../shared/javascript/libs/jquery/jquery-3.2.1.js" />
/// <reference path="../shared/javascript/helpers/moment.js" />

var app;
var scope;


angular.module("appModule", []);

// controller definition
angular.module("appModule").controller('appController', function ($timeout, $scope) {
	app                = this;
	app.Today          = moment();
	app.TodayAtNine    = moment(app.Today.format('MM/DD/YYYY')).add(9, "hour").toDate();
	app.TodayAtNoon    = moment(app.Today.format('MM/DD/YYYY')).add(12, "hour").toDate();
	app.TodayAtEvening = moment(app.Today.format('MM/DD/YYYY')).add(18, "hour").toDate();
	app.TodayAtNight   = moment(app.Today.format('MM/DD/YYYY')).add(21, "hour").toDate();

	app.CurrentTheme;
	app.Themes = {
		blue: 		new ThemeObject({name: "blue", 			isSelected: true}),
		blueLight: 	new ThemeObject({name: "blue light", 	isSelected: false}),
		orange: 	new ThemeObject({name: "orange", 		isSelected: false,	isDisabled: false }),
		coffee: 	new ThemeObject({name: "coffee", 		isSelected: false}),
	}
	app.SelectTheme = function(selected_theme){
		for (var theme in app.Themes) {
			app.Themes[theme].isSelected = false;
		}
		app.CurrentTheme = selected_theme;
		selected_theme.isSelected = true;
	}
	app.SelectTheme(app.Themes.blue);

	app.CurrentFont;
	app.Fonts = {
		sans: 	new ThemeObject({name: "sans-serif", 	isSelected: false}),
		serif: 	new ThemeObject({name: "serif", 		isSelected: true}),
	}
	app.SelectFont = function(selected_font){
		for (var font in app.Fonts) {
			app.Fonts[font].isSelected = false;
		}
		app.CurrentFont = selected_font;
		app.CurrentFont.isSelected = true;
		GetNavElementsWidth();
	}
	app.SelectFont(app.Fonts.sans);

	app.CurrentFontSize;
	app.FontSizes = {
		normal: 	new ThemeObject({name: "normal", 	isSelected: true}),
		big: 		new ThemeObject({name: "big", 		isSelected: false}),
		bigger: 	new ThemeObject({name: "bigger",	isSelected: false}),
	}
	app.SelectFontSize = function(selected_font){
		for (var font in app.FontSizes) {
			app.FontSizes[font].isSelected = false;
		}
		app.CurrentFontSize = selected_font;
		app.CurrentFontSize.isSelected = true;
		GetNavElementsWidth();
	}
	app.SelectFontSize(app.FontSizes.normal);

	app.CurrentLink;
	app.NavigationLinks = {
		home: 			new NavigationLinkObject({	name: "Welcome", 		position: 0, isSelected: true, }),
		appointments: 	new NavigationLinkObject({ 	name: "Appointments", 	position: 1, isSelected: false,	isDisabled: true }),
		contact: 		new NavigationLinkObject({	name: "Contact", 		position: 2, isSelected: false, }),
		about: 			new NavigationLinkObject({	name: "About", 			position: 3, isSelected: false, }),
		intake: 		new NavigationLinkObject({	name: "Intake Forms", 	position: 4, isSelected: false, }),
		resources: 		new NavigationLinkObject({	name: "Resources", 		position: 5, isSelected: false, }),
	};
	app.SelectLink = function(selected_link){
		for (var link in app.NavigationLinks) {
			app.NavigationLinks[link].isSelected = false;
		}
		app.CurrentLink = selected_link;
		app.CurrentLink.isSelected = true;
	}
	app.SelectLink(app.NavigationLinks.home)
	
		app.TouchCircleTransform = "translate(0px, 0px)";
	app.ShowTouchTarget      = false;
	app.ScreenHasTouch       = false;	
	app.PointerDown = function ($event) {

		var $body = $('body'); 

		/* bind events */
		$(document)
		.on('focus', 'input, select', function() {
			$body.addClass('fixfixed');
		})
		.on('blur', 'input, select', function() {
			$body.removeClass('fixfixed');
		});
		
		
		var scope = angular.element($(document.body)).scope();
		var touchobj = $event.changedTouches[0]; // reference first touch point for this event
		scope.app.TouchCircleTransform = "translate(" + touchobj.clientX + "px, " + touchobj.clientY + "px)";
		scope.app.ScreenHasTouch = true;
		scope.$apply();
	}
	app.PointerMove = function ($event) {
		var scope = angular.element($(document.body)).scope();
		if (scope.app.ShowTouchTarget) {
			var touchobj = $event.changedTouches[0]; // reference first touch point for this event
			scope.app.TouchCircleTransform = "translate(" + touchobj.clientX + "px, " + touchobj.clientY + "px)";
			scope.$apply();
		}
	}
	app.PointerUp = function ($event) {
		var scope = angular.element($(document.body)).scope();
		scope.app.ScreenHasTouch = $event.touches.length > 0;
		scope.$apply();
	}
	
	window.addEventListener("touchstart", app.PointerDown, false);
	window.addEventListener("touchmove", app.PointerMove, false);
	window.addEventListener("touchend", app.PointerUp, false);
	
}).filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

var NavigationLinkObject = function (spec) {
	this.name               = spec.name == undefined ? "" : spec.name;
	this.position           = spec.position;
	this.isSelected         = spec.isSelected == undefined ? false : spec.isSelected;
	this.isDisabled         = spec.isDisabled == undefined ? false : spec.isDisabled;
}

var ThemeObject  = function (spec){
	this.name       		= spec.name == undefined ? "" : spec.name;
	this.position   		= spec.position;
	this.isSelected 		= spec.isSelected == undefined ? false : spec.isSelected;
	this.isDisabled 		= spec.isDisabled == undefined ? false : spec.isDisabled;
}

var FontObject   = function (spec){
	this.name       		= spec.name == undefined ? "" : spec.name;
	this.position   		= spec.position;
	this.isSelected 		= spec.isSelected == undefined ? false : spec.isSelected;
	this.isDisabled 		= spec.isDisabled == undefined ? false : spec.isDisabled;
}


var updateTime;
var nav = document.getElementById("navlist");
var list = nav.getElementsByTagName("li");
var listWidth = null;
var delta = null;

function UpdateLayout(){
	document.body.className = document.body.offsetWidth-120-40<listWidth  ? "menu" : "";
}

function GetNavElementsWidth(){
	var width=0;
	for (var i = list.length - 1; i >= 0; i--) {
		width += list[i].offsetWidth+2;
		console.log(list[i].offsetWidth);
	}
	listWidth = width;
	delta = document.body.offsetWidth-nav.offsetWidth;
	document.getElementsByTagName("html")[0].className = document.getElementsByTagName("html")[0].className+" loaded";
	updateTime=window.setInterval(UpdateLayout, 100);
}

document.body.onload=window.setTimeout(GetNavElementsWidth, 100);
