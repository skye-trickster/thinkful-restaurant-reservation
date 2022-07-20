import React, { useEffect, useState } from "react";
import useQuery from "../utils/useQuery";
import { previous, next } from "../utils/date-time";
import formatReservationTime from "../utils/format-reservation-time";
import formatReservationDate from "../utils/format-reservation-date";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import { useHistory } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
	const [reservations, setReservations] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);

	const [tables, setTables] = useState([]);
	const [tablesError, setTablesError] = useState(null);

	// state variable to change the date dynamically instead of constantly loading the date
	const [currentDate, setDate] = useState(date);

	const history = useHistory();

	// query in case passed through a query
	const queryDate = useQuery().get("date");

	useEffect(
		function () {
			if (queryDate && currentDate !== queryDate) setDate(queryDate);
			else if (!queryDate) setDate(date);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[queryDate]
	);
	useEffect(loadDashboard, [currentDate]);

	function loadDashboard() {
		const abortController = new AbortController();
		setReservationsError(null);
		listReservations({ date: currentDate }, abortController.signal)
			.then(setReservations)
			.catch(setReservationsError);

		setTablesError(null);
		listTables(abortController.signal).then(setTables).catch(setTablesError);

		return () => abortController.abort();
	}

	function nextDate() {
		history.push(`/dashboard?date=${next(currentDate)}`);
	}

	function previousDate() {
		history.push(`/dashboard?date=${previous(currentDate)}`);
	}

	return (
		<main>
			<h1 className="text-center">Dashboard</h1>
			<div className="d-md-flex mb-3 justify-content-around">
				<button className="btn btn-primary" onClick={previousDate}>
					Previous
				</button>
				<h4 className="mb-0 text-center">Reservations for {currentDate}</h4>

				<button className="btn btn-primary" onClick={nextDate}>
					Next
				</button>
			</div>
			<ErrorAlert error={reservationsError} />
			<table className="w-100">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Phone</th>
						<th>Date</th>
						<th>Time</th>
						<th>People</th>
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
								<td>
									<a
										href={`/reservations/${reservation.reservation_id}/seat`}
										className="btn btn-primary"
										role="button"
									>
										Seat
									</a>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<div className="mt-2">
				<h2 className="text-center">Tables</h2>
				<table className="w-100">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Capacity</th>
							<th>Reservation</th>
						</tr>
					</thead>
					<tbody>
						<ErrorAlert error={tablesError} />
						{tables.map((table) => {
							return (
								<tr key={table.table_id}>
									<td>{table.table_id}</td>
									<td>{table.table_name}</td>
									<td>{table.capacity}</td>
									<td>{table.reservation_id}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</main>
	);
}

export default Dashboard;
