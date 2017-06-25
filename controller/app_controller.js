var app;
var scope;

angular.module("appModule", []);

angular
  .module("appModule")
  .controller("appController", function($timeout, $scope) {
    app = this;

    app.Today = moment();
    app.TodayAtNine = moment(app.Today.format("MM/DD/YYYY")).add(9, "hour").toDate();
    app.TodayAtNoon = moment(app.Today.format("MM/DD/YYYY")).add(12, "hour").toDate();
    app.TodayAtEvening = moment(app.Today.format("MM/DD/YYYY")).add(18, "hour").toDate();
    app.TodayAtNight = moment(app.Today.format("MM/DD/YYYY")).add(21, "hour").toDate();

    app.HealingAndWellnessScrolledOutOfView = false;
    app.IsNarrow = false;
    app.MenuOn = false;
    app.IsModernTheme = false;

    document.getElementById("mainCss").href = app.IsModernTheme ? "css/main-modern.css" : "css/main.css";
    app.ToggleIsModernTheme = function() {
      app.IsModernTheme = !app.IsModernTheme;
      document.getElementById("mainCss").href = app.IsModernTheme ? "css/main-modern.css" : "css/main.css";
    };
    app.CurrentMainHeight = "0px";
    app.ContactGoogleMapCurrentHeight = "0px";
    /* ============= Theme management ============= */
    app.CurrentTheme;
    app.Themes = {
      coffee: new ThemeObject({ name: "coffee" }),
      blue: new ThemeObject({ name: "blue" }),
      blueLight: new ThemeObject({ name: "blue light", isDisabled: false }),
      orange: new ThemeObject({ name: "orange", isDisabled: true })
    };
    app.SelectTheme = function(selected_theme) {
      for (var theme in app.Themes) {
        app.Themes[theme].isSelected = false;
      }
      app.CurrentTheme = selected_theme;
      selected_theme.isSelected = true;
    };

    app.SelectTheme(app.Themes.blue);

    /* ============= Font management ============= */
    app.CurrentFont;
    app.Fonts = {
      sans: new ThemeObject({ name: "sans-serif", isSelected: false }),
      serif: new ThemeObject({ name: "serif", isSelected: true })
    };
    app.SelectFont = function(selected_font) {
      for (var font in app.Fonts) {
        app.Fonts[font].isSelected = false;
      }
      app.CurrentFont = selected_font;
      app.CurrentFont.isSelected = true;
      GetNavElementsWidth();
    };
    app.SelectFont(app.Fonts.sans);

    app.CurrentFontSize;
    app.FontSizes = {
      normal: new ThemeObject({ name: "normal", isSelected: true }),
      big: new ThemeObject({ name: "big", isSelected: false }),
      bigger: new ThemeObject({ name: "bigger", isSelected: false })
    };
    app.SelectFontSize = function(selected_font) {
      for (var font in app.FontSizes) {
        app.FontSizes[font].isSelected = false;
      }
      app.CurrentFontSize = selected_font;
      app.CurrentFontSize.isSelected = true;
      GetNavElementsWidth();
    };
    app.SelectFontSize(app.FontSizes.normal);

    /* ============= Navigation management ============= */
    app.CurrentLink;
    app.NavigationLinks = {
      home: new NavigationLinkObject({ id: "home", name: "Welcome", position: 0 }),
      appointments: new NavigationLinkObject({ id: "appointments", name: "Appointments", position: 1, isDisabled: true }),
      services: new NavigationLinkObject({ id: "services", name: "Services", position: 2 }),
      about: new NavigationLinkObject({ id: "about", name: "About", position: 3 }),
      contact: new NavigationLinkObject({ id: "contact", name: "Contact", position: 4 }),
      intake: new NavigationLinkObject({ id: "intake", name: "Forms", position: 5 }),
      resources: new NavigationLinkObject({ id: "resources", name: "Resources", position: 6 })
    };

    app.SelectLink = function(selected_link) {
      for (var link in app.NavigationLinks) {
        app.NavigationLinks[link].isSelected = false;
      }
      app.CurrentLink = selected_link;
      app.CurrentLink.isSelected = true;
    };

    app.UpdateCheckURL = function() {
      if (getHashValue("/page") != null) {
        app.SelectLink(app.NavigationLinks[getHashValue("/page")]);
      } else {
        app.SelectLink(app.NavigationLinks.home);
      }
    };

    app.PushHistory = function(linkId) {
      history.pushState(null, "", "#/page=" + linkId);
      app.UpdateCheckURL();
    };

    app.UpdateCheckURL();
  })
  .filter("orderObjectBy", function() {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.sort(function(a, b) {
        return a[field] > b[field] ? 1 : -1;
      });
      if (reverse) filtered.reverse();
      return filtered;
    };
  });

