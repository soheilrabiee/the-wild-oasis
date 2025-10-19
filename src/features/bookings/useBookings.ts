import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router";
import { paginationSize } from "../../utils/config";

export function useBookings() {
    const queryClient = useQueryClient();
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

    // Sort By
    const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
    const [field, direction] = sortByRaw.split("-");
    const sortBy = { field, direction };

    // Pagination
    const page = !searchParams.get("page")
        ? 1
        : Number(searchParams.get("page"));

    // Query
    const {
        isPending,
        data: { data: bookings, count } = {},
        error,
    } = useQuery({
        // Whenever the filter changes then the query refetches the data because the filter is in the dependency array
        queryKey: ["bookings", filter, sortBy, page],
        queryFn: () => getBookings({ filter, sortBy, page }),
    });

    // Pre-fetching
    const pageCount = count ? Math.ceil(count / paginationSize) : 1;

    if (page < pageCount)
        queryClient.prefetchQuery({
            queryKey: ["bookings", filter, sortBy, page + 1],
            queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
        });

    if (page > 1)
        queryClient.prefetchQuery({
            queryKey: ["bookings", filter, sortBy, page - 1],
            queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
        });

    return { isPending, bookings, error, count };
}
