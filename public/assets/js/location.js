// js per caricare la pagina della singola location

var location_name;
var location_description;
var location_services;
var location_image;
var location_id;
var location_doctors;
var service_name;
var service_description;
var location_map;
var location_address;
var location_email;
var location_orario;
var location_number;
var service_corretto = [];

$(window).ready(function() {

  console.log("Location id: " + URL.id);

  location_name = $("#location_name");
  location_description = $("#location_description");
  location_services = $("#location_services");
  location_image = $("#location_image");
  location_map = $("#location_map");
  location_address = $("#location_address");
  location_email = $("#location_email");
  location_orario = $("#location_orario");
  location_number = $("#location_number");


  // Prima ajax per ottenere dentro response solo la location con id=URL.id
  $.ajax({
    method: "GET",
    dataType: "json",
    crossDomain: true,
    url: "/location/" + URL.id,
    data: {
      id: URL.id
    },
    success: function(response) {
      console.log(response);

      var valore_corretto = 0; //utilizzato per poter selezionare l'elemento 0 (che è anche l'unico) dell'array delle response
      location_name.text(response[valore_corretto].name);
      location_description.html(response[valore_corretto].description);
      location_image.attr("src", response[valore_corretto].image);
      location_map.attr("src", response[valore_corretto].mappagoogle);
      location_address.text(response[valore_corretto].Address);
      location_email.text(response[valore_corretto].Email);
      location_orario.html(response[valore_corretto].Orario);
      location_number.text(response[valore_corretto].Number);

      // split della stringa "image" che contiene i path delle immagini delle diverse location
      var image_split = response[valore_corretto].image.toString();
      var res_image = image_split.split(",");
      var el_image = "";

      // ciclo per andare a caricare dentro il carousel ogni immmagine
      for (var k = 0; k < res_image.length; k++) {

        if (k == 0) {
          el_image += '<div class="item active" id="doctor_image"><img src="' + res_image[k] + '"></div>'
        } else {
          el_image += '<div class="item" id="doctor_image"><img src="' + res_image[k] + '"></div>';
        }
      }
      $("#carousel_location").html(el_image);

      // Ajax per ottenere la tabella collegamenti tra service e location
      $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: "/location_service/" + URL.id,
        data: {
          id: response[valore_corretto].id
        },
        success: function(response7) {
          console.log(response7);

          // Ciclo per ottenere un array contenente gli id dei servizi relativ alla specifica location
          for (var k = 0; k < response7.length; k++) {
            // Se dalla response dei collegamenti l'id_location == id della location della pagina (url.id), salva in un array uno o più id dei servizi relativi a quella location
              service_corretto.push(response7[k].id_service);
          }
        },
        error: function(request, error) {
          console.log(request + ":" + error);
        }
      });

      var el3 = "";

      // Ajax per ottenere la tabella dei service
      $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: "/service/",
        data: {
          id: response[valore_corretto].services
        },
        success: function(response1) {
          console.log(response[valore_corretto]);

          // Doppio ciclo per andare a prendere dalla response dei servizi i dati delle "service_corretto"
          for (var j = 0; j < service_corretto.length; j++) {
            for (var k = 0; k < response1.length; k++) {
              if (service_corretto[j] == response1[k].id) {

                // caricamento dinamico di tutti i dati dei servizi relativi alla specifica location
                el3 += '<li> <i class="fa fa-chevron-right color-gray-lighter"></i>  <a id="sottolineamelo" style="color: grey;" href="hyp-healthservices.html?id=' + response1[k].id + '  ">' + response1[k].name + ' </a> </li>                                 ';
              }
              $("#elencoservizilocation").html(el3);
            }
          }
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
