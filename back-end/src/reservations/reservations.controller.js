const crypto = require("crypto");
const reservations = require("../data/reservations-data");
const service = require("./reservations.service")

// Use this function to assigh ID's when necessary
const nextId = function() {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {

  console.log(await service.list())

  res.json({
    data: reservations,
  });
}

async function create(request, response) {
  const { data } = request.body

  const newReservation = {
    ...data,
    id: nextId()
  }

  reservations.push(newReservation);

  response.status(201).json({ data: newReservation });
}

module.exports = {
  list,
  create: [
    create
  ]
};
