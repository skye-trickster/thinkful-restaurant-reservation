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
		return createReservation(reservation, abortController.signal)
			.then(() =>
				history.push(`/dashboard?date=${reservation.reservation_date}`)
			)
			.catch(setFormError)
			.finally(() => abortController.abort);
	};

	return (
		<main>
			<h1>New Reservation</h1>
			<ErrorAlert error={formError} />
			<ReservationForm
				cancelFunction={cancel}
				submitFunction={create}
				setErrorFunction={setFormError}
			/>
		</main>
	);
}

export default NewReservation;
