import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router";

export function useBookings() {
    const [searchParams] = useSearchParams();

    // Filter
    const filterValue = searchParams.get("status");
    const filter =
        !filterValue || filterValue === "all"
            ? null
            : {
                  field: "status",
                  value: filterValue,
              };

    const {
        isPending,
        data: bookings,
        error,
    } = useQuery({
        // Whenever the filter changes then the query refetches the data because the filter is in the dependency array
        queryKey: ["bookings", filter],
        queryFn: () => getBookings({ filter }),
    });

    return { isPending, bookings, error };
}
