var ResourceGroupObject = function(spec) {
this.title = spec.title;
this.items = spec.items;
this.isEnabled = spec.isEnabled == undefined ? true : spec.isEnabled;
this.isRevealed = spec.isRevealed == undefined ? false : spec.isRevealed;
this.index = spec.index == undefined ? 0 : spec.index;
};

var ResourceItem = function(spec) {
this.title = spec.title;
this.url = spec.url;
this.isEnabled = spec.isEnabled == undefined ? true : spec.isEnabled;
};


var BaseResourceGroups = [
  new ResourceGroupObject({
    title: "Suicide",
    items: [
    	new ResourceItem({ url: "http://www.samhsa.gov/prevention/suicide.aspx", title: "SAMHSA Suicide Prevention" }),
    	new ResourceItem({ url: "http://www.save.org/", title: "Suicide Awareness Voices of Education" }),
    	new ResourceItem({ url: "http://www.metanoia.org/suicide/", title: "Suicide: Read This First" })
    ]
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
    	new ResourceItem({ url: "http://www.add.org/", title: "Attention Deficit Disorder Association" }),
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
    	new ResourceItem({ url: "http://www.pendulum.org/", title: "Bipolar Disorder News" }),
    	new ResourceItem({ url: "http://www.apa.org/topics/depress/recover.aspx", title: "American Psychological Association Depression" }),
    	new ResourceItem({ url: "http://www.psycom.net/depression-test/", title: "Psycom 3 Minute Depression Test" })
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
    	new ResourceItem({ url: "http://www.ptsd.va.gov/", title: "National Center for PTSD" })
    ]
  }),
  new ResourceGroupObject({
    title: "Eating disorders",
    items: [
    	new ResourceItem({ url: "http://www.something-fishy.org/", title: "Something Fishy" })
    ]
  }),
  new ResourceGroupObject({
    title: "Psychopharmocology",
    items: [
      new ResourceItem({ url: "http://www.drugs.com/drug_interactions.html", title: "Drug Interaction Checker" }),
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
    	new ResourceItem({ url: "http://www.dpt.samhsa.gov/comor/hivaids.aspx", title: "Medication Assisted Substance Abuse Treatment" })
    ]
  }),
  new ResourceGroupObject({
    title: "Chemical dependency",
    items: [
   		new ResourceItem({ url: "http://www.dpt.samhsa.gov/comor/hivaids.aspx", title: "Medication Assisted Substance Abuse Treatment" }),
    	new ResourceItem({ url: "http://www.journals.elsevier.com/journal-of-substance-abuse-treatment/", title: "Journal of Substance Abuse Treatment" })
    ]
  }),
  new ResourceGroupObject({
    title: "Additional resources",
    index: 1,
    items: [
      new ResourceItem({ url: "http://pb.rcpsych.org/", title: "Psychiatric Bulletin" }),
      new ResourceItem({ url: "http://www.psychologytoday.com/", title: "Psychology Today" }),
      new ResourceItem({ url: "http://counsellingresource.com", title: "CounsellingResource.com" }),
      new ResourceItem({ url: "http://mentalhealth.about.com/", title: "About Counseling, Very Well" }),
      new ResourceItem({ url: "http://mentalhelp.net/", title: "Mental Help Net" }),
      new ResourceItem({ url: "http://psychcentral.com/", title: "PsychCentral.com" }),
      new ResourceItem({ url: "http://www.eatright.org/", title: "Academy of Nutrition and Dietetics" }),
      new ResourceItem({ url: "http://www.psychwww.com/books/interp/toc.htm", title: "Interpretation of Dreams" }),
      new ResourceItem({ url: "http://www.project-aware.org/Experience/symptoms.shtml", title: "Menopause Facts" }),
      new ResourceItem({ url: "http://www.samhsa.gov/laws-regulations-guidelines/civil-rights-protections", title: "Mental Health Advocacy" }),
      new ResourceItem({ url: "http://www.cdc.gov/cfs/", title: "Chronic Fatigue Syndrome" })
    ]
  })
];
