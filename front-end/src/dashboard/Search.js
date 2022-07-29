import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "./ReservationList";

import { listReservations } from "../utils/api";

function Search() {
	const [reservations, setReservations] = useState(null);
	const [reservationsError, setReservationsError] = useState(null);
	const [phoneNumber, setPhoneNumber] = useState("");

	function searchNumber(event) {
		event.preventDefault();
		const abortController = new AbortController();
		setReservationsError(null);
		listReservations({ mobile_number: phoneNumber }, abortController.signal)
			.then(setReservations)
			.catch(setReservationsError);

		return () => abortController.abort();
	}

	function updateNumber(event) {
		setPhoneNumber(event.target.value);
	}

	return (
		<main>
			<form onSubmit={searchNumber}>
				<input
					name="mobile_number"
					onChange={updateNumber}
					value={phoneNumber}
					type="text"
					placeholder="Enter a customer's phone number"
				/>
				<button type="submit">Find</button>
			</form>
			<ErrorAlert error={reservationsError} />
			{reservations &&
				(reservations.length ? (
					<ReservationList reservations={reservations} />
				) : (
					<div>No reservations found</div>
				))}
		</main>
	);
}

export default Search;
