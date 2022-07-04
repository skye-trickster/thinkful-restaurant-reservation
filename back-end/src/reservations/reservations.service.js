const knex = require("../db/connection");

async function list() {
  return knex("reservations").select("*");
}

async function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .then((reservations) => reservations[0]);
}

module.exports = {
  list,
  read,
};
