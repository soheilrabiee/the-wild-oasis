import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";

type mutationFnProps = {
    bookingId: number;
    breakfast: {
        hasBreakfast?: boolean;
        extrasPrice?: number;
        totalPrice?: number;
    };
};

export function useCheckin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { bookingId } = useParams();

    const { mutate: checkin, isPending: isCheckingIn } = useMutation({
        mutationFn: ({ bookingId, breakfast }: mutationFnProps) =>
            updateBooking(bookingId, {
                status: "checked-in",
                isPaid: true,
                ...breakfast,
            }),

        onSuccess: (data) => {
            toast.success(`Booking #${data.id} successfully checked in`);
            queryClient.invalidateQueries({
                queryKey: ["bookings", "booking", bookingId],
            });
            navigate("/");
        },

        onError: () => toast.error("There was an error while checking in"),
    });

    return { checkin, isCheckingIn };
}
