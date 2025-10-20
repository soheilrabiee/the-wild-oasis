import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router";

export function useBooking() {
    const { bookingId } = useParams();

    const {
        isPending,
        data: booking,
        error,
    } = useQuery({
        queryKey: ["booking"],
        queryFn: () => getBooking(Number(bookingId)),
    });

    return { isPending, booking, error };
}
