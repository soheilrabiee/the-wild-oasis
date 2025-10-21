import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useParams } from "react-router";

export function useCheckout() {
    const queryClient = useQueryClient();
    const { bookingId } = useParams();

    const { mutate: checkout, isPending: isCheckingOut } = useMutation({
        mutationFn: (bookingId: number) =>
            updateBooking(bookingId, {
                status: "checked-out",
            }),

        onSuccess: (data) => {
            toast.success(`Booking #${data.id} successfully checked out`);
            queryClient.invalidateQueries({
                queryKey: ["bookings", "booking", bookingId],
            });
        },

        onError: () => toast.error("There was an error while checking out"),
    });

    return { checkout, isCheckingOut };
}
