function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class ="bgimg" src="' + streetviewUrl + '">');

    /*
      NYTIMES
      API Key for the Article Search API: 7d61a6720f1c464dbb2473ebb4823011
    */
    var nytimesURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+cityStr+'&sort=newest&api-key=7d61a6720f1c464dbb2473ebb4823011';

    $.getJSON(nytimesURL, function(data) {

      $nytHeaderElem.text('New York Times Articles about ' + cityStr);

      articles = data.response.docs;
      for (var i=0; i < articles.length; i++) {
        var article = articles[i];
        $nytElem.append('<li class="article">' +
          '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
          '<p>' + article.snippet + '</p>'+
        '</li>');
      };
    }).fail(function(e) {
      $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    $.getJSON();

    //error handling for wiki api
    var wikiRequestTimeout=setTimeout(function(){
        $wikiHeaderElem.text("failed to load wikipedia resources");
      },8000);
    //load wiki api
    var wikiUrL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+cityStr+'&format=json&callback=wikiCallback';

    $.ajax({
      url: wikiUrL,
      datatype: 'jsonp',
      //jsonp: callback
    }).done(function(response) {
        var articleList = response[1];
        
        for (var i=0; i < articleList.length; i++) {
          articleStr = articleList[i];
          var articleUrl = 'http://en.wikipedia.org/wiki/' + articleStr;
          $wikiElem.append('<li><a href="'+ articleUrl +'">' +
              articleStr +'</a></li>')
        };
        clearTimeout(wikiRequestTimeout); //clear the error if the Response is succussful
      });

  return false;
};

$('#form-container').submit(loadData);
