import { patchState, signalStore, type, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { Flight } from "../model/flight";
import { computed, inject } from "@angular/core";
import { FlightFilter } from "../model/flight-filter";
import { FlightService } from "../data-access/flight.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { tapResponse } from "@ngrx/operators";
import { pipe, switchMap } from "rxjs";
import { removeAllEntities, setEntities, setEntity, withEntities } from "@ngrx/signals/entities";


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
        } as Record<number, boolean>
    }),
    withEntities({ entity: type<Flight>(), collection: 'flight' }),
    withComputed(store => ({
        filteredFlights: computed(
            () => store.flightEntities().filter(flight =>
                flight.from.startsWith(store.filter.from())
                && flight.to.startsWith(store.filter.to())
            )
        ),
        selectedFlights: computed(
            () => store.flightEntities().filter(flight => store.basket()[flight.id])
        ),
        delayedFlights: computed(
            () => store.flightEntities().filter(flight => flight.delayed)
        ),
    })),
    // Updaters
    withMethods(store => ({
        setFilter: (filter: FlightFilter) => patchState(store, { filter }),
        // Creates a local cache w/ more performat EntityState data structure
        setFlights: (flights: Flight[]) => patchState(store,
            setEntities(flights, { collection: 'flight' })
        ),
        resetFlights: () => patchState(store,
            removeAllEntities({ collection: 'flight' })
        ),
        // Creates a local cache w/ more performat EntityState data structure
        setFlight: (flight: Flight) => patchState(store,
            setEntity(flight, { collection: 'flight' })
        ),
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