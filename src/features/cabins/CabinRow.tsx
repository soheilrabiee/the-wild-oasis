import styled from "styled-components";
import type { Database } from "../../types/supabase";
import { formatCurrency } from "../../utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin } from "../../services/apiCabins";

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
    column-gap: 2.4rem;
    align-items: center;
    padding: 1.4rem 2.4rem;

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }
`;

const Img = styled.img`
    display: block;
    width: 6.4rem;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Price = styled.div`
    font-family: "Sono";
    font-weight: 600;
`;

const Discount = styled.div`
    font-family: "Sono";
    font-weight: 500;
    color: var(--color-green-700);
`;

type Cabin = Database["public"]["Tables"]["cabins"]["Row"];
type CabinRowProps = {
    cabin: Cabin;
};

function CabinRow({ cabin }: CabinRowProps) {
    const {
        id: cabinId,
        name,
        maxCapacity,
        regularPrice,
        discount,
        image,
    } = cabin;

    // A hook to access query client
    const queryClient = useQueryClient();

    // mutate : a callback function to use for the mutation
    const { isPending, mutate } = useMutation({
        mutationFn: deleteCabin,
        // What to do after the mutation was successful
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cabin"],
            });
        },
        onError: (err) => alert(err.message),
    });

    return (
        <TableRow role="row">
            <Img src={image ?? ""} />
            <Cabin>{name}</Cabin>
            <div>Fits up to {maxCapacity} guests</div>
            {regularPrice && <Price>{formatCurrency(regularPrice)}</Price>}
            {discount && <Discount>{formatCurrency(discount)}</Discount>}
            <button onClick={() => mutate(cabinId)} disabled={isPending}>
                Delete
            </button>
        </TableRow>
    );
}

export default CabinRow;
