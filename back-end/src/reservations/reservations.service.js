const knex = require("../db/connection");

/**
 * List all reservations unrestricted
 */
async function list() {
	return knex("reservations")
		.select("*")
		.whereNot({ status: "finished" })
		.andWhereNot({ status: "cancelled" });
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
		.andWhereNot({ status: "cancelled" })
		.orderBy("reservation_time");
}

async function listByNumber(mobile_number) {
	return knex("reservations")
		.select("*")
		.whereRaw(
			"translate(mobile_number, '() -', '') like ?",
			`%${mobile_number.replace(/\D/g, "")}%`
		)
		.orderBy("reservation_date");
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

function updateReservation(reservation_id, reservation) {
	return knex("reservations")
		.update(reservation)
		.where({ reservation_id })
		.returning("*")
		.then((updatedReservations) => updatedReservations[0]);
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
	listByNumber,
	find,
	create,
	updateStatus,
	updateReservation,
};
