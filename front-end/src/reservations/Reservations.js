import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import NotFound from "../layout/NotFound";
import EditReservation from "./EditReservation";
import NewReservation from "./NewReservation";
import ReservationSeat from "./ReservationSeat";

function Reservations() {
	const route = useRouteMatch();

	return (
		<Switch>
			<Route path={`${route.url}/new`}>
				<NewReservation />
			</Route>
			<Route path={`${route.url}/:reservation_id/seat`}>
				<ReservationSeat />
			</Route>
			<Route path={`${route.url}/:reservation_id/edit`}>
				<EditReservation />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default Reservations;
