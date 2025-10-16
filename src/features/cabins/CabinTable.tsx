import type { JSX } from "react";
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router";
import { sortItems } from "../../utils/sortItems";
import type { Database } from "../../types/supabase";

function CabinTable(): JSX.Element {
    const { isPending, cabins } = useCabins();
    const [searchParams] = useSearchParams();

    if (isPending) return <Spinner />;

    // When we go to the page for the first time we get null that's why we set it to "all" by default
    // 1) Filter
    const filterValue = searchParams.get("discount") || "all";

    let filteredCabins: typeof cabins;
    if (filterValue === "all") filteredCabins = cabins;
    if (filterValue === "no-discount")
        filteredCabins = cabins?.filter((cabin) => cabin.discount === 0);
    if (filterValue === "with-discount")
        filteredCabins = cabins?.filter(
            (cabin) => cabin.discount && cabin.discount > 0
        );

    // 2) Sort
    type Cabin = Database["public"]["Tables"]["cabins"]["Row"];
    type SortField = keyof Pick<
        Cabin,
        "created_at" | "name" | "regularPrice" | "discount" | "maxCapacity"
    >;
    type SortDirection = "asc" | "desc";

    const sortBy = searchParams.get("sortBy") || "created_at-asc";
    const [rawField, rawDirection] = sortBy.split("-");

    const field = (rawField as SortField) ?? "created_at";
    const direction = (rawDirection as SortDirection) ?? "asc";

    const sortedCabins = filteredCabins
        ? sortItems(filteredCabins, field, direction)
        : undefined;

    return (
        <Menus>
            <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
                <Table.Header>
                    <div></div>
                    <div>Cabin</div>
                    <div>Capacity</div>
                    <div>Price</div>
                    <div>Discount</div>
                    <div></div>
                </Table.Header>

                <Table.Body
                    // data={cabins}
                    data={sortedCabins}
                    render={(cabin) => (
                        <CabinRow cabin={cabin} key={cabin?.id} />
                    )}
                />
            </Table>
        </Menus>
    );
}

export default CabinTable;
