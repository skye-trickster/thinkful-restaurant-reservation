import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";

import ReservationForm from "./ReservationForm";
import { editReservation, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservation() {
	const { reservation_id } = useRouteMatch().params;
	const [reservation, setReservation] = useState(null);
	const [formError, setFormError] = useState(null);

	const history = useHistory();

	useEffect(() => {
		const abortController = new AbortController();
		readReservation(Number(reservation_id), abortController.signal).then(
			setReservation
		);
	}, [reservation_id]);

	const cancel = () => {
		history.goBack();
	};

	const create = (reservation) => {
		const abortController = new AbortController();
		return editReservation(reservation, abortController.signal)
			.then(() =>
				history.push(`/dashboard?date=${reservation.reservation_date}`)
			)
			.catch(setFormError)
			.finally(() => abortController.abort);
	};

	return (
		<main>
			<h1>Edit Reservation</h1>
			<ErrorAlert error={formError} />
			{reservation && (
				<ReservationForm
					cancelFunction={cancel}
					submitFunction={create}
					setErrorFunction={setFormError}
					data={reservation}
				/>
			)}
		</main>
	);
}

export default EditReservation;