var NavigationLinkObject = function(spec) {
  this.id = spec.id;
  this.name = spec.name == undefined ? "" : spec.name;
  this.position = spec.position;
  this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
  this.isDisabled = spec.isDisabled == undefined ? false : spec.isDisabled;
};

var ThemeObject = function(spec) {
  this.name = spec.name == undefined ? "" : spec.name;
  this.position = spec.position;
  this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
  this.isDisabled = spec.isDisabled == undefined ? false : spec.isDisabled;
};

var FontObject = function(spec) {
  this.name = spec.name == undefined ? "" : spec.name;
  this.position = spec.position;
  this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
  this.isDisabled = spec.isDisabled == undefined ? false : spec.isDisabled;
};

var updateTime;
var header = document.getElementsByTagName("header")[0];
var nav = document.getElementsByTagName("nav")[0];
var main = document.getElementsByTagName("main")[0];
var mainBorderTop = parseInt($(main).css("border-top-width").replace("px", ""));
var footer = document.getElementsByTagName("footer")[0];
// var lastClear = document.getElementById("lastClear");
var navList = document.getElementById("navlist");
var list = nav.getElementsByTagName("li");
var listWidth = null;
var listHeight = null;
var delta = null;
var isNarrow = false;

function UpdateLayout() {
  isNarrow = document.body.offsetWidth - 120 - 2 < listWidth;
  //document.body.className = isNarrow ? "narrow" : "";

  var scope = angular.element($(document.body)).scope();
  scope.app.IsNarrow = isNarrow;
  var newHeight = document.body.offsetHeight - header.offsetTop - parseInt($(main).css("border-top-width").replace("px", "")) - header.offsetHeight - nav.offsetHeight - footer.offsetHeight - (isNarrow ? 0 : 40);
  if (scope.app.CurrentMainHeight != newHeight) {
    log(scope.app.CurrentMainHeight + "!=" + newHeight);
    if (isNarrow) {
      scope.app.CurrentMainHeight = "auto";
    } else {
      scope.app.CurrentMainHeight = newHeight + "px";
      scope.app.ContactGoogleMapCurrentHeight = parseInt(newHeight) - 80 + "px";
    }
    scope.app.UpdateCheckURL();
  }

  if (isNarrow) {
    var scrollTop = document.getElementsByTagName("wrap")[0].scrollTop;
    scope.app.HealingAndWellnessScrolledOutOfView = scrollTop > 70;
  }
  scope.$apply();
}

function GetNavElementsWidth() {
  mainBorderTop = parseInt($(main).css("border-top-width").replace("px", ""));
  var width = 0;
  for (var i = list.length - 1; i >= 0; i--) {
    width += list[i].offsetWidth + 2;
  }
  listWidth = width;
  delta = document.body.offsetWidth - navList.offsetWidth;
  updateTime = window.setInterval(UpdateLayout, 16);
  if (document.getElementsByTagName("html")[0].className.indexOf("loaded") == -1) {
    document.getElementsByTagName("html")[0].className = document.getElementsByTagName("html")[0].className + " loaded";
  }
}

$(window).on("hashchange", function() {
  var scope = angular.element($(document.body)).scope();
  scope.app.UpdateCheckURL();
  scope.$apply();
});

window.onpopstate = function(event) {
  if (event && event.state) {
    window.location = window.location;
  }
};

document.body.onload = window.setTimeout(function() {
  GetNavElementsWidth();
}, 200);
