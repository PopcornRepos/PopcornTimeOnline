ui.vpn_page = {

	show:function(){

		if(ui.sliders.slider.vpn){
			ui.sliders.slider.vpn.hide()
			return;
		}

		ui.vpn_page.alert.hide();
		ui.loading_wrapper.hide();

		var slider = new ui.slider('vpn','left');
		$('#slider_vpn *').not('.close').remove();

		app.state = 'vpn_page';
		slider.destruct = function(){
			app.state='mainWindow';
		}

		slider.el.append($('#vpn_page_html').html())

		ui.vpn_page.updateDisplay();


		slider.show();


	},

	updateDisplay:function(){

		//var hostApp = {vpn_isConnected:function(){return 0},vpn_connect:function(){},vpn_disconnect:function(){}}
		$('#slider_vpn .vpn_icon span.icon').removeClass('spinner').parent().removeClass('rotation');

		if(app.config.hostApp.isVpnConnected){

			$('#slider_vpn .awaiting_msg').remove();
			$('#slider_vpn .vpn_icon span.icon').removeClass('unlocked').addClass('locked');
			$('#slider_vpn .vpn_button').html('Disconnect').unbind('click').click(function(){
				app.config.hostApp.vpn_disconnect();
			});

		}
		else{

			$('#slider_vpn .vpn_icon span.icon').removeClass('locked').addClass('unlocked');

			if(!app.config.hostApp.isVpnInstalled){

				$('#slider_vpn .vpn_button').html('&nbsp; Create VPN Account &nbsp;').unbind('click').click(function(){

					$('#slider_vpn .vpn_icon span.icon').removeClass('unlocked').addClass('spinner');
					$('#slider_vpn .vpn_icon div').addClass('rotation');
					if(!$('.awaiting_msg').length)
						$('#slider_vpn .vpn_button').parent().prepend('<div class="awaiting_msg" style="padding-bottom:50px;">Waiting for registration completion...</div>').unbind('click');

						ui.vpn_page.createAccountWindow();

				});

			}
			else{

				$('#slider_vpn .awaiting_msg').remove();
				$('#slider_vpn .vpn_button').html('Connect').unbind('click').click(function(){

					app.config.hostApp.vpn_connect();
					$('#slider_vpn .vpn_icon span.icon').removeClass('unlocked');
					$('#slider_vpn .vpn_icon span.icon').addClass('spinner');
					$('#slider_vpn .vpn_icon div').addClass('rotation');
					$('#slider_vpn .vpn_button').html('Connecting...').unbind('click');

					setTimeout(function(){
						if(ui.sliders.slider.vpn)
							ui.vpn_page.updateDisplay();
					},33000)

				});
			}

		}
	},

	alert:{
		check:function(callback){
			if(app.config.hostApp.isVPN && app.config.hostApp.vpnAlert!='off' && !app.config.hostApp.isVpnConnected){
				ui.vpn_page.alert.show();
				$('#vpn_alert .continue').attr('onclick', callback + '(1)');
				app.state = 'vpn_alert';
				return true;
			}
		},
		show:function(){
			if(app.config.hostApp.isVpnConnected) {
				torrentsTime.pt.start();
			} else {

				$('#vpn_alert').show()
				$('#vpn_alert .continue').attr('onclick', "ui.vpn_page.alert.hide();torrentsTime.pt.start()");
			}
		},

		hide:function(){
			$('#vpn_alert').hide();
		}

	},

	createAccountWindow:function(e){
		utils.popupwindow(vpnPageUrl, 'vpn', 571, 680);

		//if there is a bug we don't want to
		torrentsTime.setup.isVpnConnected = true;
	}

}
