app.config={

	init:function(){

		this.fetcher = {
			mode:	'imdb',
			sortBy: 'seeds'

		}

		this.api_keys = {

			//tmdb:		["9b939aee0aaafc12a65bf448e4af9543"][(Math.floor(Math.random()*1))],
			tmdb:		'9b939aee0aaafc12a65bf448e4af9543',
			tmdb_url:	'http://api.themoviedb.org/3/',
			tmdb_src:	'http://image.tmdb.org/t/p/',

		}

		this.locale = {

			preferredSubs: localStorage.getItem('conf_locale_preferredSubs')

		}


		var storage = {
			ui:{
				coverScale: 	1.1,
				coverWidth:		133,
				coverTiteSize:	12,
				coverYearSize:	12,
				coverToolsSize:	12,
				coverStarsSize:	17,
			}
		}

		for(var i in storage){
			this[i] = {};
			for(var key in storage[i])
				this[i][key] = localStorage.getItem('conf_' + i + '_' + key)  || storage[i][key];
		}
	},

	set:function(values){
		for(var i in values){
			for(var key in values[i]){
				this[i][key] = values[i][key]
				localStorage.setItem('conf_' + i + '_' + key, values[i][key])
			}
		}

	},

	hostApp:{

		isVpnConnected:	false,
		tempPath:		localStorage.getItem('conf_hostApp_tempPath') || '',
		subsFontSize:	localStorage.getItem('conf_hostApp_subsFontSize') || "0",
		cleanOnExit:	localStorage.getItem('conf_hostApp_cleanOnExit') && localStorage.getItem('conf_hostApp_cleanOnExit')!="0",
		hideGlare:		localStorage.getItem('conf_hostApp_hideGlare') || false,
		//vpnAlert:		localStorage.getItem('conf_hostApp_vpnAlert') || "on",
		vpnAlert:		localStorage.getItem('conf_hostApp_vpnAlert') || "off",
		isVPN:			1,
		vpnInstalled:	function(mode){
			app.config.hostApp.isVpnInstalled = (mode ? 1:0);
			ui.vpn_page.updateDisplay();
		},
		vpn_connect:function(){
			if(torrentsTime.pt.vpn_connect) {
				torrentsTime.pt.vpn_connect();
			}
		},
		vpn_disconnect:function(){
			if(torrentsTime.pt.vpn_disconnect) {
				torrentsTime.pt.vpn_disconnect();
			}
		}

	},

   updateView:function(){

      $('.temp_path.txt').val(app.config.hostApp.tempPath);
      app.config.set({hostApp:{
         tempPath:app.config.hostApp.tempPath
      }
      });
   }


}
