import GlobalStyles from "./styles/GlobalStyles";
import Button from "./ui/Button";
import Heading from "./ui/Heading";
import Row from "./ui/Row";

function App() {
    return (
        <>
            <GlobalStyles />
            <Heading as="h1">H1</Heading>
            <Row $type="vertical">
                <Heading as="h2">H2</Heading>
                <Heading as="h3">H3</Heading>
            </Row>
            <Button>Check in</Button>
        </>
    );
}

export default App;
