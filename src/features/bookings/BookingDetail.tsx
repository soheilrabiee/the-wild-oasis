import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "./useBooking";
import Spinner from "../../ui/Spinner";
import { useNavigate } from "react-router";
import { useCheckout } from "../check-in-out/useCheckout";

const HeadingGroup = styled.div`
    display: flex;
    gap: 2.4rem;
    align-items: center;
`;

function BookingDetail() {
    const { booking, isPending } = useBooking();
    const { checkout, isCheckingOut } = useCheckout();
    const moveBack = useMoveBack();
    const navigate = useNavigate();

    if (isPending) return <Spinner />;

    const status = booking?.status || "unconfirmed";
    const id = booking?.id ?? 0;

    type BookingStatus = "unconfirmed" | "checked-in" | "checked-out";
    const statusToTagName: Record<BookingStatus, string> = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver",
    };

    return (
        <>
            <Row $type="horizontal">
                <HeadingGroup>
                    <Heading as="h1">Booking #{id}</Heading>
                    <Tag $type={statusToTagName[status as BookingStatus]}>
                        {status.replace("-", " ")}
                    </Tag>
                </HeadingGroup>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            {booking && <BookingDataBox booking={booking} />}

            <ButtonGroup>
                {status === "unconfirmed" && (
                    <Button onClick={() => navigate(`/checkin/${id}`)}>
                        Check in
                    </Button>
                )}

                {status === "checked-in" && (
                    <Button
                        onClick={() => checkout(id)}
                        disabled={isCheckingOut}
                    >
                        Check out
                    </Button>
                )}

                <Button $variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    );
}

export default BookingDetail;
