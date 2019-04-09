const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex");


// connessione in locale a sqlite3, su postgres per app heroku
if (process.env.TEST) {
  sqlDb = sqlDbFactory({
    client: "sqlite3",
    debug: true,
    connection: {
      filename: "./data_list.sqlite"
    }
  });
} else {
  sqlDb = sqlDbFactory({
    debug: true,
    client: "pg",
    connection: process.env.DATABASE_URL,
    ssl: true
  });
}

// inizializzazione dei diversi database
function initDb() {

  // DB doctor
  sqlDb.schema.hasTable("doctor").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("doctor", table => {
          table.increments();
          table.string("firstname");
          table.string("lastname");
          table.text("description");
          table.integer("services");
          table.text("image");
          table.text("description_speciality");
          table.text("clinic_timetable");
          table.text("contact");
          table.integer("services_responsible");
        })
        .then(() => {
          return Promise.all(
            _.map(doctorList, p => {
              delete p.id;
              return sqlDb("doctor").insert(p);
            })
          );
        });
    } else {
      return true;
    }
  })

  //DB location
  sqlDb.schema.hasTable("location").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("location", table => {
          table.increments();
          table.string("name");
          table.text("description");
          table.text("mappagoogle");
          table.text("image");
          table.string("Address");
          table.string("Number");
          table.string("Email");
          table.text("Orario");
        })
        .then(() => {
          return Promise.all(
            _.map(locationList, p => {
              delete p.id;
              return sqlDb("location").insert(p);
            })
          );
        });
    } else {
      return true;
    }
  })

  //DB service
  sqlDb.schema.hasTable("service").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("service", table => {
          table.increments();
          table.string("name");
          table.text("description");

          table.text("avvertenze");
          table.integer("doctor_responsible");

        })
        .then(() => {
          return Promise.all(
            _.map(serviceList, p => {
              delete p.id;
              return sqlDb("service").insert(p);
            })
          );
        });
    } else {
      return true;
    }
  })


  // DATABASE RELAZIONALI
  // DB collegamenti tra doctors e location
  sqlDb.schema.hasTable("doctors_location").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("doctors_location", table => {
          table.increments();
          table.integer("id_dottore");
          table.integer("id_location");
        })
        .then(() => {
          return Promise.all(
            _.map(doctorsLocationList, p => {
              delete p.id;
              return sqlDb("doctors_location").insert(p);
            })
          );
        });
    } else {
      return true;
    }
  })

  // DB collegamenti tra service e doctors
  sqlDb.schema.hasTable("service_doctor").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("service_doctor", table => {
          table.increments();
          table.integer("id_service");
          table.integer("id_dottore");
        })
        .then(() => {
          return Promise.all(
            _.map(serviceDoctorList, p => {
              delete p.id;
              return sqlDb("service_doctor").insert(p);
            })
          );
        });
    } else {
      return true;
    }
  })


  // DB collegamenti tra service e location
  sqlDb.schema.hasTable("service_location").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("service_location", table => {
          table.increments();
          table.integer("id_service");
          table.integer("id_location");
        })
        .then(() => {
          return Promise.all(
            _.map(serviceLocationList, p => {
              delete p.id;
              return sqlDb("service_location").insert(p);
            })
          );
        });
    } else {
      return true;
    }
  })

  // DB pagina who we are
  sqlDb.schema.hasTable("whoweare").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("whoweare", table => {
          table.increments();
          table.text("descrizione");
        })
        .then(() => {
          return Promise.all(
            _.map(whoweareList, p => {
              delete p.id;
              return sqlDb("whoweare").insert(p);
            })
          );
        });
    } else {
      return true;
    }
  });


}

const _ = require("lodash");

let serverPort = process.env.PORT || 5000;

let doctorList = require("./public/server/doctor/doctors_data.json");
let locationList = require("./public/server/location/location_data.json");
let serviceList = require("./public/server/service/service_data.json");
let doctorsLocationList = require("./public/server/doctors_location/doctors_location.json");
let serviceDoctorList = require("./public/server/service_doctor/service_doctor.json");
let serviceLocationList = require("./public/server/service_location/service_location.json");
let whoweareList = require("./public/server/whoweare/whoweare.json");



app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// /* Register REST entry point */


