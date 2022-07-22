import React from "react";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import NotFound from "../layout/NotFound";
import NewTable from "./NewTable";

function Tables() {
	const route = useRouteMatch();

	return (
		<Switch>
			<Route exact path={`${route.url}/`}>
				<Redirect to={"/dashboard"} />
			</Route>
			<Route path={`${route.url}/new`}>
				<NewTable />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default Tables;
