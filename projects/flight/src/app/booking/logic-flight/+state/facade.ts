import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Flight } from "../model/flight";
import { FlightFilter } from "../model/flight-filter";
import { BookingStore } from "./booking.store";


export function injectTicketsFacade() {
  const store = inject(BookingStore);

  return {
    flights: store.flightEntities,
    search: (filter: FlightFilter) => store.setFilter(filter),
    update: (flight: Flight) => store.setFlight(flight),
    reset: () => store.resetFlights()
  };
}
