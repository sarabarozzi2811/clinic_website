// /* eslint-env browser */
// console.log("# Starting up the application");
//
// function clearTable() {
//   $("#myrows").find("tr").remove();
// }
//
// function addRow(doctor) {
//   console.log("Adding row");
//   $("#myrows").append(
//     `
//     <tr>
//        <td>${doctor.id}</td>
//        <td>${doctor.firstname}</td>
//        <td>${doctor.lastname}</td>
//        <td>${doctor.description}</td>
//        <td>${doctor.image}</td>
//        <td>${doctor.services}</td>
//
// <td>${doctor.description_speciality}</td>
//        <td>${doctor.contact}</td>
//        <td>${doctor.services_responsible}</td>
//        <td>${doctor.clinic_timetable}</td>
//     </ tr>
// `
//   );
// }
//
//
// /*elimina da qua!! */
// function addRow(location) {
//     console.log("Adding row");
//   $("#myrows").append(
//     `
//     <tr>
//        <td>${location.id}</td>
//        <td>${location.name}</td>
//        <td>${location.image}</td>
//        <td>${location.description}</td>
//        <td>${location.mappagoogle}</td>
//
//   <td>${location.Address}</td>
//        <td>${location.Number}</td>
//        <td>${location.Email}</td>
//        <td>${location.Orario}</td>
//     </ tr>
// `
//   );
// }
//
// function addRow(service) {
//     console.log("Adding row");
//   $("#myrows").append(
//     `
//     <tr>
//        <td>${service.id}</td>
//        <td>${service.name}</td>
//        <td>${service.description}</td>
//        <td>${service.avvertene}</td>
//        <td>${service.doctor_responsible}</td>
//
//     </ tr>
// `
//   );
// }
//
// function addRow(doctors_location) {
//     console.log("Adding row");
//   $("#myrows").append(
//     `
//     <tr>
//        <td>${doctors_location.id_dottore}</td>
//        <td>${doctors_location.id_location}</td>
//     </ tr>
// `
//   );
// }
//
// function addRow(service_doctor) {
//     console.log("Adding row");
//   $("#myrows").append(
//     `
//     <tr>
//        <td>${service_doctor.id_service}</td>
//        <td>${service_doctor.id_dottore}</td>
//     </ tr>
// `
//   );
// }
//
// function addRow(service_location) {
//     console.log("Adding row");
//   $("#myrows").append(
//     `
//     <tr>
//        <td>${service_location.id_service}</td>
//        <td>${service_location.id_location}</td>
//     </ tr>
// `
//   );
// }
//
//
//
// window.showResponse = showResponse;
//
// function formDataAsJSON(formData) {
//   let x = {};
//   for (var pair of formData.entries()) {
//     x[pair[0]] = pair[1];
//   }
//   return JSON.stringify(x);
// }
//
//
// let start = 0;
// let count = 1;
// let sortby = "none"; /* Can be none, "+age", "-age"*/
