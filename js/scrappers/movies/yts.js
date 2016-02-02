fetcher.scrappers.yts = function(genre, keywords, page, callback){



		var url = 'http://yts.to/api/list.json?genre=' + genre + '&sort=seeds&limit=50&set=' + ui.home.catalog.page;

        if (keywords) {
            url += '&keywords=' + keywords;
        }

        if (genre) {
            url += '&genre=' + genre;
        }

        if (page && page.toString().match(/\d+/)) {
           url += '&set=' + page;
        }



		$.ajax({
			url: url,
			dataType:'json',
			timeout:8000,
			error:function(){callback(false)},
			success:function(data){
				var movies = [],
					memory = {};

				if (data.error || typeof data.MovieList === 'undefined') {
					callback(false)
					return;
				}

				data.MovieList.forEach(function (movie){
					// No imdb, no movie.
					if( typeof movie.ImdbCode != 'string' || movie.ImdbCode.replace('tt', '') == '' ){ return;}


					var torrent = {

							"type": 0,
							"torrent_url": movie.TorrentUrl,
							"torrent_seeds": movie.TorrentSeeds,
							"torrent_peers": movie.TorrentPeers,
							"file": false,
							"quality": movie.Quality,
							"language": "",
							"subtitles": "",
							"size_bytes": movie.SizeByte,
							"id": movie.TorrentHash

					}


					if(memory[ movie.ImdbCode ]){

						memory[ movie.ImdbCode ].torrents.push(torrent)


					}
					else{

						memory[ movie.ImdbCode ] = {


								id:       	movie.ImdbCode,
								imdb:       movie.ImdbCode,
								title:      movie.MovieTitleClean,
								year:       movie.MovieYear ? movie.MovieYear : '&nbsp;',
								runtime:    "",
								synopsis:   "",
								voteAverage:parseFloat(movie.MovieRating),

								poster_small:	movie.CoverImage,
								poster_big:   	movie.CoverImage.replace('_med','_large'),
								image: 	 	    movie.CoverImage,
								bigImage:   	movie.CoverImage.replace('_med','_large'),

								quality:    movie.Quality,
								torrents:   [torrent],

								seeders:    movie.TorrentSeeds,
								leechers:   movie.TorrentPeers,
								trailer:	false,
								stars:		utils.movie.rateToStars(parseFloat(movie.MovieRating)),

						}


					}


				});

				for(var i in memory)
					movies.push(memory[i])

				callback(movies)
			},
		});

}
