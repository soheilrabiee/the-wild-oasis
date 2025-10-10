import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabins() {
    const {
        isPending,
        data: cabins,
        error,
    } = useQuery({
        queryKey: ["cabin"],
        queryFn: getCabins,
    });

    return { isPending, cabins, error };
}
