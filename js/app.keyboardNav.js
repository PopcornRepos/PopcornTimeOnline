app.keyboardNav = {

	init:function(){

		Mousetrap.bind('tab',function(){

			switch(app.state){
				case 'mainWindow':
					$('#toolbar .btn').not('.activated').click();
				break;
			}


		})




		Mousetrap.bind('right',function(){

			switch(app.state){
				case 'mainWindow':
					if($('#movies_catalog .movie.khover').length){

						var current = $('#movies_catalog .movie.khover');
						$('.khover').removeClass('khover');

						var el = current.next();
						el.addClass('khover');
						ui.home.catalog.scroller.scrollToElement(el[0],null,null,true)

					}
					else{
						$('#movies_catalog .movie').first().addClass('khover')
					}
				break;

				case 'tvshow':
					var khover = $('#slider_tvshow .khover');
					if(!khover.length)
						$('slider_tvshow .episode').first().addClass('khover');
					else{

						if(khover.hasClass('episode'))
							khover.children('.pseudo_click_listener').click()
						else{
							$('#slider_tvshow .khover').removeClass('khover');

							var nextEpisode = $('#slider_tvshow .episode.activated').next();
							if(nextEpisode.length)
								nextEpisode.addClass('khover')
							else
								$('#slider_tvshow .episode').first().addClass('khover')

						}
					}

					var currEl = $('#slider_tvshow .khover');
					ui.tv[(currEl.hasClass('season') ? 'seasons' : 'episodes') + '_scroller'].scrollToElement(currEl[0],null,null,true)

				break;
			}

		})


		Mousetrap.bind('left',function(){

			switch(app.state){
				case 'mainWindow':
					if($('#movies_catalog .movie.khover').length){

						var current = $('#movies_catalog .movie.khover');
						$('.khover').removeClass('khover');

						var el = current.prev()
						el.addClass('khover');
						ui.home.catalog.scroller.scrollToElement(el[0],null,null,true)

					}
					else{
						$('#movies_catalog .movie').first().addClass('khover')
					}
				break;

				case 'tvshow':
					var khover = $('#slider_tvshow .khover')
					if(khover.hasClass('episode')){
						khover.removeClass('khover');
						var nextSeason = $('#slider_tvshow .season.activated').next();
						if(nextSeason.length)
							nextSeason.addClass('khover');
						else
							$('#slider_tvshow .season').first().addClass('khover');
					}
				break;
			}

		})

		Mousetrap.bind('down',function(){

			switch(app.state){
				case 'mainWindow':

					if($('body.sidemenu_open').length){

						var curr = $('#genres_box .genre.khover')
						$('.khover').removeClass('khover');

						var next = curr.length ? curr.next() : $('#genres_box .genre').first();
						next.addClass('khover');

						if(next.length){
							var pos = next.position().top;
							if(pos<$('#genres_box')[0].scrollTop+15 || pos>$('#genres_box').height()-15){
								$('#genres_box')[0].scrollTop = pos;
							}
						}


					}
					else{

						if($('#movies_catalog .movie.khover').length){

							var current = $('#movies_catalog .movie.khover');

							var idx = current.index()+ui.home.catalog.numItemsInRow-1
							if(idx>0 && idx<$('#movies_catalog .movie').length){
								$('.khover').removeClass('khover');
								var el = $('#movies_catalog .movie').eq(idx);
								el.addClass('khover');
								ui.home.catalog.scroller.scrollToElement(el[0],null,null,true)
							}

						}
						else{
							$('#movies_catalog .movie').first().addClass('khover')
						}
					}
				break;

				case 'tvshow':

					var khover = $('#slider_tvshow .khover');
					$('#slider_tvshow .khover').removeClass('khover')

					if(!khover.length){
						var nextSeason = $('#slider_tvshow .season.activated').next();
						if(nextSeason.length)
							nextSeason.addClass('khover');
						else
							$('#slider_tvshow .season').first().addClass('khover');
					}
					else{
						var nextSeason = khover.next();
						if(nextSeason.length)
							nextSeason.addClass('khover');
						else{
							if(khover.hasClass('season'))
								$('#slider_tvshow .season').first().addClass('khover');
							else
								$('#slider_tvshow .season.activated').next().addClass('khover');
						}


					}

					var currEl = $('#slider_tvshow .khover');
					ui.tv[(currEl.hasClass('season') ? 'seasons' : 'episodes') + '_scroller'].scrollToElement(currEl[0],null,null,true)

				break;
			}

		})

		Mousetrap.bind('up',function(){

			switch(app.state){
				case 'mainWindow':

					if($('body.sidemenu_open').length){

						var curr = $('#genres_box .genre.khover')
						$('.khover').removeClass('khover');

						var next = curr.length ? curr.prev() : $('#genres_box .genre').last();
						next.addClass('khover');

						if(next.length){
							var pos = next.position().top;
							if(pos<$('#genres_box')[0].scrollTop+15 || pos>$('#genres_box').height()-15){
								$('#genres_box')[0].scrollTop = pos;
							}
						}


					}
					else{
						if($('#movies_catalog .movie.khover').length){

							var current = $('#movies_catalog .movie.khover');


							var idx = current.index()-ui.home.catalog.numItemsInRow-1;
							if(idx>0 && idx<$('#movies_catalog .movie').length){
								$('.khover').removeClass('khover');
								var el = $('#movies_catalog .movie').eq(idx	);
								el.addClass('khover');
								ui.home.catalog.scroller.scrollToElement(el[0],null,null,true)
							}

						}
						else{
							$('#movies_catalog .movie').first().addClass('khover')
						}
					}
				break;

				case 'tvshow':

					var khover = $('#slider_tvshow .khover');
					$('#slider_tvshow .khover').removeClass('khover')

					if(!khover.length){
						var nextSeason = $('#slider_tvshow .season.activated').prev();
						if(nextSeason.length)
							nextSeason.addClass('khover');
						else
							$('#slider_tvshow .season').first().addClass('khover');
					}
					else{
						var nextSeason = khover.prev();
						if(nextSeason.length)
							nextSeason.addClass('khover');
						else{
							if(khover.hasClass('season'))
								$('#slider_tvshow .season').last().addClass('khover');
							else
								$('#slider_tvshow .episode').last().addClass('khover');
						}



					}

					var currEl = $('#slider_tvshow .khover');
					ui.tv[(currEl.hasClass('season') ? 'seasons' : 'episodes') + '_scroller'].scrollToElement(currEl[0],null,null,true)

				break;
			}

		})


		Mousetrap.bind(['esc','backspace'],function(){

			switch(app.state){
				case 'mainWindow':
					if($('#search_cont.activated').length){
						$('#search_input').blur();
						$('#search_cont.activated').removeClass('activated')
					}
					else if($('body.sidemenu_open').length){
						Mousetrap.trigger('shift');
					}
					else
						$('#movies_catalog .movie.khover').removeClass('khover')
				break;
				case 'vpn_alert':
					$('#vpn_alert .continue').click();
				break;
				default:

					if($('body.loading #loading_wrapper .close').length)
						$('body.loading #loading_wrapper .close').click();

					else if($('.slider').length)
						$('.slider').last().children('.close').click();

				break;
			}

		})


		Mousetrap.bind('ctrl+f',function(){
			$('#search_cont').addClass('activated');
			$('#search_input').focus();

		})

		Mousetrap.bind('ctrl+-',function(){
			var v = parseInt($('#size_setter').val());
			$('#size_setter').val((-5+v)).change();

		});

		Mousetrap.bind(['ctrl++','ctrl+='],function(){
			var v = parseInt($('#size_setter').val());
			$('#size_setter').val((5+v)).change();

		})


		Mousetrap.bind('shift',function(){

			switch(app.state){
				case 'mainWindow':
					if($('body.sidemenu_open').length){
						$('body').removeClass('sidemenu_open')
						$('#genres_box .genre.khover').removeClass('khover')
					}
					else
						$('body').addClass('sidemenu_open')
				break;
			}

		})

		Mousetrap.bind(['enter','space'],function(){
			switch(app.state){
				case 'mainWindow':
					if($('body.sidemenu_open').length){
						$('#genres_box .genre.khover').click()
					}
					else
						$('#movies_catalog .khover').click();
				break;

				case 'tvshow':

					var khover = $('#slider_tvshow .khover');
					if(khover.length){
						if(khover.hasClass('season')){
							$('#slider_tvshow .khover').first().click();
							$('#slider_tvshow .khover').removeClass('khover');
							setTimeout(function(){
								var firstEpsiode = $('#slider_tvshow .episode.activated').addClass('khover');
							},50)
						}
						else{
							if(ui.tv.session.episode_id==khover.data('episode_id'))
								$('#slider_tvshow .watch-btn').click();
							else
								khover.click();
						}

						return;
					}

				break;

				case 'movie':
					$('#slider_movie .watch-btn').click();
				break;

				case 'vpn_alert':
					$('#vpn_alert button').click();
				break;

				case 'vpn_page':
					$('#slider_vpn .vpn_button').click();
				break;
			}
		})

		Mousetrap.bind(['f5'],function(){location.reload();})

		Mousetrap.bind('v',function(){
			switch(app.state){

				case 'tvshow':
					var episode = $('#slider_tvshow .episode.khover');
					if(episode.length)
						episode.children('.pseudo_click_listener').click();
				break

			}
		})

		Mousetrap.bind(['f','insert'],function(){
			switch(app.state){

				case 'movie':
					$('#slider_movie .fav-btn').click();
				break

				case 'mainWindow':
					$('#movies_catalog .khover .fav-btn').click()
				break;

			}
		})

		Mousetrap.bind('q',function(){
			switch(app.state){

				case 'movie':
					var next_quality = $('#slider_movie .quality_selector.activated').next('.enabled');
					if(next_quality.length){
						next_quality.click();
					}
					else
						$('#slider_movie .quality_selector.enabled').first().click();

				break

			}
		})

		Mousetrap.bind('t',function(){
			switch(app.state){

				case 'movie':
					if($('#slider_movie .trailer').is(':visible'))
						$('#slider_movie .trailer').click();
				break

			}
		})

		Mousetrap.bind('b',function(){
			switch(app.state){

				case 'mainWindow':
					$('#menu_panel .favs').click();
				break

			}
		})

	},

};
