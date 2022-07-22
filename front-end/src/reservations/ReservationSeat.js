import React, { useEffect, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, seatTable } from "../utils/api";

function ReservationSeat() {
	const { reservation_id } = useRouteMatch().params;
	const history = useHistory();
	const [tables, setTables] = useState([]);
	const [reservation, setReservation] = useState(null);
	const [formError, setFormError] = useState(null);

	const [seat, setSeat] = useState("");

	useEffect(() => {
		const abortController = new AbortController();
		listTables(abortController.signal).then((tableList) => {
			setTables(tableList);
		});

		return () => {
			abortController.abort();
		};
	}, []);

	useEffect(() => {
		if (tables && tables.length) setSeat(String(tables[0].table_id));
	}, [tables]);

	useEffect(() => {
		const abortController = new AbortController();
		readReservation(Number(reservation_id), abortController.signal).then(
			setReservation
		);
	}, [reservation_id]);

	const cancelHandler = () => {
		history.push("/");
	};

	const submitHandler = (event) => {
		event.preventDefault();
		const checkCapacity = (table) => {
			if (table.capacity < reservation.people)
				throw new Error(
					`Table ${table.table_name} does not have enough capcity to fit ${reservation.people} people.`
				);
		};
		try {
			if (!reservation) throw new Error("Invalid Reservation ID!");
			const table = tables.find(
				({ table_id }) => Number(table_id) === Number(seat)
			);
			checkCapacity(table);
			const abortController = new AbortController();
			seatTable(
				reservation.reservation_id,
				table.table_id,
				abortController.signal
			)
				.then(() => {
					history.push("/dashboard");
				})
				.catch(setFormError);
			return () => abortController.abort();
		} catch (error) {
			setFormError(error);
		}
	};

	const updateSeating = (event) => {
		setSeat(event.target.value);
	};

	return (
		<main>
			<h2>Seat Reservation for ID: {reservation_id} </h2>
			<ErrorAlert error={formError} />
			<form onSubmit={submitHandler}>
				<select
					onChange={updateSeating}
					id={"table_id"}
					name={"table_id"}
					aria-label={"table_id"}
				>
					{tables.map((table) => {
						return (
							<option key={table.table_id} value={table.table_name}>
								{table.table_name} - {table.capacity}
							</option>
						);
					})}
				</select>

				<div>
					<button type="submit">Submit</button>
					<button type="button" onClick={cancelHandler}>
						Cancel
					</button>
				</div>
			</form>
		</main>
	);
}

export default ReservationSeat;
