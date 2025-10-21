import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
    const queryClient = useQueryClient();

    const { isPending: isDeleting, mutate: deleteBooking } = useMutation({
        // Mutates function read the arguments from the api function
        mutationFn: deleteBookingApi,

        onSuccess: () => {
            toast.success("Booking successfully deleted");

            queryClient.invalidateQueries({
                queryKey: ["bookings"],
            });
        },

        onError: (err) => toast.error(err.message),
    });

    return { isDeleting, deleteBooking };
}
