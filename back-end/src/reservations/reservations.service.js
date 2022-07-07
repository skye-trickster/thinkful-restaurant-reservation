const knex = require("../db/connection");

async function list() {
	return knex("reservations").select("*");
}

async function find(reservation_id) {
	return knex("reservations").select("*").where({ reservation_id }).first();
}

async function create(reservation) {
	return knex("reservations")
		.insert(reservation)
		.returning("*")
		.then((createdReservation) => createdReservation[0]);
}

module.exports = {
	list,
	find,
	create,
};
