import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

import { createTable } from "../utils/api";

function NewTable() {
	const [table, setTable] = useState({
		table_name: "",
		capacity: "",
	});
	const [formError, setFormError] = useState(null);
	const history = useHistory();

	function updateData(event) {
		setTable({
			...table,
			[event.target.name]: event.target.value,
		});
	}

	function submitHandler(event) {
		event.preventDefault();
		table.capacity = parseInt(table.capacity);
		const create = (table) => {
			const abortController = new AbortController();
			try {
				return createTable(table, abortController.signal)
					.then(() => history.push(`/dashboard`))
					.catch(setFormError)
					.finally(() => abortController.abort);
			} catch (error) {
				setFormError(error);
			}
		};

		create(table);
	}

	function cancelHandler(event) {
		event.preventDefault();
		history.goBack();
	}

	return (
		<main>
			<h2>New Table</h2>
			<ErrorAlert error={formError} />
			<form onSubmit={submitHandler}>
				<label htmlFor="table_name" className="d-flex justify-content-between">
					<span>Table Name:</span>
					<input
						name="table_name"
						onChange={updateData}
						value={table.table_name}
						placeholder="Table 1"
						type="text"
						minLength={2}
						required
					/>
				</label>

				<label htmlFor="capacity" className="d-flex justify-content-between">
					<span>Max Capacity: </span>
					<input
						name="capacity"
						type="number"
						onChange={updateData}
						value={table.capacity}
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
		</main>
	);
}

export default NewTable;
