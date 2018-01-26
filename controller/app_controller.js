var app;
var scope;

var updateTime;
var header = document.getElementsByTagName('header')[0];
var nav = document.getElementsByTagName('nav')[0];
var main = document.getElementsByTagName('main')[0];
var mainBorderTop = parseInt(
  $(main)
    .css('border-top-width')
    .replace('px', ''),
);
var footer = document.getElementsByTagName('footer')[0];
var navList = document.getElementById('navlist');
var list = nav.getElementsByTagName('li');
var listWidth = null;
var listHeight = null;
var delta = null;
var narrow = false;

angular.module('appModule', []);

angular
  .module('appModule')
  .controller('appController', function($timeout, $scope) {
    app = this;
    scope = angular.element($(document.body)).scope();

    app.Today = moment().toDate();
    app.HealingAndWellnessScrolledOutOfView = false;
    app.IsNarrow = false;
    app.MenuOn = false;
    app.IsModernTheme = false;
    app.SectionWidth = 1048;
    app.SectionOffset = 0;

    //    document.getElementById("mainCss").href = app.IsModernTheme ? "css/main-modern.css" : "css/main.css";
    app.ToggleIsModernTheme = function() {
      app.IsModernTheme = !app.IsModernTheme;
      document.getElementById('mainCss').href = app.IsModernTheme ? 'css/main-modern.css' : 'css/main.css';
    };

    app.CurrentMainHeight = '0px';
    app.ContactGoogleMapCurrentHeight = '0px';
    app.PreviousNarrowMapHeight = '0px';
    /* ============= Theme management ============= */
    app.CurrentTheme;
    app.Themes = {
      coffee: new ThemeObject({ name: 'coffee' }),
      blue: new ThemeObject({ name: 'blue' }),
      blueLight: new ThemeObject({ name: 'blue light', isDisabled: false }),
      orange: new ThemeObject({ name: 'orange', isDisabled: true }),
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
      sans: new ThemeObject({ name: 'sans-serif', isSelected: false }),
      serif: new ThemeObject({ name: 'serif', isSelected: true }),
    };

    app.CurrentFontSize;
    app.FontSizes = {
      normal: new ThemeObject({ name: 'normal', isSelected: true }),
      big: new ThemeObject({ name: 'big', isSelected: false }),
      bigger: new ThemeObject({ name: 'bigger', isSelected: false }),
    };
    app.SelectFontSize = function(selected_font) {
      for (var font in app.FontSizes) {
        app.FontSizes[font].isSelected = false;
      }
      app.CurrentFontSize = selected_font;
      app.CurrentFontSize.isSelected = true;
      GetNavElementsWidth();
    };

    /* ============= Resource management ============= */
    app.ExpandAllResources = false;
    app.ResourceGroups = BaseResourceGroups;

    app.ToggleAllResources = function() {
      app.ExpandAllResources = !app.ExpandAllResources;
      for (i = 0; i < app.ResourceGroups.length; i++) {
        var group = app.ResourceGroups[i];
        group.isRevealed = app.ExpandAllResources;
      }
    };

    /* ============= Navigation management ============= */
    app.CurrentLink;
    app.NavigationLinks = {
      home: new NavigationLinkObject({ id: 'home', name: 'Welcome', position: 0, page: 'pages/welcome.html' }),
      services: new NavigationLinkObject({ id: 'services', name: 'Services', position: 1, page: 'pages/services.html' }),
      about: new NavigationLinkObject({ id: 'about', name: 'About', position: 2, page: 'pages/about.html' }),
      connect: new NavigationLinkObject({ id: 'connect', name: 'Connect', position: 3, page: 'pages/connect.html', previousIds: ['contact'] }),
      newClient: new NavigationLinkObject({ id: 'newClient', name: 'New clients', position: 4, page: 'pages/newClient.html', previousId: ['intake'] }),
      resources: new NavigationLinkObject({ id: 'resources', name: 'Resources', position: 5, page: 'pages/resources.html' }),
    };

    app.SelectLink = function(selected_link) {
      for (var link in app.NavigationLinks) {
        var target = app.NavigationLinks[link];
        target.isSelected = false;
        if (selected_link == target) {
          app.SectionOffset = -app.SectionWidth * target.position;
        }
      }
      if (selected_link == app.NavigationLinks.connect) {
        log('select link called');
        //calculateCenter();
      }
      app.CurrentLink = selected_link;
      app.CurrentLink.isSelected = true;
    };

    app.CheckHashAgainstPageIds = function(hash) {
      for (link in app.NavigationLinks) {
        if (hash == app.NavigationLinks[link].id) {
          return hash;
        }
        for (previousId in app.NavigationLinks[link].previousIds)
          if (hash == app.NavigationLinks[link].previousIds[previousId]) {
            return app.NavigationLinks[link].id;
          }
      }
      return null;
    };

    app.UpdateCheckURL = function(checkHash) {
      checkHash = checkHash == undefined ? false : checkHash;
      if (getHashValue('/page') != null) {
        var pageId = app.CheckHashAgainstPageIds(getHashValue('/page'));
        if (checkHash == true) {
          if (pageId != null) {
            app.SelectLink(app.NavigationLinks[pageId]);
          } else {
            app.PushHistory(app.NavigationLinks.home.id);
          }
        } else {
          app.SelectLink(app.NavigationLinks[pageId]);
        }
      } else {
        app.PushHistory('home');
      }
    };

    app.PushHistory = function(linkId) {
      history.pushState(null, '', '#/page=' + linkId);
      app.UpdateCheckURL();
    };
  })
  .filter('orderObjectBy', function() {
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
  this.name = spec.name == undefined ? '' : spec.name;
  this.position = spec.position;
  this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
  this.isDisabled = spec.isDisabled == undefined ? false : spec.isDisabled;
  this.previousIds = spec.previousIds;
  this.page = spec.page;
};

var ThemeObject = function(spec) {
  this.name = spec.name == undefined ? '' : spec.name;
  this.position = spec.position;
  this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
  this.isDisabled = spec.isDisabled == undefined ? false : spec.isDisabled;
};

var FontObject = function(spec) {
  this.name = spec.name == undefined ? '' : spec.name;
  this.position = spec.position;
  this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
  this.isDisabled = spec.isDisabled == undefined ? false : spec.isDisabled;
};

function UpdateLayout() {
  narrow = document.body.offsetWidth - delta < listWidth || document.body.offsetHeight < 550;
  app.IsNarrow = narrow;
  var newHeight = document.body.offsetHeight - header.offsetTop - header.offsetHeight - nav.offsetHeight - footer.offsetHeight - (app.IsNarrow ? 0 : 20);
  // app.SectionWidth = document.body.offsetWidth > 1048 ? 1048 : document.body.offsetWidth - 150;

  if (app.CurrentMainHeight != newHeight + 'px') {
    // log(app.CurrentMainHeight + " != " + newHeight);
    if (app.IsNarrow) {
      if (app.CurrentMainHeight != 'auto') {
        app.CurrentMainHeight = 'auto';
      }
      if (app.PreviousNarrowMapHeight != newHeight + 'px') {
        app.ContactGoogleMapCurrentHeight = parseInt(newHeight) + 'px';
        app.PreviousNarrowMapHeight = app.ContactGoogleMapCurrentHeight;
        if (app.NavigationLinks.connect.isSelected) {
          //log("calculateCenter()");
          //calculateCenter();
        }
      }
    } else {
      app.CurrentMainHeight = newHeight + 'px';
      app.ContactGoogleMapCurrentHeight = parseInt(newHeight) - 80 + 'px';
    }
  }

  if (narrow) {
    var scrollTop = document.getElementsByTagName('wrap')[0].scrollTop;
    app.HealingAndWellnessScrolledOutOfView = scrollTop > 30;
  }
  scope.$apply();
}

function GetNavElementsWidth() {
  mainBorderTop = parseInt(
    $(main)
      .css('border-top-width')
      .replace('px', ''),
  );
  if (list.length > 0) {
    var width = 0;
    var modifier = navigator.userAgent.indexOf('iPad') != -1 ? 73 : 0;
    for (var i = list.length - 1; i >= 0; i--) {
      width += list[i].getElementsByTagName('button')[0].offsetWidth + 2 - modifier;
    }
    listWidth = width;
    delta = 80; // navigator.userAgent.indexOf("iPad") != -1 ? 120 : navList.offsetWidth - listWidth;;
    // log("document.body.offsetWidth = " + document.body.offsetWidth);
    // log("delta = " + delta);
    // log("listWidth = " + listWidth);
    app.UpdateCheckURL(true);
    scope.$apply();
    updateTime = window.setInterval(UpdateLayout, 16);
    if (document.getElementsByTagName('html')[0].className.indexOf('loaded') == -1) {
      document.getElementsByTagName('html')[0].className = document.getElementsByTagName('html')[0].className + ' loaded';
    }
  } else {
    window.setTimeout(GetNavElementsWidth, 100);
  }
}

$(window).on('hashchange', function() {
  app.UpdateCheckURL(true);
  scope.$apply();
});

window.onpopstate = function(event) {
  if (event && event.state) {
    window.location = window.location;
  }
};

document.body.onload = window.setTimeout(function() {
  GetNavElementsWidth();
}, 100);
