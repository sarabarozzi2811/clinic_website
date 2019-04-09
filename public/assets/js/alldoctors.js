// js per caricare la pagina contenente tutti i dottori

var doctor_fullname;
var doctor_image;
var doctor_description;
var description_speciality;
var clinic_timetable;
var contact;
var services_responsible;
var doctor_services;
var doctor_location;
var doctor_id;
var doctor_list;
var location_name;
var location_description;



$(window).ready(function() {

  doctor_fullname = $("#doctor_fullname");
  doctor_image = $("#doctor_image");
  doctor_description = $("#doctor_description");
  doctor_services = $("#doctor_services");
  doctor_list = $("#doctor_list");
  doctor_location = $("doctor_location");
  services_responsible = $("services_responsible");
  description_speciality = $("description_speciality");

  var el = "";

  // Ajax per ottenere tutto l'elenco dei dottori
  $.ajax({
    method: "GET",
    dataType: "json",
    crossDomain: true,
    url: "/doctor/",
    data: {
      id: URL.id
    },
    success: function(response) {
      console.log(response);

      // ordinamento dei dottori in ordine alfabetico di lastname
      sortResults(response, 'lastname', true);

      for (var i = 0; i < response.length; i++) {

        // caricamento dinamico della "form" di ogni dottore
        el += '<div class="blog-post-body row margin-top-15" id="blogpostbody"><div class="col-md-4 col-xs-4 colexclamation"><img class="margin-bottom-20" id="docimagebottom" src="' + response[i].image + '" alt="thumb1"></div> <div class="col-md-7 col-xs-8"><h3 class="margin-bottom-10"><strong>' + response[i].firstname + " " + response[i].lastname + '</strong></h3><ul class="animate fadeInRight animated"><li><strong>Specialized in</strong>:' + response[i].description_speciality + '</li><li><strong>Contacts</strong>:' + response[i].contact +
          '</li></ul><a href="hyp-docpage.html?id=' + response[i].id + '" class="btn btn-primary">Go to the personal page<i class="icon-chevron-right readmore-icon"></i> </a></div></div>';
      }
      $(".blog-docbyloc").html(el);
    },
    error: function(request, error) {
      console.log(request + ":" + error);
    }
  });
});


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