// /* REST per DB interi */

// REST per l'intero DB dei dottori
app.get("/doctor", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 20));
  let sortby = _.get(req, "query.sort", "none");
  let myQuery = sqlDb("doctor");

  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per l'intero DB delle location
app.get("/location", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 5));
  let sortby = _.get(req, "query.sort", "none");
  let myQuery = sqlDb("location");

  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per l'intero DB dei service
app.get("/service", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 5));
  let sortby = _.get(req, "query.sort", "none");
  let myQuery = sqlDb("service");

  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per l'intero DB relazionale doctors_location
app.get("/doctors_location", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 50));
  let sortby = _.get(req, "query.sort", "none");
  let myQuery = sqlDb("doctors_location");

  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per l'intero DB relazionale service_doctor
app.get("/service_doctor", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 50));
  let sortby = _.get(req, "query.sort", "none");
  let myQuery = sqlDb("service_doctor");

  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per l'intero DB relazionale service_location
app.get("/service_location", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 50));
  let sortby = _.get(req, "query.sort", "none");
  let myQuery = sqlDb("service_location");

  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per l'intero DB whoweare
app.get("/whoweare", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 20));
  let sortby = _.get(req, "query.sort", "none");
  let myQuery = sqlDb("whoweare");

  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});


// /* REST per elementi singoli del DB */

// REST per singolo valore di dottore
app.get("/doctor/:id", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 1));

  let docid = parseInt(req.params.id); // ???
  let myQuery = sqlDb("doctor").where("id", docid); // query per ritornare il singolo doctor
  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per singolo valore di location
app.get("/location/:id", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 1));

  let docid = parseInt(req.params.id);
  let myQuery = sqlDb("location").where("id", docid); // query per ritornare la singola location
  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per singolo valore di service
app.get("/service/:id", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 1));

  let docid = parseInt(req.params.id);
  let myQuery = sqlDb("service").where("id", docid); // query per ritornare il singolo service
  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});


// /* REST per multipli valori dei database relazionali */

// Abbiamo deciso di creare REST in entrambi i versi
// (eg doctors --> location / location --> doctors)
// anche se non tutte quante sono state utilizzate all'interno del sito

// REST per collegamenti doctors_location tramite id_dottore
app.get("/doctors_location/:id_dottore", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 100));

  let docid = parseInt(req.params.id_dottore);
  let myQuery = sqlDb("doctors_location").where("id_dottore", docid); // query per ritornare tutti i collegamenti tra doctor/location relativi a un id_dottore
  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per collegamenti location_doctors tramite id_location
app.get("/location_doctors/:id_location", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 100));

  let docid = parseInt(req.params.id_location);
  let myQuery = sqlDb("doctors_location").where("id_location", docid); // query per ritornare tutti i collegamenti tra doctor/location relativi a un id_dottore
  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per collegamenti location_doctors tramite id_location
app.get("/service_doctor/:id_service", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 100));

  let docid = parseInt(req.params.id_service);
  let myQuery = sqlDb("service_doctor").where("id_service", docid); // query per ritornare tutti i collegamenti tra service/doctor relativi a un id_service
  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per collegamenti doctor_service tramite id_doctor
app.get("/doctor_service/:id_doctor", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 100));

  let docid = parseInt(req.params.id_doctor);
  let myQuery = sqlDb("service_doctor").where("id_doctor", docid); // query per ritornare tutti i collegamenti tra service/doctor relativi a un id_dottore
  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per collegamenti service_location tramite id_service
app.get("/service_location/:id_service", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 100));

  let docid = parseInt(req.params.id_service);
  let myQuery = sqlDb("service_location").where("id_service", docid); // query per ritornare tutti i collegamenti tra service/location relativi a un id_service
  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// REST per collegamenti location_service tramite id_location
app.get("/location_service/:id_location", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 100));

  let docid = parseInt(req.params.id_location);
  let myQuery = sqlDb("service_location").where("id_location", docid); // query per ritornare tutti i collegamenti tra service/location relativi a un id_location
  myQuery.limit(limit).offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

app.set("port", serverPort);

initDb();

/* Start the server on port */
app.listen(serverPort, function() {
  console.log(`Your app is ready at port ${serverPort}`);
});
