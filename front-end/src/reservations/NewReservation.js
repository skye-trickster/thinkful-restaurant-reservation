import React from "react";
import { useHistory } from "react-router";

import ReservationForm from "./ReservationForm";
import {createReservation} from "../utils/api"

function NewReservation() {    

    const history = useHistory()

    const cancel = () => {
        history.goBack()
    }

    const create = (reservation) => {
        const abortController = new AbortController()

        return createReservation(reservation, abortController.signal)
            .then(({id}) => history.push('/'))
            .catch((error) => {if (error.name !== "AbortError") {console.log(error); throw error;} })
            .finally(() => abortController.abort)
    }

    return (
        <main>
            <h1>New Reservation</h1>
            <ReservationForm cancelFunction={cancel} submitFunction={create} />
        </main>
    )
}

export default NewReservation;