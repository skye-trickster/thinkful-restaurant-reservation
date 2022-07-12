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
		setFormError(null);
		try {
			checkValidDate(reservation);
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

	const checkValidDate = (reservation) => {
		setFormError(null);
		if (new Date(reservation.reservation_date) < Date.now())
			throw new Error("Requested Date must be set in the future.");
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
