var locale = {

	default_language: 'en',
	langs: {
		en:"English",
		nl:"Dutch",
		pt:"Português",
		es:"Español",
		fr:"Français",
		it:"Italiano",
		de:"Deutsch",
		ru:"Pусский",
		kr:"한국말",
		ar:"العربية",
		ro:"Român",
		he:"עברית",
		pl:"Polski",
		tr:"Türkçe",
	},
	construct:function(callback){
		if(!localStorage.getItem('localeCb3')){
			localStorage.setItem('localeCb3','1');
			localStorage.removeItem('locale_words')
		}

		locale.language = localStorage.getItem('locale') || locale.default_language;

		var words = localStorage.getItem('locale_words');
		if(words)
			try{ words = JSON.parse(words) }catch(e){words = false;console.log(e.message)}



		if(!words){
			$.get('/locale/'+locale.language+'.json?id=5', function(json){

				try{
					locale.words = typeof json == 'object' ? json : JSON.parse(json);
					localStorage.setItem('locale_words', JSON.stringify(locale.words));
					localStorage.setItem('locale', locale.language);
					callback();
				}
				catch(e){
					if(localStorage.getItem('locale_words')){
						logger.log('error_parsing_locale_' + locale.language);
						localStorage.removeItem('locale_words');
						locale.construct();

					}
					else{
						console.log(e.message);
						logger.log('error_parsing_locale_en');
					}

				}

			}, 'json')
			.fail(function() {
					if(localStorage.getItem('locale_words')){
						logger.log('error_parsing_locale_' + locale.language);
						localStorage.removeItem('locale_words');
						locale.construct();

					}
					else logger.log('error_parsing_locale_en');
			});
		}
		else{

			locale.words = words;
			callback();
		}

	},
	translate_interface:function(){

		var words = locale.words || {};

		$('[data-title-trans]').each(function(){
			var word = $(this).attr('data-title-trans');
			$(this).attr('title', (words[word] || word));
		})

		$('[data-ph-trans]').each(function(){
			var word = $(this).attr('data-ph-trans');
			$(this).attr('placeholder', (words[word] || word));
		})


		$('[data-in-trans]').each(function(){
			var word = $(this).attr('data-in-trans');
			$(this).html( (words[word] || word) );
		})

	},
	translate:function(word){

		var words = locale.words || {}
		return words[word] || word.toString().capitalize();

	},

	lang2iso:{
		"abkhazian":	"ab",
		"afar":			"aa",
		"afrikaans":	"af",
		"albanian":		"sq",
		"amharic":		"am",
		"arabic":		"ar",
		"armenian":		"hy",
		"assamese":		"as",
		"aymara":		"ay",
		"azerbaijani":	"az",
		"bashkir":		"ba",
		"basque":		"eu",
		"bengal":		"bn",
		"bhutani":		"dz",
		"bihari":		"bh",
		"bislama":		"bi",
		"bosnian":		"bs",
		"breton":		"br",
		"bulgarian":	"bg",
		"burmese":		"my",
		"byelorussian":	"be",
		"cambodian":	"km",
		"catalan":		"ca",
		"chinese":		"zh",
		"corsican":		"co",
		"croatian":		"hr",
		"czech":		"cs",
		"danish":		"da",
		"dutch":		"nl",
		"english":		"en",
		"esperanto":	"eo",
		"estonian":		"et",
		"faeroese":		"fo",
		"fiji":			"fj",
		"finnish":		"fi",
		"french":		"fr",
		"frisian":		"fy",
		"gaelic":		"gd",
		"galician":		"gl",
		"georgian":		"ka",
		"german":		"de",
		"greek":		"el",
		"greenlandic":	"kl",
		"guarani":		"gn",
		"gujarati":		"gu",
		"hausa":		"ha",
		"hebrew":		"he",
		"hindi":		"hi",
		"hungarian":	"hu",
		"icelandic":	"is",
		"indonesian":	"in",
		"interlingua":	"ia",
		"interlingue":	"ie",
		"inupiak":		"ik",
		"irish":		"ga",
		"italian":		"it",
		"japanese":		"ja",
		"javanese":		"jw",
		"kannada":		"kn",
		"kashmiri":		"ks",
		"kazakh":		"kk",
		"kinyarwanda":	"rw",
		"kirghiz":		"ky",
		"kirundi":		"rn",
		"korean":		"ko",
		"kurdish":		"ku",
		"laothian":		"lo",
		"latin":		"la",
		"latvia":		"lv",
		"lingala":		"ln",
		"lithuanian":	"lt",
		"macedonian":	"mk",
		"malagasy":		"mg",
		"malay":		"ms",
		"malayalam":	"ml",
		"maltese":		"mt",
		"maori":		"mi",
		"marathi":		"mr",
		"moldavian":	"mo",
		"mongolian":	"mn",
		"nauru":		"na",
		"nepali":		"ne",
		"norwegian":	"no",
		"occitan":		"oc",
		"oriya":		"or",
		"orom":			"om",
		"pasht":		"ps",
		"persian":		"fa",
		"polish":		"pl",
		"portuguese":	"pt",
		"punjabi":		"pa",
		"quechua":		"qu",
		"rhaeto-romance":"rm",
		"romanian":		"ro",
		"russian":		"ru",
		"samoan":		"sm",
		"sangro":		"sg",
		"sanskrit":		"sa",
		"serbian":		"sr",
		"serbo-croatian":"sh",
		"sesotho":		"st",
		"setswana":		"tn",
		"shona":		"sn",
		"sindhi":		"sd",
		"singhalese":	"si",
		"siswati":		"ss",
		"slovak":		"sk",
		"slovenian":	"sl",
		"somali":		"so",
		"spanish":		"es",
		"sudanese":		"su",
		"swahili":		"sw",
		"swedish":		"sv",
		"tagalog":		"tl",
		"tajik":		"tg",
		"tamil":		"ta",
		"tatar":		"tt",
		"tegulu":		"te",
		"thai":			"th",
		"tibetan":		"bo",
		"tigrinya":		"ti",
		"tonga":		"to",
		"tsonga":		"ts",
		"turkish":		"tr",
		"turkmen":		"tk",
		"twi":			"tw",
		"ukrainian":	"uk",
		"urdu":			"ur",
		"uzbek":		"uz",
		"vietnamese":	"vi",
		"volapuk":		"vo",
		"welsh":		"cy",
		"wolof":		"wo",
		"xhosa":		"xh",
		"yiddish":		"ji",
		"yoruba":		"yo",
		"zulu":			"zu"
	},

	iso2lang:{"ab":"Abkhazian","aa":"Afar","af":"Afrikaans","sq":"Albanian","am":"Amharic","ar":"Arabic","hy":"Armenian","as":"Assamese","ay":"Aymara","az":"Azerbaijani","ba":"Bashkir","eu":"Basque","bn":"Bengal","dz":"Bhutani","bh":"Bihari","bi":"Bislama","br":"Breton","bg":"Bulgarian","my":"Burmese","be":"Byelorussian","km":"Cambodian","ca":"Catalan","zh":"Chinese","co":"Corsican","hr":"Croatian","cs":"Czech","da":"Danish","nl":"Dutch","en":"English","eo":"Esperanto","et":"Estonian","fo":"Faeroese","fj":"Fiji","fi":"Finnish","fr":"French","fy":"Frisian","gd":"Gaelic","gl":"Galician","ka":"Georgian","de":"German","el":"Greek","kl":"Greenlandic","gn":"Guarani","gu":"Gujarati","ha":"Hausa","he":"Hebrew","hi":"Hindi","hu":"Hungarian","is":"Icelandic","in":"Indonesian","ia":"Interlingua","ie":"Interlingue","ik":"Inupiak","ga":"Irish","it":"Italian","ja":"Japanese","jw":"Javanese","kn":"Kannada","ks":"Kashmiri","kk":"Kazakh","rw":"Kinyarwanda","ky":"Kirghiz","rn":"Kirundi","ko":"Korean","ku":"Kurdish","lo":"Laothian","la":"Latin","lv":"Latvia","ln":"Lingala","lt":"Lithuanian","mk":"Macedonian","mg":"Malagasy","ms":"Malay","ml":"Malayalam","mt":"Maltese","mi":"Maori","mr":"Marathi","mo":"Moldavian","mn":"Mongolian","na":"Nauru","ne":"Nepali","no":"Norwegian","oc":"Occitan","or":"Oriya","om":"Orom","ps":"Pasht","fa":"Persian","pl":"Polish","pt":"Portuguese","pa":"Punjabi","qu":"Quechua","rm":"Rhaeto-romance","ro":"Romanian","ru":"Russian","sm":"Samoan","sg":"Sangro","sa":"Sanskrit","sr":"Serbian","sh":"Serbo-croatian","st":"Sesotho","tn":"Setswana","sn":"Shona","sd":"Sindhi","si":"Singhalese","ss":"Siswati","sk":"Slovak","sl":"Slovenian","so":"Somali","es":"Spanish","su":"Sudanese","sw":"Swahili","sv":"Swedish","tl":"Tagalog","tg":"Tajik","ta":"Tamil","tt":"Tatar","te":"Tegulu","th":"Thai","bo":"Tibetan","ti":"Tigrinya","to":"Tonga","ts":"Tsonga","tr":"Turkish","tk":"Turkmen","tw":"Twi","uk":"Ukrainian","ur":"Urdu","uz":"Uzbek","vi":"Vietnamese","vo":"Volapuk","cy":"Welsh","wo":"Wolof","xh":"Xhosa","ji":"Yiddish","yo":"Yoruba","zu":"Zulu"}

}
