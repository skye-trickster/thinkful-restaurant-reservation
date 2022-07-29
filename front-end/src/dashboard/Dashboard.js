import React, { useEffect, useState } from "react";
import useQuery from "../utils/useQuery";
import { previous, next } from "../utils/date-time";
import { finishSeating, listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import { useHistory } from "react-router-dom";
import ReservationList from "./ReservationList";

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

		return loadTables(abortController);
	}

	function loadTables(abortController = null) {
		if (!abortController) abortController = new AbortController();
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

	function finishTable(table) {
		if (
			window.confirm(
				"Is this table ready to seat new guests? This cannot be undone."
			)
		) {
			const abortController = new AbortController();
			return finishSeating(table.table_id, abortController.signal)
				.then(() => loadDashboard())
				.catch(setTablesError);
		}
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
			<ReservationList reservations={reservations} />
			<div className="mt-2">
				<h2 className="text-center">Tables</h2>
				<ErrorAlert error={tablesError} />
				<table className="w-100">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Capacity</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{tables.map((table) => {
							return (
								<tr key={table.table_id}>
									<td>{table.table_id}</td>
									<td>{table.table_name}</td>
									<td>{table.capacity}</td>
									<td data-table-id-status={table.table_id}>
										{table.reservation_id === null ? "Free" : "Occupied"}
									</td>
									{table.reservation_id === null ? undefined : (
										<td>
											<button
												onClick={() => finishTable(table)}
												className="btn btn-primary"
												data-table-id-finish={table.table_id}
											>
												Finish
											</button>
										</td>
									)}
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
