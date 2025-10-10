import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

export function useDeleteCabin() {
    // A hook to access query client
    const queryClient = useQueryClient();

    // mutate : a callback function to use for the mutation
    const { isPending: isDeleting, mutate: deleteCabin } = useMutation({
        mutationFn: deleteCabinApi,
        // What to do after the mutation was successful
        onSuccess: () => {
            toast.success("Cabin successfully deleted");

            queryClient.invalidateQueries({
                queryKey: ["cabin"],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    return { isDeleting, deleteCabin };
}
