import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { Flight } from "../model/flight";
import { computed, inject } from "@angular/core";
import { FlightFilter } from "../model/flight-filter";
import { FlightService } from "../data-access/flight.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { tapResponse } from "@ngrx/operators";
import { pipe, switchMap } from "rxjs";


export const BookingStore = signalStore(
    { providedIn: 'root' },
    withState({
        filter: {
            from: 'Paris',
            to: 'London',
            urgent: false
        },
        basket: {
            3: true,
            5: true
        } as Record<number, boolean>,
        flights: [] as Flight[]
    }),
    withComputed(store => ({
        delayedFlights: computed(() => store.flights().filter(
            flight => flight.delayed
        ))
    })),
    // Updaters
    withMethods(store => ({
        setFilter: (filter: FlightFilter) => patchState(store, { filter }),
        setFlights: (flights: Flight[]) => patchState(store, { flights }),
    })),
    // Side-Effects
    withMethods((
        store,
        flightService = inject(FlightService)
    ) => ({
        loadFlights: rxMethod<FlightFilter>(pipe(
            switchMap(filter => flightService.find(
                filter.from,
                filter.to,
                filter.urgent
            )),
            tapResponse(
                flights => store.setFlights(flights),
                err => console.error(err)
            )
        ))
    })),
    withHooks(store => ({
        onInit: () => store.loadFlights(store.filter)
    }))
);