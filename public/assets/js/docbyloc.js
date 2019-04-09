// js per il caricamento dei dottori in ordine di location

var dottore_corretto = [];

$(window).ready(function() {


  // Ajax per ottenere la tabella di tutte le location
  $.ajax({
    method: "GET",
    dataType: "json",
    crossDomain: true,
    url: "/location/",
    contentType: false,
    data: {
      id: URL.id
    },
    success: function(response) {
      console.log(response);

      LocationReceived(response);

    },
    error: function(request, error) {
      console.log(request + ":" + error);
    }
  });
});



function LocationReceived(response) {

  // Ajax per ottenere la tabella collegamenti tra doctors e location
  $.ajax({
    method: "GET",
    dataType: "json",
    crossDomain: true,
    url: "/doctors_location/",
    data: {
      id: response[1].id
    },
    success: function(response7) {
      console.log(response7);

      // Ajax per ottenere la tabella dei doctor
      $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: "/doctor/",
        data: {
          id: response[1].doctors
        },
        success: function(response2) {

          sortResults(response2, 'lastname', true);

          console.log(response2);
          var el3 = "";

          // Ciclo su tutte le location
          for (var z = 0; z < response.length; z++) {
            dottore_corretto = []; // Per ogni location questo array viene caricato con tutti gli id dei dottori della location speficica, e poi resettato a vuoto

            // Ciclo sulla tabella dei collegamenti e caricamento nell'array dottore_corretto degli id dei dottori relativi alla specifica location
            for (var k = 0; k < response7.length; k++) {
              if (response7[k].id_location == response[z].id) {
                dottore_corretto.push(response7[k].id_dottore);
              }
            }

            var cont = 0; // Contatore per segnare il primo dottore caricato

            // Doppio ciclo per andare a prendere dalla response di tutti i dottori, quelli il cui id si trova in dottore_corretto
              for (var k = 0; k < response2.length; k++) {
                for (var i = 0; i < dottore_corretto.length; i++) {


                if (dottore_corretto[i] == response2[k].id) {
                  var valore_corretto2 = k;
                  cont = cont + 1;

                  // Caricamento dinamico della "form" del dottore, se è il primo dell'array, carica anche nome della location e un <hr>
                  if (cont == 1) {
                    el3 += '<hr><div class="h2">' + response[z].name + '</div>                            <div class="blog-docbyloc">                                <div class="clearfix"></div><div class="blog-post-body row margin-top-15" id="blogpostbody"><div class="col-md-4 col-xs-4 colexclamation"><img class="margin-bottom-20" id="docimagebottom" src="' + response2[valore_corretto2].image + '" alt="thumb1"></div> <div class="col-md-7 col-xs-8"><h3 class="margin-bottom-10"><strong>' + response2[valore_corretto2].firstname + " " + response2[valore_corretto2].lastname + '</strong></h3><ul class="animate fadeInRight animated"><li><strong>Specialized in</strong>:' + response2[valore_corretto2].description_speciality + '</li><li><strong>Contacts</strong>:' + response2[valore_corretto2].contact +
                      '</li></ul><a href="hyp-docpage.html?id=' + response2[valore_corretto2].id + '" class="btn btn-primary">Go to the personal page<i class="icon-chevron-right readmore-icon"></i> </a></div></div></div>';
                  } else {
                    el3 += '<div class="blog-docbyloc">                               <div class="clearfix"></div><div class="blog-post-body row margin-top-15" id="blogpostbody"><div class="col-md-4 col-xs-4 colexclamation"><img class="margin-bottom-20" id="docimagebottom" src="' + response2[valore_corretto2].image + '" alt="thumb1"></div> <div class="col-md-7"><h3 class="margin-bottom-10"><strong>' + response2[valore_corretto2].firstname + " " + response2[valore_corretto2].lastname + '</strong></h3><ul class="animate fadeInRight animated"><li><strong>Specialized in</strong>:' + response2[valore_corretto2].description_speciality + '</li><li><strong>Contacts</strong>:' + response2[valore_corretto2].contact +
                      '</li></ul><a href="hyp-docpage.html?id=' + response2[valore_corretto2].id + '" class="btn btn-primary">Go to the personal page<i class="icon-chevron-right readmore-icon"></i> </a></div></div></div>';
                  }
                }
              }
            }
          }
          $("#listadoctorbyloc").html(el3);
        },
        error: function(request, error) {
          console.log(request + ":" + error);
        }
      });
    },
    error: function(request, error) {
      console.log(request + ":" + error);
    }
  });
}


var URL = function() {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();

// Funzione per ordinamento delle response
function sortResults(people, prop, asc) {
  people = people.sort(function(a, b) {
    if (asc) {
      return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
    } else {
      return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    }
  });
}
