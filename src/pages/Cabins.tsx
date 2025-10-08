import { useState } from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable";
import Button from "../ui/Button";
import CreateCabinForm from "../features/cabins/CreateCabinForm";

function Cabins() {
    const [showForm, setShowForm] = useState(false);

    return (
        <>
            <Row $type="horizontal">
                <Heading as="h1">All Cabins</Heading>
                <p>Filter / Sort</p>
            </Row>
            <Row>
                <CabinTable />
            </Row>
            <Button onClick={() => setShowForm((show) => !show)}>
                Add new cabin
            </Button>
            {showForm && <CreateCabinForm />}
        </>
    );
}

export default Cabins;
