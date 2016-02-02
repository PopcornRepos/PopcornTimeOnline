var ui = {

	construct:function(){

		this.home.catalog.set_sizes();
		this.home.catalog.show();


		$('#titlebar_buttons div').click(function(){
			hostApp.sendWinAction($(this).attr('id'));
		})

		$('#toolbar .btn').click(function(){

			$('#header .activated').removeClass('activated');
			$(this).addClass('activated');

			$('#search_input').val('')
			$('#select_sortby option')[0].selected=true;
			ui.home.catalog.show();

		})



		for(var i=0;i<resource.genres.length;i++)
			$('<div class="genre" data-genre="' + resource.genres[i] + '" data-in-trans="'+resource.genres[i]+'">' + locale.translate(resource.genres[i]) + '</div>').appendTo('#genres_box');

		$('#genres_box .genre:nth-child(1)').addClass('activated');

		$('#toolbar_genres').hover(
			function(){
				setTimeout('ui.home.genres_box.on=1',1)
				ui.home.genres_box.show();


			},
			function(){
				ui.home.genres_box.on=0;
				ui.home.genres_box.hide();

			}
		);



		$('#genres_box .genre').click(function(){
			$('#genres_box .genre.activated').removeClass('activated')
			$(this).addClass('activated');
			$('#search_input').val('')
			ui.home.catalog.show();
		})

		$('#search_input').keydown(function(e){

			if(e.which==13 && $(this).val()){
				if($('#autocomplete .khover').length)
					$('#autocomplete .khover').click();
				else
					ui.home.catalog.show();
			}
			else if(e.which==40){

					var curr = $('#autocomplete .khover')
					$('#autocomplete .khover').removeClass('khover');

					var next = curr.length ? curr.next() : $('#autocomplete div').first();
					next.addClass('khover');

			}
			else if(e.which==38){
					var curr = $('#autocomplete .khover')
					$('#autocomplete .khover').removeClass('khover');

					var next = curr.length ? curr.prev() : $('#autocomplete div').last();
					next.addClass('khover');
			}

		}).
		focus(function(){
			$('#search_cont').addClass('activated');
		}).
		blur(function(){
			if($(this).val()=='')
				$('#search_cont').removeClass('activated');

			setTimeout(function(){$('#autocomplete').removeClass('visible')},300);
		}).
		keyup(function(e){

			if(e.which==27){
				$('#search_input').blur();
				$('#search_cont.activated').removeClass('activated')
				return;
			}

			if((e.which==8 || e.which==46) && $(this).val()==''){
				ui.home.catalog.show();
				return;
			}

			if((e.which>40 || e.which==8) && $(this).val().length>2 && $('#toolbar .btn.activated').data('section')=='movies'){
				if(window.autocompleteXhr && window.autocompleteXhr.abort)
					window.autocompleteXhr.abort();
					$('#autocomplete').html('').removeClass('visible')

				window.autocompleteXhr = $.get('http://yts.to/api/list.json?keywords=' + encodeURIComponent($(this).val()) +' &limit=5&sort=seeds',function(json){
					if(json.MovieList && json.MovieList.length){
						$('#autocomplete').html('').addClass('visible');
						var suggests = {}

						json.MovieList.forEach(function(movie){
							if(movie.MovieTitleClean){
								suggests[movie.MovieTitleClean] = movie.ImdbCode;
							}
						})

						for(var title in suggests){
							$('#autocomplete').append('<div onmouseover="$(this).addClass(\'khover\')" onmouseout="$(this).removeClass(\'khover\')" onclick="$(\'#search_input\').val(\'' + title.replace(/'/g,'') + '\');$(\'#search_input\').data(\'imdb\',\'' + suggests[title] + '\');ui.home.catalog.show()">' + title + '</div>')
						}
					}
				},'json')
			}
		});

		$('#search_cont .icon').click(function(){
			if($('#search_input').val()!='')
				ui.home.catalog.show();
		})


		$('#right_bar .icon.search').click(function(){ui.home.catalog.show()})


		$('body')
		.mousedown(function(e){
			ui.mouseDownClientX = e.clientX;
		})
		.mouseup(function(e){
			if(ui.home.catalog.section!='favs' && Math.abs(e.clientX - ui.mouseDownClientX) > 240)
				Mousetrap.trigger('shift')
		})
		.mousemove(function(e){
			if(e.clientX < 25 && e.clientY>60 && app.state == 'mainWindow' && !$('body.sidemenu_open').length){
				Mousetrap.trigger('shift')
			}
		});

		$('#side_menu').mouseleave(function(){Mousetrap.trigger('shift');})

		$('#mode_box span').click(function(){
			$('#mode_box span.activated').removeClass('activated')
			$(this).addClass('activated');

			app.config.fetcher.mode = $(this).html().toLowerCase();
		});

		$('#history_panel .caption').click(function(){
			if($('#history_panel')[0].style.bottom=='-105px')
				$('#history_panel').css({bottom:0})
			else
				$('#history_panel').css({bottom:'-105px'})
		});

		ui.loading_wrapper.init();

		$('#mode_box span').click(function(){

			app.config.fetcher.mode = $(this).data('mode');

			$('#mode_box .activated').removeClass('activated');
			$(this).addClass('activated');
			ui.home.catalog.show();
		})

		if(!app.config.hostApp.isVPN){
			$('.vpn').remove();
		}

	},

	home:{

		catalog:{
			items:{},
			set_sizes:function(scale){

				if(scale){
					app.config.set({ui:{coverScale: scale/100 + 1}});
				}

				var bw	= $('body').width();
				ui.home.catalog.numItemsInRow	= Math.floor(bw / (app.config.ui.coverWidth * app.config.ui.coverScale));
				ui.home.catalog.item_width 		= bw / ui.home.catalog.numItemsInRow - 1;
				ui.home.catalog.item_height 	= ui.home.catalog.item_width / 0.66;

				$('#movies_catalog .movie').css({width:ui.home.catalog.item_width+'px', height:ui.home.catalog.item_height+'px'});
				$('#movies_catalog .movie .title').css('font-size', app.config.ui.coverTiteSize * app.config.ui.coverScale);
				$('#movies_catalog .movie .year').css('font-size', app.config.ui.coverYearSize * app.config.ui.coverScale);
				$('#movies_catalog .movie .tools').css('font-size', app.config.ui.coverToolsSize * app.config.ui.coverScale);
				$('#movies_catalog .movie .stars').css('font-size', app.config.ui.coverStarsSize * app.config.ui.coverScale);

				$('#size_setter').val(Math.round((app.config.ui.coverScale-1)*100))

				if(ui.home.catalog.scroller)
					ui.home.catalog.scroller.refresh();
			},
			show:function(page){

				if(!page) {

					ui.home.catalog.items = {};
					ui.home.catalog.page=1;
				}
				else
					ui.home.catalog.page=page;



				ui.sliders.close_all();
				app.state = 'mainWindow';
				$('#history_panel').hide();

				var
				keywords	= $('#search_input').data('imdb') || $('#search_input').val(),
				genreEl 	= $('.genre.active'),
				genre 		= keywords ? 'all' : ($('#genres_box .genre.activated').data('genre') || 'all'),
				section		= $('#toolbar .btn.activated').data('section');

				$('#search_input').data('imdb','');

				if(!section){
					$('#header .activated').removeClass('activated');
					$('#toolbar .btn:nth(0)').addClass('activated');
					section = 'movies'

				}

				ui.home.catalog.section = section;
				fetcher.fetch.items(section, genre, keywords, function(err, items){

					if(err || !(items instanceof Array)){

						ui.home.catalog.noResult();
						logger.log(err);
					}
					else{

						if(!page){
							ui.home.catalog.clear();
							$('<div style="width:100%;height:65px;float:left"></div>').appendTo('#catalog_scroller');
						}

						for(var i=0;i<items.length;i++)
							ui.home.catalog.appendItem(items[i], section, i);


						$('#movies_catalog').bind('scroll', function() {
							if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight-400) {
								ui.home.catalog.show(++ui.home.catalog.page);
							}
						});


						ui.home.catalog.showUnloadedItems(ui.home.catalog.page);


						if(ui.home.catalog.scroller){
							ui.home.catalog.scroller.refresh();
						}
						else{
							ui.home.catalog.scroller = new IScroll('#movies_catalog',{
								mouseWheel: 	true,
								mouseWheelSpeed: 30,
								scrollbars:		true,
								hScrollbar:		false,
								vScrollbar:		true,
								click:			true,
								fadeScrollbars:	true,
								interactiveScrollbars:	true,
								resizeScrollbars:		true,
								shrinkScrollbars:		'scale'

							});

							ui.home.catalog.scroller.on('scrollEnd',function(){
								if(ui.home.catalog.section!='favs' && Math.abs(this.maxScrollY) - Math.abs(this.y) < 600 && ui.home.catalog.page){
									ui.home.catalog.show(++ui.home.catalog.page);
								}
							})


						}

						if(!page){
							ui.home.catalog.scroller.scrollTo(0,(keywords ? 0 : -65))
						}

					}

				});
			},

			appendItem:function(movie, section, i){


				movie.infavs = app.favs.list[movie.imdb] && 'infavs' || '';


				var
				tokens = {
					id:			movie.imdb,
					title:		movie.title,
					year:		movie.year,
					runtime:	movie.runtime,
					stars:		movie.stars,
					infavs:		movie.infavs,
					poster_img:	'<img src="' + movie.poster_small + '" onload="setTimeout(function(){$(\'#movie-'+movie.imdb + '\').css({opacity: 1,transform: \'scale(1, 1)\'})},1);$(\'#movie-'+movie.imdb + '\').removeClass(\'unloaded\')">',

					titleFontSize:	app.config.ui.coverTiteSize * app.config.ui.coverScale,
					yearFontSize:	app.config.ui.coverYearSize * app.config.ui.coverScale,
					toolsFontSize:	app.config.ui.coverToolsSize * app.config.ui.coverScale,
					starsFontSize:	app.config.ui.coverStarsSize * app.config.ui.coverScale

				},
				html = utils.tokenizer(tokens, document.getElementById('movie_cover_html').innerHTML);

				if(!ui.home.catalog.items[movie.imdb.toString()])
					ui.home.catalog.items[movie.imdb.toString()] = movie;


				$('<div data-section="'+section+'" data-movie_id="'+movie.imdb+'"  id="movie-'+movie.imdb+'" style="width:' + ui.home.catalog.item_width + 'px;height:' + ui.home.catalog.item_height + 'px;transition-delay: 0s, '+(i/23)+'s;" class="movie unloaded p' + ui.home.catalog.page + '">'+html+'</div>').appendTo('#catalog_scroller')
				.click(function(e){

					if($(e.target).attr('class').indexOf('-btn')==-1){
						ui[ $(this).data('section') ].show($(this).data('movie_id'))
					}

				})
				.mouseenter(function(){
					$('#movies_catalog .movie.khover').removeClass('khover');
					$(this).addClass('khover');
				});

			},

			showUnloadedItems:function(page){
				setTimeout(function(){
					//$('#movies_catalog .unloaded.p' + page + ' img').attr('src', 'css/images/poster.png');
					$('#movies_catalog .unloaded.p' + page).css({opacity:1,transform: "scale(1, 1)"}).removeClass('unloaded');
				},5000)
			},

			clear:function(){
				$('#catalog_scroller').html('');
				$('#catalog_scroller').sortable({ disabled: true });
			},

			noResult:function(){

				if(ui.home.catalog.page==1)
					$('#catalog_scroller').html('<div class="noResults">No results found...</div>');

				try{
					ui.home.catalog.scroller.scrollToElement($('#catalog_scroller .noResults')[0],null,null,true)
				}
				catch(e){}

				fetcher.scrappers.tv_idx=0;
				fetcher.scrappers.movies_idx=0;
			}

		},


	},

	about_page:{
		show:function(){

			if(ui.sliders.slider.about){
				ui.sliders.slider.about.hide();
				return;
			}

			app.state='aboutPage';

			var
			version = location.href.match(/version=([0-9\.]+)/),
			ver = (version && version[1] || '') + (location.href.match(/version=([0-9\.]+)a/) ? ' Alpha' : ''),
			html = utils.tokenizer({"version": ver}, $('#about_page_html').html()),
			slider = new ui.slider('about', 'fadein');

			slider.el.append(html);
			slider.destruct = function(){
				app.state = 'mainWindow';
			}

			slider.show();

		}
	},

	sliders:{
		slider:{},
		close_all:function(){

			for(var i in ui.sliders.slider)
				ui.sliders.slider[i].hide();
		}
	},
	slider:	function(id, position){

		if(ui.sliders[id]){

			return ui.sliders[id];

		}
		else{

			var
			positions = (function(){

				var pos = {
					"fadein": [{"top": "0"}, {"top": "0"}],
					"bottom": [{"top": "0"}, {"top": "200%"}],
					"right": [{"left": "0"}, {"left": "200%"}],
					"left": [{"left": "0"}, {"left": "-200%"}]
				}

				return position && pos[position] ? [pos[position],position] : [pos['fadein'], 'fadein'];

			})(),
			slider = $('<div id="slider_' + id + '" class="slider ' + positions[1] + '" data-id="' + id + '"><div class="close" onclick="ui.sliders.slider[\'' + id + '\'].hide()"></div></div>');


			slider.appendTo('body');
			ui.sliders.slider[id] = {
				el: slider,
				id:id,
				show: function(){
					var css = positions[0][0];
					css.opacity=1;
					setTimeout(function(){slider.css(css)},1);
				},
				hide: function(){
					var css = positions[0][1];
					css.opacity=0;
					slider.fadeOut(function(){$(this).remove()})


					if(typeof this.destruct == 'function')
						this.destruct();


					delete ui.sliders.slider[id];
				}
			}

		}

		return ui.sliders.slider[id];

	},

	torrent_report:{
		show:function(el){
			$(el).parents('.torrent_info').fadeOut('fast',function(){
				var report_div = $(this).next('.torrent_report');
				report_div.fadeIn('fast');

				setTimeout(function(){ui.torrent_report.hide(report_div)},5000)

			});
		},
		hide:function(el){
			if(!el.length)
				return;

			el.fadeOut('fast',function(){
				$(this).prev('.torrent_info').fadeIn('fast');

			});
		},
		send:function(el, vote_id){

			var
			torrent_option 	= $(el).parents('.torrent_option'),
			id 				= torrent_option.data('id');

			torrent_option.fadeOut('fast',function(){
				utils.msgbox('<span style="font-size:16px;">Hasta la vista, Torrent</span>')
				$(this).remove();
				$('.slider .torrents .torrent_option:first-child').addClass('activated')
			});


			//(new Image).src="http://butter.vodo.net/popcorn?id="+id+"&v=" + vote_id;
			ga('send', 'pageview', '/reports/'+id+'/'+vote_id);

		}

	},
	trailer:{
		show:function(url){

			var slider = new ui.slider('trailer','fadein');
			slider.el.append('<div style="width:100%;height:calc(100% - 35px);margin-top:35px;box-sizing:border-box;overflow:hidden;"><iframe src="' + url + '" style="width:100%;height:100%;" frameborder="0" scrolling="0"></iframe></div>')
			slider.show()

		},
		close:function(){
			ui.sliders.slider.trailer.hide();
		}
	},
	events:{


		watch_btn_click:function(e){


			ui.loading_wrapper.show();

			var
			slider		= document.section.chosen[0].checked ? 'movie_slider' : 'tvshow_slider',
			torrent 	= $('#' + slider + ' .torrents_list').val().toString()!='0' ? $('#' + slider + ' .torrents_list').val().split(',') : $('#' + slider + ' .torrents_list option')[1].value.split(','),
			subtitles 	= $('#' + slider + ' .subtitles_list').val().toString()!='0' ? $('#' + slider + ' .subtitles_list').val() : null;

			app.torrent.get(torrent[0], torrent[1], subtitles);

		},

		window_resize:function(){
			ui.home.catalog.set_sizes();
		}

	},

	disableAnimations:function(e){
		$('body')[ e ? 'addClass' : 'removeClass']('disable_animations')
	},

	hideGlare:function(input){
		console.log(input.value)
		app.config.set({hostApp:{hideGlare:( input.checked ? 1:0 )}});
		$('body')[ ( input.checked ? 'addClass' : 'removeClass' ) ]('hideGlare');
	}

}
