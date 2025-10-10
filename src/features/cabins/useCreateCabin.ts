import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Database } from "../../types/supabase";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

type CabinInsert = Omit<
    Database["public"]["Tables"]["cabins"]["Insert"],
    "image"
> & { image: string | File };

export function useCreateCabin() {
    const queryClient = useQueryClient();

    const { mutate: createCabin, isPending: isCreating } = useMutation({
        // New cabin object is passed into the function automatically
        mutationFn: (newCabin: CabinInsert) => createEditCabin(newCabin),
        onSuccess: () => {
            toast.success("New cabin successfully created");

            queryClient.invalidateQueries({
                queryKey: ["cabin"],
            });
        },

        onError: (err) => toast.error(err.message),
    });

    return { isCreating, createCabin };
}
