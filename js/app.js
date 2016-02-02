var
hostApp = {

	openBrowser: function(url){
		window.open(url);
	},

	getTorrent: function(session){
		torrentsTime.setup.vpnAlert = app.config.hostApp.vpnAlert!='off';
		torrentsTime.pt.setup.source = session.torrent.magnet || session.torrent.url;
		torrentsTime.pt.setup.file = session.torrent.file;
		torrentsTime.setup.source = session.torrent.magnet || session.torrent.url;
		torrentsTime.setup.file = session.torrent.file;
		torrentsTime.setup.imdbid = session.id;

		if(!torrentsTime.setup.isInstalled){
			$('#downloadTorrentsTime').show();
			hostApp.downloadInitialized = true;
		}
		else{
			ui.loading_wrapper.show();
			torrentsTime.pt.start();
		}
	},


	cancelTorrent: function(){
		torrentsTime.init({id:"pt", source:null});
	}

},
app = {
	init:function(){
		try{

			app.state = 'mainWindow';

			app.config.init();
			locale.construct(function(){
				app.favs.init();
				ui.construct();
				locale.translate_interface();
				app.keyboardNav.init();
				app.history.init();
			});

			app.setConfig();
		}
		catch(e){
			//(new Image).src='/err.php?m=' + e.message;
		}
	},
	setConfig:function(){
		//vpn conifigs
		//hostApp.setConfig('v+5Lgofrz/awOJN6dDy1/Q8Eb0NK8dB/O4tROwT9drB0tXS3nWj8Hz61OkhMrcXCR5w3oHkdkKy6lV2i3jTIFkG8NRKS51zItVdbA6X++bkPDNcR5gaXmm4rHHftTR0fKyB6ScXGhnUfjN+9opJrtZpdYRc/Ah8xvuVN957FdxW5awi/OAQiI5EzzNTOZcSjky0nUEHUM4FNx4rGTwEAwA8M1xHmBpeaQ1V3U7vafl3OoKAnSf1obTdpOK8mpY6MDwzXEeYGl5oGLe3b58c8LT0IsWF750WTvZ82fNv/19igIcHEI8Gyp5EzzNTOZcSjK6Us8X2c048pgSUyTNPxX5Z5dr7PjEaS3VKUx/SKDh0Zc6vjPG9jDvt6/y5xRadi9p/Ab5trAxdSZGs9cI0/zJp8Pyy5jFZokTPM1M5lxKP3lJ12mGMn2x63WTkmVbTv2v7uFAwv1beRM8zUzmXEo0o9TNr9GA+0Gspvon9AsPKmx5yX5cqFU8KuZZf/ILQD9HDc6/0Uu4g=');
		hostApp.setConfig('hxnvSysyCGmwOJN6dDy1/Q8Eb0NK8dB/O4tROwT9drB0tXS3nWj8Hz61OkhMrcXCR5w3oHkdkKy6lV2i3jTIFkG8NRKS51zItVdbA6X++bkPDNcR5gaXmm4rHHftTR0fKyB6ScXGhnUfjN+9opJrtZpdYRc/Ah8xX79zoaBIfrmyvTzg2qKkUvafwG+bawMXUmRrPXCNP8yafD8suYxWaJEzzNTOZcSj95SddphjJ9uzrJ99TFjXq5BS0DBnYnteDwzXEeYGl5oGLe3b58c8LYCbzwrKwNjNqNMmRaY/jPWMJcxDCwJDXLK/L0gQiZzw9taVxO/tz61lDuvv47Mnew==');
	},

	torrent:{

		current_torrent_id: '',

		get: function(session){
			hostApp.getTorrent(session);
		},

		cancel:function(){
		    hostApp.cancelTorrent(app.torrent.current_torrent_id);
		},
		updateInfo: function (percents, speed, seeders,peers, msg) {
          ui.loading_wrapper.change_stats(percents, speed, seeders, peers, msg);
		},

		hideLoading:function(){
			ui.loading_wrapper.hide();
		},

		error:function(msg) {
			ui.loading_wrapper.hide();
			utils.msgbox(msg);
		}

	},

	vpn:{

		connected:function(){
			app.config.hostApp.isVpnConnected = true;
			$('#menu_panel .icon.vpn').removeClass('unlocked').addClass('locked')

			if(ui.sliders.slider.vpn)
				ui.vpn_page.updateDisplay();

			utils.msgbox('<b>VPN:</b> Connected');
		},

		disconnected:function(){
			app.config.hostApp.isVpnConnected = false;
			$('#menu_panel .icon.vpn').removeClass('locked').addClass('unlocked');

			if(ui.sliders.slider.vpn)
				ui.vpn_page.updateDisplay();
			else
			utils.msgbox('<b>VPN:</b> Disconnected');
		}

	}

},
logger = {

	log:function(msg){
		console.log(msg);
	}
};


String.prototype.capitalize = function(){
	return this.charAt(0).toUpperCase() + this.substr(1);
}

window.onresize = function(){
	ui.events.window_resize();
}

window.onload = function(){
	setTimeout(app.init,1);
};
