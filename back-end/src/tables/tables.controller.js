const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// POST create function
function createTable(request, response, next) {
	const { data } = request.body;

	if (!data) {
		return next({
			status: 400,
			message: `Missing table data.`,
		});
	}

	response.locals.table = data;
	next();
}

function parameterExists(parameter) {
	return function (request, response, next) {
		const { table } = response.locals;
		const value = table[parameter];

		if (value === undefined || value === null) {
			return next({
				status: 400,
				message: `Missing parameter: ${parameter}`,
			});
		}

		return next();
	};
}

function checkName(request, response, next) {
	const { table_name } = response.locals.table;

	if (table_name.length < 2) {
		return next({
			status: 400,
			message: "table_name must have at least 2 characters.",
		});
	}

	next();
}

function checkCapacityMinimum(request, response, next) {
	const { capacity } = response.locals.table;

	if (typeof capacity !== "number" || capacity < 1) {
		return next({
			status: 400,
			message: "capacity must be a number and at least 1.",
		});
	}

	next();
}

const checkParameters = [
	parameterExists("table_name"),
	checkName,
	parameterExists("capacity"),
	checkCapacityMinimum,
];

async function create(request, response) {
	const { table } = response.locals;

	response.status(201).json({ data: await service.create(table) });
}

/// GET list
async function list(request, response) {
	response.json({ data: await service.list() });
}

// GET read functions

async function tableExists(request, response, next) {
	const { tableId } = request.params;

	const table = await service.find(tableId);

	if (table) {
		response.locals.table = table;
		return next();
	}

	next({
		status: 404,
		message: `Table ID ${tableId} cannot be found`,
	});
}

function read(request, response) {
	response.json({ data: response.locals.table });
}

// PUT Seat Reservation

async function seatingStart(request, response, next) {
	const { data } = request.body;

	if (
		!data ||
		data.reservation_id === undefined ||
		data.reservation_id === null
	) {
		return next({
			status: 400,
			message: `Missing reservation_id data.`,
		});
	}

	next();
}

async function reservationExists(request, response, next) {
	const reservation = await service.find_reservation(
		request.body.data.reservation_id
	);

	if (reservation) {
		response.locals.reservation = reservation;
		return next();
	}
	next({
		status: 404,
		message: `Reservation ID ${request.body.data.reservation_id} cannot be found.`,
	});
}

function validSeating(request, response, next) {
	const { table, reservation } = response.locals;

	if (table.reservation_id !== null) {
		return next({
			status: 400,
			message: "table is occupied",
		});
	}

	if (table.capacity < reservation.people)
		return next({
			status: 400,
			message: "capacity doesn't have enough people",
		});

	next();
}

async function seatTable(request, response, next) {
	const { table, reservation } = response.locals;

	const updatedTable = await service.seat_table(
		table.table_id,
		reservation.reservation_id
	);

	response.json({ data: updatedTable });
}

module.exports = {
	list: asyncErrorBoundary(list),
	create: [createTable, checkParameters, asyncErrorBoundary(create)],
	read: [asyncErrorBoundary(tableExists), read],
	seat: [
		asyncErrorBoundary(tableExists),
		asyncErrorBoundary(seatingStart),
		asyncErrorBoundary(reservationExists),
		validSeating,
		asyncErrorBoundary(seatTable),
	],
};
