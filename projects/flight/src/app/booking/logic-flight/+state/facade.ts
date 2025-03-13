import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Flight } from "../model/flight";
import { FlightFilter } from "../model/flight-filter";
import { BookingStore } from "./booking.store";


export function injectTicketsFacade() {
  const bookingStore = inject(BookingStore);

  return {
    flights: bookingStore.flights,
    search: (filter: FlightFilter) => {
      bookingStore.setFilter(filter);
    },
    update: (flight: Flight) => {},
    reset: () => bookingStore.setFlights([])
  };
}
