import React, { useState } from "react";
import { useHistory } from "react-router";

import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation() {
	const [formError, setFormError] = useState(null);

	const history = useHistory();

	const cancel = () => {
		history.goBack();
	};

	const create = (reservation) => {
		const abortController = new AbortController();
		//setFormError(null);
		try {
			checkFutureDay(reservation);
			checkOpenDay(reservation);
			checkOpenTime(reservation);
			checkFutureTime(reservation);
			return createReservation(reservation, abortController.signal)
				.then(() =>
					history.push(`/dashboard?date=${reservation.reservation_date}`)
				)
				.catch(setFormError)
				.finally(() => abortController.abort);
		} catch (error) {
			setFormError(error);
		}
	};

	const checkFutureDay = ({ reservation_date }) => {
		if (new Date(reservation_date) < new Date(new Date().toLocaleDateString()))
			throw new Error("Requested Date must be set in the future!");
	};

	const checkOpenDay = ({ reservation_date }) => {
		const date = new Date(reservation_date);

		if (date.getUTCDay() === 2)
			throw new Error("Restaurant is closed on Tuesdays!");
	};

	const checkOpenTime = ({ reservation_time, reservation_date }) => {
		const requestedTime = new Date(`${reservation_date} ${reservation_time}`);
		const firstReservation = new Date(`${reservation_date} 10:30`);
		const lastReservation = new Date(`${reservation_date} 21:30`);

		if (requestedTime > firstReservation && requestedTime < lastReservation)
			return;

		throw new Error("Restaurant is closed during requested time.");
	};

	const checkFutureTime = ({ reservation_time, reservation_date }) => {
		const requestedTime = new Date(`${reservation_date} ${reservation_time}`);
		if (requestedTime < Date.now())
			throw new Error("Requested date must be set in the future.");
	};

	return (
		<main>
			<h1>New Reservation</h1>
			<ErrorAlert error={formError} />
			<ReservationForm cancelFunction={cancel} submitFunction={create} />
		</main>
	);
}

export default NewReservation;
