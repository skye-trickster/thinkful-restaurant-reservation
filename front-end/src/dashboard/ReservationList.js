import React from "react";
import formatReservationTime from "../utils/format-reservation-time";
import formatReservationDate from "../utils/format-reservation-date";

function ReservationList({ reservations }) {
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
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

export default ReservationList;
