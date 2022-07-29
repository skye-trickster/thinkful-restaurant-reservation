import React from "react";
import formatReservationTime from "../utils/format-reservation-time";
import formatReservationDate from "../utils/format-reservation-date";
import { reservation_status } from "../utils/api";

function ReservationList({ reservations, refreshFunction }) {
	function cancelReservation(event, { reservation_id }) {
		event.preventDefault();
		if (
			window.confirm(
				"Do you want to cancel this reservation? This cannot be undone."
			)
		) {
			const abortController = new AbortController();
			reservation_status(
				reservation_id,
				"cancelled",
				abortController.signal
			).then(refreshFunction);
			return () => abortController.abort();
		}
	}

	return (
		<table className="w-100">
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Phone</th>
					<th>Date</th>
					<th>Time</th>
					<th>People</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{reservations.map((reservation) => {
					formatReservationDate(reservation);
					formatReservationTime(reservation);
					return (
						<tr key={reservation.reservation_id}>
							<td>{reservation.reservation_id}</td>
							<td>{`${reservation.first_name} ${reservation.last_name}`}</td>
							<td>{reservation.mobile_number}</td>
							<td>{reservation.reservation_date}</td>
							<td>{reservation.reservation_time}</td>
							<td>{reservation.people}</td>
							<td data-reservation-id-status={reservation.reservation_id}>
								{reservation.status}
							</td>
							{reservation.status === "booked" && (
								<td>
									<a
										href={`/reservations/${reservation.reservation_id}/seat`}
										className="btn btn-primary"
										role="button"
									>
										Seat
									</a>
								</td>
							)}
							<td>
								<a
									href={`/reservations/${reservation.reservation_id}/edit`}
									className="btn btn-primary"
									role="button"
								>
									Edit
								</a>
							</td>
							<td>
								<button
									onClick={(event) => cancelReservation(event, reservation)}
									role="button"
									className="btn btn-danger"
									data-reservation-id-cancel={reservation.reservation_id}
								>
									Cancel
								</button>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

export default ReservationList;
