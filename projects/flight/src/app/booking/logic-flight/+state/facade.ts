import { inject } from "@angular/core"
import { Store } from "@ngrx/store"
import { ticketActions } from "./actions";
import { ticketFeature } from "./reducer";
import { FlightFilter } from "../model/flight-filter";
import { Flight } from "../model/flight";
import { BookingStore } from "./booking.store";


export function injectTicketsFacade() {
  const store = inject(Store);
  const bookingStore = inject(BookingStore);

  return {
    flights: bookingStore.flights,
    search: (filter: FlightFilter) => {
      bookingStore.setFilter(filter);
      bookingStore.loadFlights();
    },
    update: (flight: Flight) => {},
    reset: () => bookingStore.setFlights([])
  };
}
