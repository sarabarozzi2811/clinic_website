// js per caricare la pagina del singolo service

var service_name;
var service_image;
var service_description;
var service_avvertenze;
var service_doctors;
var service_responsible;
var doctor_fullname;
var service_location;
var location_corretta = [];
var dottori_corretti = [];


$(window).ready(function() {

  console.log("service id: " + URL.id);

  service_name = $("#service_name");
  service_description = $("#service_description");
  service_avvertenze = $("#service_avvertenze");
  service_doctors = $("#service_doctors");
  service_responsible = $("#service_responsible");
  service_location = $("#service_location");


  // Prima ajax per ottenere dentro response solo il servizio con id=URL.id
  $.ajax({
    method: "GET",
    dataType: "json",
    crossDomain: true,
    url: "/service/" + URL.id,
    data: {
      id: URL.id
    },
    success: function(response) {
      console.log(response);

      var valore_corretto = 0; //utilizzato per poter selezionare l'elemento 0 (che è anche l'unico) dell'array delle response
      service_name.text(response[valore_corretto].name);
      service_description.html(response[valore_corretto].description);
      service_avvertenze.html(response[valore_corretto].avvertenze);

      var el1 = "";
      var el2 = "";

      // Ajax per ottenere la tabella collegamenti tra service e location
      $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: "/service_location/" + URL.id,
        data: {
          id: response[valore_corretto].id
        },
        success: function(response7) {
          console.log(response7);

          // Ciclo per ottenere un array contenente gli id delle location relative allo specifico servizio
          for (var k = 0; k < response7.length; k++) {
              location_corretta.push(response7[k].id_location);
          }
        },
        error: function(request, error) {
          console.log(request + ":" + error);
        }
      });

      // Ajax per ottenere la tabella collegamenti tra service e doctors
      $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: "/service_doctor/" + URL.id,
        data: {
          id: response[valore_corretto].id
        },
        success: function(response77) {
          console.log(response77);

          // Ciclo per ottenere un array contenente gli id dei dottori relativ allo specifico servizio
          for (var k = 0; k < response77.length; k++) {
              dottori_corretti.push(response77[k].id_dottore);
          }
        },
        error: function(request, error) {
          console.log(request + ":" + error);
        }
      });

      // Ajax per ottenere la tabella delle location
      $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: "/location/",
        data: {
          id: response[valore_corretto].location
        },
        success: function(response1) {
          console.log(response1);

          // Doppio ciclo per andare a prendere dalla response delle location i dati delle "location_corretta"
          for (var k = 0; k < location_corretta.length; k++) {
            for (var j = 0; j < response1.length; j++) {
              if (location_corretta[k] == response1[j].id) {

                // caricamento dinamico di tutti i dati delle location realtive allo specifico servizio
                el2 += '' + response1[j].name + '; ';

                el1 += '<div class="row"><div class="col-md-5"><iframe class="mappa" src="' + response1[j].mappagoogle + '"></iframe></div><div class="col-md-7"><h3 class="no-margin no-padding"><b>' + response1[j].name + '</b></h3><ul><li><b>Address: </b><i>' + response1[j].Address + '</i></li><li><b>Number: </b><i>' + response1[j].Number + '</i></li><li><b>E-mail: </b><i>' + response1[j].Email + '</i></li><li><b>Opening Hours: <br></b> <i>' + response1[j].Orario + '</i></li></ul><div id="bottonelocation"><a href="hyp-location.html?id=' + response1[j].id + '"><button class = "btn btn-lg btn-primary" type = "button"><i class = "fa fa-location-arrow"></i> Location Page </button></a></div></div><div class="clearfix"></div></div><hr class margin-bottom-40>';
              }
              $("#locationdottoreservice").html(el1);
              $(".location_name").html(el2);
            }
          }
        },
        error: function(request, error) {
          console.log(request + ":" + error);
        }
      });

      var el5 = "";
      var elbottone = "";

      // Ajax per ottenere la tabella dei dottori
      $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: "/doctor/",
        data: {
          id: response[valore_corretto].doctors
        },
        success: function(response3) {
          console.log(response3);

          // Ordinamento della response in ordine alfabetico per lastname
          sortResults(response3, 'lastname', true);

          // Doppio ciclo per andare a prendere dalla response dei dottori i dati dei "dottori_corretti"
          for (var j = 0; j < response3.length; j++) {
            for (var k = 0; k < dottori_corretti.length; k++) {
              if (dottori_corretti[k] == response3[j].id) {

                // caricamento dinamico di tutti i dati dei dottori realtive allo specifico servizio
                service_responsible.text(response3[j].firstname + " " + response3[j].lastname);
                elbottone = '<a href="hyp-docpage.html?id=' + response3[j].id + '" class="btn btn-primary">Go to the personal page<i class="icon-chevron-right readmore-icon"></i> </a>';

                el5 += '<div class="blog-post-body row margin-top-15" id="blogpostbody"><div class="col-md-4 col-xs-4 collistadottore"><img class="margin-bottom-20" id="docimagebottom" src="' + response3[j].image + '" alt="thumb1"></div> <div class="col-md-7"><h3 class="margin-bottom-10"><strong>' + response3[j].firstname + " " + response3[j].lastname + '</strong></h3><ul class="animate fadeInRight animated"><li><strong>Specialized in</strong>:' + response3[j].description_speciality + '</li><li><strong>Contacts</strong>:' + response3[j].contact +
                  '</li></ul><a href="hyp-docpage.html?id=' + response3[j].id + '" class="btn btn-primary">Go to the personal page<i class="icon-chevron-right readmore-icon"></i> </a></div></div>';

              }
            }
            $("#bottoneresponsabile").html(elbottone);
            $("#robo_dottori").html(el5);
          }
        },
        error: function(request, error) {
          console.log(request + ":" + error);
        }
      });
    },
  });


  var el3 = "";

  // Ajax per caricare tutti i servizi presenti nel database
  $.ajax({
    method: "GET",
    dataType: "json",
    crossDomain: true,
    url: "/service/",
    data: {
      id: URL.id
    },
    success: function(response) {
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        console.log(response[i]);

        el3 += '<li> <i class="fa fa-chevron-right color-gray-lighter"></i>  <a id="sottolineamelo" style="color: grey;" href="hyp-healthservices.html?id=' + response[i].id + '  ">' + response[i].name + ' </a> </li>                                 ';

      }
      $("#elencoservizi").html(el3);

    },
    error: function(request, error) {
      console.log(request + ":" + error);
    }
  });

});



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
