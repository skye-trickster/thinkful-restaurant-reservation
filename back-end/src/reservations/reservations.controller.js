const service = require("./reservations.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function createReservation(request, response, next) {
	const { data } = request.body;

	if (!data) {
		return next({
			status: 400,
			message: `Missing reservation data.`,
		});
	}

	response.locals.reservation = data;
	next();
}

function parameterExists(parameter) {
	return function (request, response, next) {
		const { reservation } = response.locals;
		const value = reservation[parameter];

		if (value === undefined || value === null) {
			return next({
				status: 400,
				message: `Missing parameter: ${parameter}`,
			});
		}

		return next();
	};
}

function isEmptyString(parameter) {
	return function (request, response, next) {
		const { reservation } = response.locals;
		const value = reservation[parameter];

		if (value === "") {
			return next({
				status: 400,
				message: `Empty string: ${parameter}`,
			});
		}

		return next();
	};
}

function checkPersonMinimum(request, response, next) {
	const { people } = response.locals.reservation;

	if (typeof people !== "number" || people <= 1) {
		return next({
			status: 400,
			message: "Number of people must be at least 1.",
		});
	}

	next();
}

function checkValidDate(request, response, next) {
	const { reservation_date } = response.locals.reservation;

	if (reservation_date && new Date(reservation_date) > 0) {
		return next();
	}

	next({
		status: 400,
		message: "reservation_date is not a valid date.",
	});
}

function checkValidTime(request, response, next) {
	const { reservation_time, reservation_date } = response.locals.reservation;

	let timeCheck = new Date(`${reservation_date} ${reservation_time}`);
	if (reservation_time && timeCheck > 0) {
		return next();
	}

	next({
		status: 400,
		message: "reservation_time is not a valid time.",
	});
}

/**
 * Validate all parameters for creation
 */
const checkParameters = [
	parameterExists("first_name"),
	isEmptyString("first_name"),
	parameterExists("last_name"),
	isEmptyString("last_name"),
	parameterExists("mobile_number"),
	isEmptyString("mobile_number"),
	parameterExists("reservation_date"),
	checkValidDate,
	parameterExists("reservation_time"),
	checkValidTime,
	parameterExists("people"),
	checkPersonMinimum,
];

async function create(request, response) {
	const reservation = await service.create(response.locals.reservation);
	response.status(201).json({ data: reservation });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
	let { date } = req.query;

	if (date) {
		return res.json({ data: await service.listByDate(date) });
	}

	res.json({
		data: await service.list(),
	});
}

async function reservationExists(request, response, next) {
	const reservation = await service.find(request.params.reservationId);

	if (reservation) {
		response.locals.reservation = reservation;
		return next();
	}

	next({
		status: 404,
		message: `Reservation ID ${request.params.reservationId} cannot be found.`,
	});
}

function read(request, response) {
	response.json({ data: response.locals.reservation });
}

module.exports = {
	list,
	create: [
		createReservation,
		checkParameters,
		checkPersonMinimum,
		asyncErrorBoundary(create),
	],
	read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
};
