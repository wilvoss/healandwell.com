var app;
var scope;

angular.module("appModule", []);

angular
  .module("appModule")
  .controller("appController", function($timeout, $scope) {
    app = this;
    scope = angular.element($(document.body)).scope();

    app.Today = moment().toDate();
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
    // app.SelectFontSize(app.FontSizes.normal);

    /* ============= Resource management ============= */
    app.ResourceGroups = [
      new ResourceGroupObject({
        title: "Suicide",
        items: [new ResourceItem({ url: "http://www.samhsa.gov/prevention/suicide.aspx", title: "SAMHSA Suicide Prevention" }), new ResourceItem({ url: "http://www.save.org/", title: "Suicide Awareness Voices of Education" }), new ResourceItem({ url: "http://www.metanoia.org/suicide/", title: "Suicide: Read This First" })]
      }),
      new ResourceGroupObject({
        title: "Addiction",
        items: [
          new ResourceItem({ url: "http://www.aa.org/", title: "Alcoholic's Anonymous" }),
          new ResourceItem({ url: "http://netaddiction.com/", title: "Center for On-Line Addiction" }),
          new ResourceItem({ url: "http://www.samhsa.gov/prevention/", title: "SAMHSA Prevention of Substance Abuse" }),
          new ResourceItem({ url: "http://www.samhsa.gov/treatment/", title: "SAMHSA Treatments and Services" }),
          new ResourceItem({ url: "http://www.well.com/user/woa/", title: "Internet Addiction, netaddiction.com" })
        ]
      }),
      new ResourceGroupObject({
        title: "Anxiety",
        items: [
          new ResourceItem({ url: "http://www.apa.org/topics/anxiety/panic-disorder.aspx", title: "American Psychological Association Panic Disorder" }),
          new ResourceItem({ url: "http://www.mayoclinic.com/health/obsessive-compulsive-disorder/DS00189", title: "Obsessive-compulsive disorder (OCD), Mayo Clinic" }),
          new ResourceItem({ url: "http://www.ocfoundation.org/", title: "International OCD Foundation" }),
          new ResourceItem({ url: "http://www.calmclinic.com", title: "Calm Clinic" })
        ]
      }),
      new ResourceGroupObject({
        title: "Associations",
        items: [
          new ResourceItem({ url: "http://www.aacap.org/", title: "American Academy of Child &amp; Adolescent Psychiatry" }),
          new ResourceItem({ url: "http://www.aamft.org/", title: "American Association for Marriage and Family Therapy" }),
          new ResourceItem({ url: "http://www.counseling.org/", title: "American Counseling Association" }),
          new ResourceItem({ url: "http://www.psych.org/", title: "American Psychiatric Association" }),
          new ResourceItem({ url: "http://www.apa.org/", title: "American Psychological Association" }),
          new ResourceItem({ url: "http://www.psychologicalscience.org/", title: "Association for Psychological Science" }),
          new ResourceItem({ url: "http://www.nimh.nih.gov/", title: "National Institute of Mental Health" }),
          new ResourceItem({ url: "http://www.nmha.org/", title: "Mental Health America" }),
          new ResourceItem({ url: "http://www.samhsa.gov/", title: "Substance Abuse and Mental Health Services Administration" })
        ]
      }),
      new ResourceGroupObject({
        title: "ADHD",
        items: [
          new ResourceItem({ url: "http://www.add.org/", title: "Attention Deficit Disorder Association, add.org" }), 
          new ResourceItem({ url: "http://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd/index.shtml", title: "Attention-Deficit Hyperactivity Disorder, NIMH" })
        ]
      }),
      new ResourceGroupObject({
        title: "Abuse",
        isRevealed: true,
        items: [
          new ResourceItem({ url: "http://www.childhelp.org/", title: "Childhelp USA®" }),
          new ResourceItem({ url: "http://www.apa.org/topics/trauma/memories.aspx", title: "American Psychological Association Childhood Abuse" }),
          new ResourceItem({ url: "http://www.ndvh.org/", title: "The National Domestic Violence Hotline" })
        ]
      }),
      new ResourceGroupObject({
        title: "Mood Disorders",
        items: [
          new ResourceItem({ url: "http://www.pendulum.org/", title: "Bipolar Disorder News - Pendulum.org" }),
          new ResourceItem({ url: "http://www.apa.org/topics/depress/recover.aspx", title: "American Psychological Association Depression" }),
          new ResourceItem({ url: "http://www.psycom.net/depression-test/", title: "Psycom 3 Minute Depression Test" }),
        ]
      }),
      new ResourceGroupObject({
        title: "Autism Spectrum",
        items: [
          new ResourceItem({ url: "https://www.ninds.nih.gov/Disorders/All-Disorders/Asperger-Syndrome-Information-Page", title: "Asperger's Disorder" }), 
          new ResourceItem({ url: "http://medicine.yale.edu/childstudy/autism/clinical_services/", title: "Autism Program at Yale" })
        ]
      }),
      new ResourceGroupObject({
        title: "PTSD",
        items: [
          new ResourceItem({ url: "http://www.sidran.org/", title: "Sidran Traumatic Stress Institute" }),
          new ResourceItem({ url: "http://www.ptsd.va.gov/", title: "National Center for PTSD" }),
        ]
      }),
      new ResourceGroupObject({
        title: "Eating disorders",
        items: [
          new ResourceItem({ url: "http://www.something-fishy.org/", title: "Something Fishy" })
        ]
      }),
      // new ResourceGroupObject({
      //   title: "Journals &amp; magazines",
      //   items: [
          // new ResourceItem({ url: "http://www.addwarehouse.com/shopsite_sc/store/html/product311.html", title: "ADHD Report" }),
          // new ResourceItem({ url: "http://www.tandf.co.uk/journals/titles/10615806.html", title: "Anxiety, Stress and Coping" }),
          // new ResourceItem({ url: "http://www.sagepub.com/journalsProdDesc.nav?prodId=Journal200822", title: "Autism" }),
          // new ResourceItem({ url: "http://www.sagepub.com/journalsProdDesc.nav?prodId=Journal200979", title: "Childhood" }),
          // new ResourceItem({ url: "http://onlinelibrary.wiley.com/journal/10.1002/%28ISSN%291557-0711", title: "Contemporary Hypnosis" }),
          // new ResourceItem({ url: "http://www.sagepub.com/journalsProdDesc.nav?prodId=Journal201266", title: "Dementia" }),
          // new ResourceItem({ url: "http://www.adaa.org/resources-professionals/depression-anxiety-journal-adaas", title: "Depression and Anxiety" }),
          // new ResourceItem({ url: "http://onlinelibrary.wiley.com/journal/10.1111/%28ISSN%291465-3362", title: "Drug and Alcohol Review" }),
          // new ResourceItem({ url: "http://www.springer.com/linguistics/journal/11881", title: "Dyslexia" }),
          // new ResourceItem({ url: "http://www.tandf.co.uk/journals/titles/03004430.html", title: "Early Child Development and Care" }),
          // new ResourceItem({ url: "http://www.tandf.co.uk/journals/titles/10640266.asp", title: "Eating Disorders" }),
          // new ResourceItem({ url: "http://www.springer.com/education+%26+language/journal/11092", title: "Educational Assessment" }),
          // new ResourceItem({ url: "http://www.springer.com/medicine/psychiatry/journal/10899", title: "Journal of Gambling Studies" }),
          // new ResourceItem({ url: "http://www.springer.com/social+sciences/well-being/journal/10902", title: "Journal of Happiness Studies" }),
          // new ResourceItem({ url: "http://www.tandf.co.uk/journals/titles/13607863.asp", title: "Journal of Mental Health and Aging" }),
          // new ResourceItem({ url: "http://www.tandf.co.uk/journals/titles/0092623X.html", title: "Journal of Sex &amp; Marital Therapy" }),
          // new ResourceItem({ url: "http://journals.humankinetics.com/JSEP", title: "Journal of Sport and Exercise Psychology" }),
          // new ResourceItem({ url: "http://www.tandfonline.com/loi/plcp21#.V08DHPkrJaQ", title: "Language and Cognitive Processes" }),
          // new ResourceItem({ url: "http://www.informaworld.com/smpp/title~content=t904385074~db=all", title: "Loss, Grief &amp; Care" }),
          // new ResourceItem({ url: "http://aaiddjournals.org/", title: "Mental Retardation and Developmental Disabilities " }),
          // new ResourceItem({ url: "http://www.tandf.co.uk/journals/titles/1092-6488.asp", title: "Metaphor and Symbol" }),
          // new ResourceItem({ url: "http://www.tandf.co.uk/journals/titles/09602011.asp", title: "Neuropsychological Rehabilitation" }),
          // new ResourceItem({ url: "https://www.routledge.com/Parenting-at-Home-A-Special-Double-Issue-of-Parenting-Science-and-Practice/Linver-Books-Gunn/p/book/9780805895230", title: "Parenting" }),
          // new ResourceItem({ url: "http://www.blackwellpublishing.com/journal.asp?ref=1350-4126", title: "Personal Relationships" }),
          // new ResourceItem({ url: "http://www.journals.elsevier.com/personality-and-individual-differences/", title: "Personality and Individual Differences" }),
          // new ResourceItem({ url: "http://www.apa.org/pubs/journals/men/index.aspx", title: "Psychology of Men &amp; Masculinity" }),
          // new ResourceItem({ url: "http://www.wiley.com/WileyCDA/WileyTitle/productCd-SMI2.html", title: "Stress and Health" }),
          // new ResourceItem({ url: "http://www.sciencedirect.com/science/journal/07405472", title: "Substance Abuse" }),
          // new ResourceItem({ url: "http://www.sagepub.com/journalsProdDesc.nav?prodId=Journal200782", title: "Trauma, Violence &amp; Abuse" })
      //   ]
      // }),
      new ResourceGroupObject({
        title: "Psychopharmocology",
        items: [
          new ResourceItem({ url: "http://www.drugs.com/drug_interactions.html", title: "Drug Interaction Checker, Drugs.com" }),
          new ResourceItem({ url: "http://www.pdrhealth.com/home/home.aspx", title: "Prescriber's Digital Reference" }),
          new ResourceItem({ url: "http://www.nlm.nih.gov/medlineplus/druginformation.html", title: "Medline: Drugs, Herbs, and Supplements" }),
          new ResourceItem({ url: "http://ods.od.nih.gov/Health_information/Vitamin_and_Mineral_Supplement_Fact_Sheets.aspx", title: "National Institutes of Health: Supplements" })
        ]
      }),
      new ResourceGroupObject({
        title: "Personality",
        items: [
          new ResourceItem({ url: "http://www.mentalhelp.net/poc/center_index.php?id=8", title: "Mental Help Net - Personality Disorders" }),
          new ResourceItem({ url: "http://www.keirsey.com/sorter/register.aspx", title: "Keirsey (Myers-Briggs) Temperament Sorter" }),
          new ResourceItem({ url: "http://www.dpt.samhsa.gov/comor/hivaids.aspx", title: "Medication Assisted Substance Abuse Treatment" }),
          
          ]
      }),
      new ResourceGroupObject({
        title: "Chemical dependency",
        items: [
          new ResourceItem({ url: "http://www.dpt.samhsa.gov/comor/hivaids.aspx", title: "Medication Assisted Substance Abuse Treatment" }),
          new ResourceItem({ url: "http://www.journals.elsevier.com/journal-of-substance-abuse-treatment/", title: "Journal of Substance Abuse Treatment" }),
          ]
      }),
      new ResourceGroupObject({
        title: "Additional resources",
        items: [
          new ResourceItem({ url: "http://pb.rcpsych.org/", title: "Psychiatric Bulletin" }),
          new ResourceItem({ url: "http://www.psychologytoday.com/", title: "Psychology Today" }),
          new ResourceItem({ url: "http://counsellingresource.com", title: "CounsellingResource.com" }),
          new ResourceItem({ url: "http://mentalhealth.about.com/", title: "About Counseling, Very Well" }),
          new ResourceItem({ url: "http://mentalhelp.net/", title: "Mental Help Net" }),
          new ResourceItem({ url: "http://psychcentral.com/", title: "PsychCentral.com" }),
          new ResourceItem({ url: "http://www.eatright.org/", title: "Academy of Nutrition and Dietetics, eatright.org" }), 
          new ResourceItem({ url: "http://www.psychwww.com/books/interp/toc.htm", title: "Interpretation of Dreams" }),
          new ResourceItem({ url: "http://www.project-aware.org/Experience/symptoms.shtml", title: "Menopause Facts" }),
          new ResourceItem({ url: "http://www.samhsa.gov/laws-regulations-guidelines/civil-rights-protections", title: "Mental Health Advocacy" }),
          new ResourceItem({ url: "http://www.cdc.gov/cfs/", title: "Chronic Fatigue Syndrome" }),
        ]
      })
      
    ];

    /* ============= Navigation management ============= */
    app.CurrentLink;
    app.NavigationLinks = {
      home: new NavigationLinkObject({ id: "home", name: "Welcome", position: 0 }),
      // appointments: new NavigationLinkObject({ id: "appointments", name: "Appointments", position: 1, isDisabled: true }),
      services: new NavigationLinkObject({ id: "services", name: "Services", position: 2 }),
      about: new NavigationLinkObject({ id: "about", name: "About", position: 3 }),
      connect: new NavigationLinkObject({ id: "connect", name: "Connect", position: 4, previousIds: ["contact"] }),
      intake: new NavigationLinkObject({ id: "intake", name: "New clients", position: 5 }),
      resources: new NavigationLinkObject({ id: "resources", name: "Resources", position: 6 })
    };

    app.SelectLink = function(selected_link) {
      for (var link in app.NavigationLinks) {
        app.NavigationLinks[link].isSelected = false;
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
      // alert(getHashValue("/page"));
      checkHash = checkHash == undefined ? false : checkHash;
      if (getHashValue("/page") != null) {
          var pageId = app.CheckHashAgainstPageIds(getHashValue("/page"));
        if (checkHash==true) {
          if (pageId != null) {
            app.SelectLink(app.NavigationLinks[pageId]);
          } else {
            app.PushHistory(app.NavigationLinks.home.id);
          }
        } else {
            app.SelectLink(app.NavigationLinks[pageId]);
        }
      } else {
            app.PushHistory("home");
      }
    };

    app.PushHistory = function(linkId) {
      history.pushState(null, "", "#/page=" + linkId);
      app.UpdateCheckURL();
    };

    //app.UpdateCheckURL(true);
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
  this.previousIds = spec.previousIds;
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

var ResourceGroupObject = function(spec) {
  this.title = spec.title;
  this.items = spec.items;
  this.isEnabled = spec.isEnabled == undefined ? true : spec.isEnabled;
  this.isRevealed = spec.isRevealed == undefined ? false : spec.isRevealed;
};
var ResourceItem = function(spec) {
  this.title = spec.title;
  this.url = spec.url;
  this.isEnabled = spec.isEnabled == undefined ? true : spec.isEnabled;
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
var narrow = false;

function UpdateLayout() {
  // narrow = document.body.offsetWidth - 120 + delta - 2 < listWidth || document.body.offsetHeight < 450;
  narrow = document.body.offsetWidth - delta < listWidth || document.body.offsetHeight < 450;
  //document.body.className = narrow ? "narrow" : "";

  // var scope = angular.element($(document.body)).scope();
  app.IsNarrow = narrow;
  var newHeight = document.body.offsetHeight - header.offsetTop - parseInt($(main).css("border-top-width").replace("px", "")) - header.offsetHeight - nav.offsetHeight - footer.offsetHeight - (narrow ? 0 : 20);
  if (app.CurrentMainHeight != (newHeight+"px")) {
    //log(app.CurrentMainHeight + "!=" + newHeight);
    if (narrow) {
      app.CurrentMainHeight = "auto";
    } else {
      app.CurrentMainHeight = newHeight + "px";
      app.ContactGoogleMapCurrentHeight = parseInt(newHeight) - 80 + "px";
    }
    app.UpdateCheckURL();
  }

  if (narrow) {
    var scrollTop = document.getElementsByTagName("wrap")[0].scrollTop;
    app.HealingAndWellnessScrolledOutOfView = scrollTop > 70;
  }
  scope.$apply();
}

function GetNavElementsWidth() {
  mainBorderTop = parseInt($(main).css("border-top-width").replace("px", ""));
  if (list.length > 0) {
    var width = 0;
    var modifier = navigator.userAgent.indexOf("iPad") != -1 ? 73 : 0;
    // log(navigator.userAgent, true);
    for (var i = list.length - 1; i >= 0; i--) {
      // log("element " + list[i].getElementsByTagName("button")[0].innerHTML + " width = " + (list[i].getElementsByTagName("button")[0].offsetWidth + 2 - modifier));
      width += list[i].getElementsByTagName("button")[0].offsetWidth + 2 - modifier;
    }
    listWidth = width;
    delta = 120;
    log("document.body.offsetWidth = " + document.body.offsetWidth)
    log("listWidth = " + listWidth)
    log("delta = " + delta)
  app.UpdateCheckURL(true);
  scope.$apply();
    updateTime = window.setInterval(UpdateLayout, 16);
    if (document.getElementsByTagName("html")[0].className.indexOf("loaded") == -1) {
      document.getElementsByTagName("html")[0].className = document.getElementsByTagName("html")[0].className + " loaded";
    }
  } else {
    window.setTimeout(GetNavElementsWidth, 100);
  }
}

$(window).on("hashchange", function() {
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
