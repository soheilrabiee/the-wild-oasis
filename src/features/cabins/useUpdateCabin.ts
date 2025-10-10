import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Database } from "../../types/supabase";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

type Cabin = Database["public"]["Tables"]["cabins"]["Update"];
type CabinInsert = Omit<
    Database["public"]["Tables"]["cabins"]["Insert"],
    "image"
> & { image: string | File };

export function useUpdateCabin() {
    const queryClient = useQueryClient();

    const { mutate: editCabin, isPending: isEditing } = useMutation<
        Cabin,
        Error,
        { newCabinData: CabinInsert; id: number | undefined }
    >({
        mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
        onSuccess: () => {
            toast.success("Cabin successfully edited");

            queryClient.invalidateQueries({
                queryKey: ["cabin"],
            });
        },

        onError: (err) => toast.error(err.message),
    });

    return { isEditing, editCabin };
}
