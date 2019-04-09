// js per caricare la pagina del singolo dottore

var doctor_fullname;
var doctor_image;
var doctor_description;
var description_speciality;
var doctor_timetable;
var doctor_contact;
var services_responsible;
var doctor_services;
var doctor_location;
var doctor_id;
var doctor_list;
var location_name;
var location_description;
var location_address;
var location_number;
var location_email;
var location_orario;
var service_name;
var location_corretta = [];


$(window).ready(function() {

  console.log("Doctor id: " + URL.id);

  doctor_fullname = $("#doctor_fullname");
  doctor_description = $("#doctor_description");
  doctor_services = $("#doctor_services");
  doctor_image = $("#doctor_image");
  doctor_list = $("#doctor_list");
  doctor_location = $("#doctor_location");
  description_speciality = $("#description_speciality");
  location_address = $("#location_address");
  location_number = $("#location_number");
  location_email = $("#location_email");
  location_name = $(".location_name");
  location_description = $("#location_description");
  location_orario = $("#location_orario");
  doctor_contact = $("#doctor_contact");
  doctor_timetable = $("#doctor_timetable");
  service_name = $("#service_name");


  // Prima ajax per ottenere dentro response solo il doctor con id=URL.id
  $.ajax({
    method: "GET",
    dataType: "json",
    crossDomain: true,
    url: "/doctor/" + URL.id,
    contentType: false,
    data: {
      "id": URL.id
    },
    success: function(response) {
      console.log(response);

      DoctorReceived(response);

    },
    error: function(request, error) {
      console.log(request + ":" + error);
    }
  });
});



function DoctorReceived(response) {

  var valore_corretto = 0;
  doctor_fullname.text(response[valore_corretto].firstname + " " + response[valore_corretto].lastname);
  doctor_description.html(response[valore_corretto].description);
  doctor_image.attr("src", response[valore_corretto].image);
  doctor_location.text(response[valore_corretto].location);
  description_speciality.html(response[valore_corretto].description_speciality);
  doctor_contact.html(response[valore_corretto].contact);
  doctor_timetable.html(response[valore_corretto].clinic_timetable);

  var el1 = "";
  var el2 = "";

  // Ajax per ottenere la tabella collegamenti tra doctors e location
  $.ajax({
    method: "GET",
    dataType: "json",
    crossDomain: true,
    url: "/doctors_location/"+URL.id,
    data: {
      id: response[valore_corretto].id
    },
    success: function(response7) {
      console.log(response7);

      // Ciclo per ottenere un array contenente gli id delle location relative allo specifico dottore
      for (var k = 0; k < response7.length; k++) {
          location_corretta.push(response7[k].id_location);
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
      for (var z = 0; z < location_corretta.length; z++) {
        for (var j = 0; j < response1.length; j++) {
          if (location_corretta[z] == response1[j].id) {

            // caricamento dinamico di tutti i dati delle location realtive allo specifico dottore
            el2 += '' + response1[j].name + '; ';

            el1 += '<div class="row"><div class="col-md-5"><iframe class="mappa" src="' + response1[j].mappagoogle + '"></iframe></div><div class="col-md-7"><h3 class="no-margin no-padding"><b>' + response1[j].name + '</b></h3><ul><li><b>Address: </b><i>' + response1[j].Address + '</i></li><li><b>Number: </b><i>' + response1[j].Number + '</i></li><li><b>E-mail: </b><i>' + response1[j].Email + '</i></li><li><b>Opening Hours: <br></b> <i>' + response1[j].Orario + '</i></li></ul><div id="bottonelocation"><a href="hyp-location.html?id=' + response1[j].id + '"><button class = "btn btn-lg btn-primary" type = "button"><i class = "fa fa-location-arrow"></i> Location Page </button></a></div></div><div class="clearfix"></div></div><hr class margin-bottom-40>';
          }
          $("#locationdottore").html(el1);
          $(".location_name").html(el2);
        }
      }
    },
    error: function(request, error) {
      console.log(request + ":" + error);
    }
  });

  var el3 = "";
  var el4 = "";

  // Ajax per ottenere la tabella dei service
  $.ajax({
    method: "GET",
    dataType: "json",
    crossDomain: true,
    url: "/service/",
    data: {
      id: response[valore_corretto].services
    },
    success: function(response2) {
      console.log(response2);

      // Ciclo per andare a prendere dalla response dei services i servizi relativi allo specifico dottore
      for (var i = 0; i < response2.length; i++) {
        // Controllo per vedere se il servizio del dottore è uguale all'id della response dei servizi
        if (response[valore_corretto].services == response2[i].id) {
          // Controllo se il dottore è responsabile di un servizio o solo lavoratore. Se il dottore non è responsabile, services_responsible == -1
          if (response[valore_corretto].services_responsible == -1) {
            el3 += 'Working service:';
            el4 += '<a href="hyp-healthservices.html?id= '+ response2[i].id+'" id="sottolineamelo" class="h5"> ' + response2[i].name + ' ;</a>';
          } else {
            el3 += 'Responsible of:';
            el4 += '<a href="hyp-healthservices.html?id= '+ response2[i].id+'" id="sottolineamelo" class="h5"> ' + response2[i].name + ' ;</a>';
          }
        }
        $("#servicetag").html(el3);
        $("#servicedottore").html(el4);
      }
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
