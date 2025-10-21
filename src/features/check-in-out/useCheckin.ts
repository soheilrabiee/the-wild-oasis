import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export function useCheckin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: checkin, isPending: isCheckingIn } = useMutation({
        mutationFn: (bookingId: number) =>
            updateBooking(bookingId, {
                status: "checked-in",
                isPaid: true,
            }),

        onSuccess: (data) => {
            toast.success(`Booking #${data.id} successfully checked in`);
            queryClient.invalidateQueries({
                queryKey: ["bookings", "booking"],
            });
            navigate("/");
        },

        onError: () => toast.error("There was an error while checking in"),
    });

    return { checkin, isCheckingIn };
}
