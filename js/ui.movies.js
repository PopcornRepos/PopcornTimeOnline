ui.movies = {

	session:{},

	show:function(movie_id){

		var data = ui.home.catalog.items[movie_id];

		if(!data){
			logger.log('error_missing_movie_catalog_id_' + movie_id)
			return;
		}

		var
		slider 				= this.slider(data),
		handlers 			= this.handlers[app.config.fetcher.mode];

		ui.movies.session = {
			id:		data.id,
			title:	data.title,
			info:	data.year,
			year:	data.year,
			image:	data.poster_big,
			section:'movies'
		}

		this.set_torrents(data);
		this.get_subs(data);
		this.construct(data);


		for(var func in handlers) {
         handlers[func](data);
      }

		slider.show();
		setTimeout(function(){app.state = 'movie';},100);;

	},

	slider: function(data){

		if($('.slider_' + data.id).length)
			return;

		ui.sliders.close_all();

		var
		slider_html = utils.tokenizer(data, $('#movie_slider_html').html());
		slider		= new ui.slider('movie', 'fadein'); //-------------------------

		slider.destruct = function(){
			app.state = 'mainWindow';
		}
		slider.el.append(slider_html).addClass('movie_' + data.id);


		return slider;

	},

	watch:function(e){
		Mousetrap.pause();
		torrentsTime.pt.setup.vpnShowed = false;
		app.torrent.get(this.session);

		var session = ui.movies.session;
		session.torrents = ui.home.catalog.items[ this.session.id ].torrents
		app.history.add([session]);

	},

	set_torrents:function(data){

		var torrent_selector 	= $('#slider_movie.movie_' + data.imdb + ' .torrent_selector .selector_cont');

		torrent_selector.html('');
		if(data.torrents instanceof Array && data.torrents.length){
			$('#slider_movie.movie_' + data.imdb + ' .watch-btn').show();
			data.torrents.forEach(function(torrent, i){

				if(i==0)
					ui.movies.session.torrent = {
						url: 	torrent.torrent_url,
                  magnet: torrent.torrent_magnet,
                  file:	torrent.file,
						quality: torrent.quality
					}


				$('<div class="item torrent ' + (i==0 ? 'activated':'') + ' ' + torrent.quality.toLowerCase() +'" data-idx="' + i + '" data-quality="' + torrent.quality.toLowerCase() + '"><div class="icon2 baterry ' + utils.calculateTorrentHealth(torrent.torrent_seeds, torrent.torrent_peers) + '"></div><div class="caption">' + torrent.torrent_seeds + '/' + torrent.torrent_peers + ' Peers</div></div>').appendTo(torrent_selector)
				.click(function(){
					$('.item.torrent.activated').removeClass('activated')
					$(this).addClass('activated');

					var torrent = ui.home.catalog.items[ui.movies.session.id].torrents[ parseInt($(this).data('idx')) ];

					ui.movies.session.torrent = {
						url: 	torrent.torrent_url,
                  magnet: torrent.torrent_magnet,
                  file:	torrent.file,
						quality: torrent.quality
					}

				});

			})

			$('#slider_movie .quality_selector').click(function(){
				if(!$(this).hasClass('enabled'))
					return

				$('#slider_movie .quality_selector.activated').removeClass('activated');
				$(this).addClass('activated');

				$('#slider_movie .torrent').removeClass('activated').hide();
				$('#slider_movie .torrent.' + $(this).data('quality')).show().first().click();

			})


			var
			firstTorrent = $('#slider_movie .torrent').first(),
			firstQuality = firstTorrent.data('quality');

			$('#slider_movie .quality_selector').each(function(){
				if($('#slider_movie .torrent.' + $(this).data('quality')).length)
					$(this).addClass('enabled');
			})

			$('#slider_movie .quality_selector.' + firstQuality).click();

		}
		else{
			torrent_selector.html('<div class="item"><div class="caption">No torrents</div></div>');
			$('#slider_movie.movie_' + data.imdb + ' .watch-btn').hide();
		}

	},

	get_subs:function(data){

		var subtitles_selector	= $('#slider_movie.movie_' + data.imdb + ' .subs_selector .selector_cont'),
		clearSubs 			= function(caption){
			subtitles_selector.html('<div class="item subtitle"><div class="icon2 lang"></div><div class="caption">' + (caption || locale.translate('subtitledIn')) + '</div></div>');
		};

		ui.movies.session.subtitles = [];
		clearSubs();

      fetcher.scrappers.ysubs(data.imdb,function(subs) {
         var subsList = [];
         for(var i = 0; i< subs.length; i++) {
            subsList.push(subs[i]);
         }

         fetcher.scrappers.torrentsapi_subs_movie(data.imdb, function(subs){

            for(var i = 0; i< subs.length; i++) {
               subsList.push(subs[i]);
            }

            if(!subsList instanceof Array || !subsList.length){
               clearSubs('No &nbsp;Subtitles');
               return;
            }


            ui.movies.session.subtitles = [];
            var insubs = {};
            clearSubs();

            for(var i=0;i<subsList.length;i++){

               if(!insubs[subsList[i][1]]){

                  insubs[subsList[i][1]] = true;
                  var selected = subsList[i][1] == app.config.locale.preferredSubs;

                  if(selected)
                     ui.movies.session.subtitles_locale = subsList[i][1];

                  $('<div data-locale="' + subsList[i][1] + '" class="item subtitle ' + (selected ? 'activated':'') + '"><div class="caption"><img src="css/images/flags/' + (resource.lang2code[subsList[i][1]] || 'xx') + '.png" class="flag" onload="this.style.visibility=\'visible\'">' + (locale.langs[subsList[i][1]] || subsList[i][2]) + '</div></div>')[(selected ? 'prependTo' : 'appendTo')](subtitles_selector)
                     .click(function(){
                        $('.item.subtitle.activated').removeClass('activated')
                        $(this).addClass('activated');
                        app.config.set({locale: {preferredSubs: $(this).data('locale')}});
                        ui.tv.session.subtitles_locale = $(this).data('locale');
                     });


                  ui.movies.session.subtitles.push(subsList[i]);
               }
            }
         })




      });
	},

	construct:function(data){

		$('#slider_movie.movie_' + data.id + ' .fav-btn').click(function(){app.favs.toggle(data.id)})

		if(data.trailer)
			$('#slider_movie.movie_' + data.id + ' .trailer').show().click(function(){ui.trailer.show(data.trailer)});

	},
   getTrailer: function(data) {
      ui.movies.infoXHR = $.get('http://api.themoviedb.org/3/movie/' + data.tmdb_id + '/videos?api_key=' + app.config.api_keys.tmdb,function(json){

         if(json  && json.results.length) {
            var trailer = json.results[0].key ? 'http://www.youtube.com/embed/' + json.results[0].key + '?autoplay=1': false;
            if(trailer)
               $('#slider_movie.movie_' + data.id + ' .trailer').show().click(function(){ui.trailer.show(trailer)});
            data.trailer = trailer;
            //trailer:	movie.trailer ? 'http://www.youtube.com/embed/' + movie.trailer + '?autoplay=1': false,
         }


      }, 'json');
   },

	handlers:{

		imdb:{

			get_movie_info:function(data){
				if(ui.movies.infoXHR && typeof ui.movies.infoXHR.abort == 'function')
					ui.movies.infoXHR.abort();


				var displayInfo = function(){
					$('.slider.movie_' + data.imdb + ' .synopsis').html(data.synopsis).addClass('fadein');
					$('.slider.movie_' + data.imdb + ' .title_info .runtime').html(data.runtime);
					$('.slider.movie_' + data.imdb + ' .title_info.genre').html(data.genre);
					$('.slider.movie_' + data.imdb + ' .title_info.stars').attr('title', data.voteAverage + ' / 10').click(function(){
						hostApp.openBrowser('http://www.imdb.com/title/' + data.imdb)
					}).children('span').css({cursor:"pointer"})

				}

				if(data.synopsis && data.runtime && data.genre)
					setTimeout(displayInfo,100);

				else{
					ui.movies.infoXHR = $.get('http://api.themoviedb.org/3/movie/' + data.imdb + '?api_key=' + app.config.api_keys.tmdb,function(json){

						if(json){
                     data.tmdb_id = json.id;
							data.synopsis = json.overview;
							data.runtime =  json.runtime + ' ' + locale.translate('durationUnit');
							data.genre = json.genres instanceof Array ? (json.genres[0] && json.genres[0].name || '') : '';
                     if(!data.trailer) {
                        ui.movies.getTrailer(data);
                     }
						}

						displayInfo();

					}, 'json');
				}


			},

			load_images:function(data){

				if(ui.movies.imgsXHR && typeof ui.movies.imgsXHR.abort == 'function')
					ui.movies.imgsXHR.abort();
				ui.movies.imgsXHR = $.get(app.config.api_keys.tmdb_url + 'movie/' +data.imdb + '/images?api_key=' + app.config.api_keys.tmdb,function(json){

					var poster_img = data.poster_big;

					if(typeof json == 'object'){

						if(json.posters){

							var gotFirstEnPoster = false;

							for(var i=0;i<json.posters.length;i++){

								if(json.posters[i].height>1080)

									if(json.posters[i].iso_639_1==locale.language){
										poster_img = app.config.api_keys.tmdb_src + 'w780/' + json.posters[i].file_path;
										break;
									}
									else if(!gotFirstEnPoster && json.posters[i].iso_639_1=='en'){
										poster_img = app.config.api_keys.tmdb_src + 'w780/' + json.posters[i].file_path;
										gotFirstEnPoster=true;
									}

							}

						}
                  if(json.videos) {
                     console.log(json.videos);
                  }


						var img = new Image
						img.onload = function(){
							clearTimeout(posterNotLoaded);
							$('#slider_movie.movie_' + data.id + ' .poster_img').attr('src',poster_img).addClass('fadein')
							setTimeout(load_backdrops,2222)

						}
						img.src = poster_img;

						var posterNotLoaded = setTimeout(function(){
							load_backdrops();
						},5000)



						var load_backdrops = function(){
							var backdrops = [];
							if(json.backdrops instanceof Array){

								var bd_handler = function(i){

									if(!$('.movie_' + data.id).length)
										return;

									if(i>=json.backdrops.length){
										i=0;
										if(!$('#slider_movie.movie_' + data.id + ' .backdrop_img').length)
											return;
									}

									var bd = json.backdrops[i];
									if(bd.width==1920){
										var
										src = app.config.api_keys.tmdb_src + 'w' + bd.width + bd.file_path,
										img = new Image;
										img.onload = function(){

											ui.movies.session.image = src.replace('w'+bd.width, 'w185');

											$('<div class="backdrop_img"><div class="img" style="background-image:url(' + src + ')">').appendTo('#slider_movie .backdrop');
											$('#slider_movie .backdrop_img.fadein').fadeOut('slow',function(){$(this).remove()});
											setTimeout(function(){
												$('#slider_movie .backdrop_img').last().addClass('fadein');
												setTimeout(function(){bd_handler(++i)},6750);
											},10)

										}
										img.src=src


									}
									else
										setTimeout(function(){bd_handler(++i)},500);

								}

								bd_handler(0);
							}
						}
					}

				},'json')

			},

			load_actors:function(data){

				return;


				if(ui.movies.actorsXHR && typeof ui.movies.actorsXHR.abort == 'function')
					ui.movies.actorsXHR.abort();


				var displayInfo = function(){

					for(var i=0; i<(data.actors.length<5 ? data.actors.length : 5); i++){
						$('#slider_movie.movie_' + data.id + ' .actors').append('<div class="actor"><img src="' + data.actors[i].img + '" onload="$(this).parent().fadeIn()"></div>')
					}


				}

				if(data.actors)
					setTimeout(displayInfo,100);
				else{

					ui.movies.actorsXHR = $.get(app.config.api_keys.tmdb_url + 'movie/' + data.imdb + '/credits?api_key=' + app.config.api_keys.tmdb,function(json){

						if(json && json.cast instanceof Array){
							var actors = [];
							for(var i=0; i<json.cast.length; i++){
								actors.push({name: json.cast[i].name, img: app.config.api_keys.tmdb_src + 'w185' + json.cast[i].profile_path});
							}

							data.actors = actors;
							displayInfo();
						}



					})

				}




			}

		},

		anime:{
			get_movie_info:function(data){

					$('.slider.movie_' + data.imdb + ' .synopsis').html(data.synopsis).addClass('fadein');
					$('.slider.movie_' + data.imdb + ' .title_info .runtime').html(data.runtime);
					$('.slider.movie_' + data.imdb + ' .title_info.genre').html(data.genre);

						var img = new Image
						img.onload = function(){
							$('#slider_movie.movie_' + data.id + ' .poster_img').attr('src',data.poster_big).addClass('fadein')
						}
						img.src = data.poster_big;

			},

		},

		cartoons:{

		}

	}

}
