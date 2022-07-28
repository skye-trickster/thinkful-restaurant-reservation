const knex = require("../db/connection");

async function list() {
	return knex("tables").select("*").orderBy("table_name");
}

async function find(table_id) {
	return knex("tables").select("*").where({ table_id }).first();
}

async function create(table) {
	return knex("tables")
		.insert(table)
		.returning("*")
		.then((createdTable) => createdTable[0]);
}

async function find_reservation(reservation_id) {
	return knex("reservations").select("*").where({ reservation_id }).first();
}

async function seat_table(table_id, reservation_id) {
	const updatedTables = await knex("tables")
		.update({ reservation_id })
		.where({ table_id })
		.returning("*");

	await knex("reservations")
		.update({ status: "seated" })
		.where({ reservation_id });

	return updatedTables[0];
}

async function stop_seating_table({ table_id, reservation_id }) {
	const updatedTables = await knex("tables")
		.update({ reservation_id: null })
		.where({ table_id })
		.returning("*");

	await knex("reservations")
		.update({ status: "finished" })
		.where({ reservation_id });

	return updatedTables[0];
}

module.exports = {
	list,
	find,
	create,
	find_reservation,
	seat_table,
	stop_seating_table,
};
