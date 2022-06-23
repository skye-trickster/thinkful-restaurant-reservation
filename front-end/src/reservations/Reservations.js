import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import NotFound from "../layout/NotFound";
import NewReservation from "./NewReservation";

function Reservations() {

    const route = useRouteMatch()

    return (
        <Switch>
            <Route path={`${route.url}/new`}>
                <NewReservation />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}

export default Reservations;