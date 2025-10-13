import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable";
import AddCabin from "../features/cabins/AddCabin";

function Cabins() {
    return (
        <>
            <Row $type="horizontal">
                <Heading as="h1">All Cabins</Heading>
                <p>Filter / Sort</p>
            </Row>
            <Row $type="vertical">
                <CabinTable />
                <AddCabin />
            </Row>
        </>
    );
}

export default Cabins;
