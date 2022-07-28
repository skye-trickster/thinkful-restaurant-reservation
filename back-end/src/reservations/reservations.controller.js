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

	if (typeof people !== "number" || people < 1) {
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

function checkOpenDay(request, response, next) {
	const { reservation_date } = response.locals.reservation;
	const date = new Date(reservation_date);

	if (date.getUTCDay() === 2)
		return next({
			status: 400,
			message: "Restaurant is closed on Tuesdays.",
		});

	next();
}

function checkFutureDay(request, response, next) {
	const { reservation_date } = response.locals.reservation;

	// comparing dates only, removing local times
	if (new Date(reservation_date) < new Date(new Date().toLocaleDateString()))
		return next({
			status: 400,
			message: "Requested date must be set in the future.",
		});
	next();
}

function checkValidTime(request, response, next) {
	const { reservation_time, reservation_date } = response.locals.reservation;

	let timeCheck = new Date(`${reservation_date} ${reservation_time}`);
	if (reservation_time && timeCheck > 0) {
		return next();
	}

	next({
		status: 400,
		message: "Requested Time is not a valid time.",
	});
}

function checkOpenTime(request, response, next) {
	const { reservation_time, reservation_date } = response.locals.reservation;
	const requestedTime = new Date(`${reservation_date} ${reservation_time}`);
	const firstReservation = new Date(`${reservation_date} 10:30`);
	const lastReservation = new Date(`${reservation_date} 21:30`);

	if (requestedTime > firstReservation && requestedTime < lastReservation)
		return next();

	return next({
		status: 400,
		message: "Restaurant is closed during requested time.",
	});
}

function checkFutureTime(request, response, next) {
	const { reservation_time, reservation_date } = response.locals.reservation;
	const requestedTime = new Date(`${reservation_date} ${reservation_time}`);
	if (requestedTime < Date.now())
		return next({
			status: 400,
			message: "Requested date must be set in the future.",
		});
	next();
}

function checkStatus(request, response, next) {
	const { status } = response.locals.reservation;

	if (status && status !== "booked") {
		return next({
			status: 400,
			message: "status cannot be seated or finished.",
		});
	}

	next();
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
	checkOpenDay,
	checkFutureDay,
	parameterExists("reservation_time"),
	checkValidTime,
	checkOpenTime,
	checkFutureTime,
	parameterExists("people"),
	checkPersonMinimum,
	checkStatus,
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

/// PUT /reservations/:reservation_id/status

function statusExists(request, response, next) {
	const { data } = request.body;
	if (!data || !data.status) {
		return next({
			status: 400,
			message: `Missing status`,
		});
	}
	response.locals.status = data.status;

	next();
}

function validStatus(request, response, next) {
	const { reservation, status } = response.locals;

	if (status !== "finished" && status !== "booked" && status !== "seated") {
		return next({
			status: 400,
			message: `Invalid status ${status}`,
		});
	}

	if (reservation.status === "finished") {
		return next({
			status: 400,
			message: `A finished reservation cannot be updated.`,
		});
	}

	next();
}

async function updateStatus(request, response) {
	const {
		reservation: { reservation_id },
		status,
	} = response.locals;

	const updatedReservation = await service.updateStatus(reservation_id, status);

	response.json({ data: updatedReservation });
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
	updateStatus: [
		asyncErrorBoundary(reservationExists),
		statusExists,
		validStatus,
		asyncErrorBoundary(updateStatus),
	],
};
