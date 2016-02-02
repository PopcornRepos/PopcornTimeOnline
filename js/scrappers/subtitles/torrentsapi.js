fetcher.scrappers.torrentsapi_subs = function(movie_id, season, episode, callback){

    var
    baseUrl	= 'http://butter.vodo.net/popcorn?imdb=' + movie_id.replace('tt','').replace(/^0+/,'') + '&s=' + season + '&e=' + episode;

    $.get(baseUrl, function(json){

		try{

			json = jQuery.type( json ) === "string"? JSON.parse(json): json;
			var subs = json.subs || false;

			if(subs){
				var subs_list = [];
				for(var i in subs){

					var
					lang_code	= i || 'xx',
					lang_name	= locale.iso2lang[i] ? locale.iso2lang[i]  : i.capitalize()
					most_rated = [];


					if(subs[i] instanceof Array){
						for(var x=0;x<subs[i].length;x++)
							if(!most_rated[1] || subs[i][x].rating>most_rated[1]){

								most_rated = [[

									subs[i][x].url,
									lang_code,
									lang_name.capitalize()

								], subs[i][x].rating];
							}

						subs_list.push(most_rated[0]);
					}

				}

				callback(subs_list);
			}
			else
				callback(false);


		}
		catch(e){
			console.log(e.message)
			callback(false);
			logger.log('error_scrap_torrentsapi_' + movie_id)
		}

	},'json')

};
fetcher.scrappers.torrentsapi_subs_movie = function(movie_id, callback){

   var
      baseUrl	= 'hhttp://butter.vodo.net/popcorn?imdb=' + movie_id.replace('tt','').replace(/^0+/,'');

   $.get(baseUrl, function(json){

      try{

         json = jQuery.type( json ) === "string"? JSON.parse(json): json;
         var subs = json.subs || false;

         if(subs){
            var subs_list = [];
            for(var i in subs){

               var
                  lang_code	= i || 'xx',
                  lang_name	= locale.iso2lang[i] ? locale.iso2lang[i]  : i.capitalize()
               most_rated = [];


               if(subs[i] instanceof Array){
                  for(var x=0;x<subs[i].length;x++)
                     if(!most_rated[1] || subs[i][x].rating>most_rated[1]){

                        most_rated = [[

                           subs[i][x].url,
                           lang_code,
                           lang_name.capitalize()

                        ], subs[i][x].rating];
                     }

                  subs_list.push(most_rated[0]);
               }

            }

            callback(subs_list);
         }
         else
            callback(false);


      }
      catch(e){
         console.log(e.message)
         callback(false);
         logger.log('error_scrap_torrentsapi_' + movie_id)
      }

   },'json')

}
