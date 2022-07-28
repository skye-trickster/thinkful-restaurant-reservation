const knex = require("../db/connection");

/**
 * List all reservations unrestricted
 */
async function list() {
	return knex("reservations").select("*");
}

/**
 * List all reservations by a specific date.
 * Ordered by reservation time.
 */
async function listByDate(reservation_date) {
	return knex("reservations")
		.select("*")
		.where({ reservation_date })
		.andWhereNot({ status: "finished" })
		.orderBy("reservation_time");
}

/**
 * Find reservations by ID
 */
async function find(reservation_id) {
	return knex("reservations").select("*").where({ reservation_id }).first();
}

/**
 * Adds reservation to database
 */
async function create(reservation) {
	return knex("reservations")
		.insert(reservation)
		.returning("*")
		.then((createdReservation) => createdReservation[0]);
}

function updateStatus(reservation_id, status) {
	return knex("reservations")
		.update({ status })
		.where({ reservation_id })
		.returning("*")
		.then((updatedReservations) => updatedReservations[0]);
}

module.exports = {
	list,
	listByDate,
	find,
	create,
	updateStatus,
};
