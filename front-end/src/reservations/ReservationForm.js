import React, { useState } from "react";

function ReservationForm({
	submitFunction,
	cancelFunction,
	data = {
		first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_date: "",
		reservation_time: "",
		people: "",
	},
}) {
	const [reservation, setReservation] = useState(data);

	function updateData(event) {
		setReservation({
			...reservation,
			[event.target.name]: event.target.value,
		});
	}

	function submitHandler(event) {
		event.preventDefault();
		reservation.people = parseInt(reservation.people);
		submitFunction(reservation);
	}

	function cancelHandler(event) {
		event.preventDefault();
		cancelFunction();
	}

	return (
		<form onSubmit={submitHandler}>
			<label htmlFor="first_name" className="d-flex justify-content-between">
				<span>First Name:</span>
				<input
					name="first_name"
					onChange={updateData}
					value={reservation.first_name}
					placeholder="John"
					type="text"
					required
				/>
			</label>

			<label htmlFor="last_name" className="d-flex justify-content-between">
				<span>Last Name:</span>
				<input
					name="last_name"
					onChange={updateData}
					value={reservation.last_name}
					placeholder="Doe"
					type="text"
					required
				/>
			</label>

			<label htmlFor="mobile_number" className="d-flex justify-content-between">
				<span>Mobile Number: </span>
				<input
					name="mobile_number"
					type="tel"
					onChange={updateData}
					value={reservation.mobile_number}
					placeholder="123-456-7890"
					pattern="([0-9]{3}-[0-9]{3}-[0-9]{4})|([0-9]{10})"
					required
				/>
			</label>

			<label
				htmlFor="reservation_date"
				className="d-flex justify-content-between"
			>
				<span>Date: </span>
				<input
					name="reservation_date"
					type="date"
					onChange={updateData}
					value={reservation.reservation_date}
					placeholder="YYYY-MM-DD"
					pattern="\d{4}-\d{2}-\d{2}"
					required
				/>
			</label>

			<label
				htmlFor="reservation_time"
				className="d-flex justify-content-between"
			>
				<span>Time: </span>
				<input
					name="reservation_time"
					type="time"
					onChange={updateData}
					value={reservation.reservation_time}
					placeholder="HH:MM"
					pattern="[0-9]{2}:[0-9]{2}"
					required
				/>
			</label>
			<label htmlFor="people" className="d-flex justify-content-between">
				<span>Number of People: </span>
				<input
					name="people"
					type="number"
					onChange={updateData}
					value={reservation.people}
					min="1"
				/>
			</label>
			<div className="d-flex justify-content-center">
				<button type="cancel" onClick={cancelHandler} className="mr-1">
					Cancel
				</button>
				<button type="submit" className="ml-1">
					Submit
				</button>
			</div>
		</form>
	);
}

export default ReservationForm;
