// js per caricare nel menu i nomi delle locationi e dei services

var service_name;
var service_image;
var service_description;
var service_avvertenze;
var service_doctors;
var service_responsible;
var doctor_fullname;
var service_location;
var location_name;


$(window).ready(function() {

  console.log("service id: " + URL.id);

  service_name = $("#service_name");
  service_description = $("#service_description");
  service_avvertenze = $("#service_avvertenze");
  service_doctors = $("#service_doctors");
  service_responsible = $("#service_responsible");
  service_location = $("#service_location");
  location_name = $("#location_name");


  var el = "";

  // Ajax per ottenere la response di tutti i service
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

      // Ciclo per andare a caricare tutti i nomi dei service dentro il menu
      for (var i = 0; i < response.length; i++) {

        el += '<a href="hyp-healthservices.html?id=' + response[i].id + '">' + response[i].name + '</a>';

      }
      $(".servicelistmenu").html(el);
    },
    error: function(request, error) {
      console.log(request + ":" + error);
    }
  });

  var el2 = "";

  // Ajax per ottenere la response di tutte le location
  $.ajax({
    method: "GET",
    dataType: "json",
    crossDomain: true,
    url: "/location/",
    data: {
      id: URL.id
    },
    success: function(response) {
      console.log(response);

      // Ciclo per andare a caricare tutti i nomi delle location dentro il menu
      for (var i = 0; i < response.length; i++) {

        el2 += '<a href="hyp-location.html?id=' + response[i].id + '">' + response[i].name + '</a>';

      }
      $(".locationlistmenu").html(el2);
    },
    error: function(request, error) {
      console.log(request + ":" + error);
    }
  });
});
