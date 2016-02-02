ui.settings_page = {

	show:function(){

		if(ui.sliders.slider.settings){
			ui.sliders.slider.settings.hide()
			return;
		}

		var
		cacheFolder 	= app.config.hostApp.tempPath,
		opts 			= '',
		fontSizesTokesn = '',
		fontSizes		= {
			"2":"Extra large",
			"1":"Large",
			"0":"Normal",
			"-1":"Small",
			"-2":"Extra small",

		},
		curfontSize = (app.config.hostApp.subsFontSize || "0").toString();

		for(var i in locale.langs)
			opts += '<option value="'+i+'" ' + (locale.language==i ? 'selected' : '') + '>' + locale.langs[i] + '</option>';

		for(var i in fontSizes)
			fontSizesTokesn += '<option value="' + i + '" ' + (curfontSize==i ? 'selected' : '') + '>' + fontSizes[i] + '</option>';


		if(app.config.hostApp.hideGlare==1){
			$('body').addClass('hideGlare');
			$('.hideGlare_input').attr('checked',1);
		}
		else
			$('.hideGlare_input').removeAttr('checked');


		if(app.config.hostApp.vpnAlert!='off')
			$('input.vpnalert').attr('checked',1);
		else
			$('input.vpnalert').removeAttr('checked');


		var
		slider 	= new ui.slider('settings', 'left'),
		tokens 	= {
			languages:opts,
			cache_path: app.config.hostApp.tempPath,
			fontSizes: fontSizesTokesn
		},
		html	= utils.tokenizer(tokens, $('#settings_page_html').html());


		slider.el.append(html)

		if(app.config.hostApp.cleanOnExit)
			$('#slider_settings input.cf_checkbox')[0].checked=true;


		$('#slider_settings select.langs').change(function(){
			var
			c 			= $(this).val(),
			language 	= locale.langs[c];

			//if(confirm('This will change your language to: ' + language)){

				localStorage.setItem('locale', c);
				localStorage.removeItem('locale_words');

				locale.construct(function(){
					locale.translate_interface();
				});

			//}
			//else return false;
		});


		slider.show();
	}

}
