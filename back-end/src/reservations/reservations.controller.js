const crypto = require("crypto");
const reservations = require("../data/reservations-data");
const service = require("./reservations.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Use this function to assigh ID's when necessary
const nextId = function () {
  return crypto.randomBytes(16).toString("hex");
};

async function reservationExists(request, response, next) {
  const reservation = await service.find(request.params.reservationId);

  if (reservation) {
    response.locals.reservation = reservation;
    return next();
  }

  next({
    status: 404,
    message: "Reservation cannot be found",
  });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: await service.list(),
  });
}

async function create(request, response) {
  const data = request.body;

  console.log(request.body);

  const newReservation = {
    ...data,
    id: nextId(),
  };

  reservations.push(newReservation);

  response.status(201).json({ data: newReservation });
}

function read(request, response) {
  response.json({ data: response.locals.reservation });
}

module.exports = {
  list,
  create: [asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
};
