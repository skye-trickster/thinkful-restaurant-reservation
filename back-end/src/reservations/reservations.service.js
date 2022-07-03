const knex = require("../db/connection")

async function list() {
    return knex("reservations")
        .select("*")
        .returning((reservations) => console.log(reservations))
}

module.exports = {
    list
}