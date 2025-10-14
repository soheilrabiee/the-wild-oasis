import type { JSX } from "react";
import Button from "../../ui/Button";
import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";

function AddCabin(): JSX.Element {
    return (
        <div>
            <Modal>
                <Modal.Open opens="cabin-form">
                    <Button>Add new Cabin</Button>
                </Modal.Open>
                <Modal.Window name="cabin-form">
                    <CreateCabinForm />
                </Modal.Window>

                {/* <Modal.Open opens="table">
                <Button>Show table</Button>
                </Modal.Open>
                <Modal.Window name="table">
                <CabinTable />
                </Modal.Window> */}
            </Modal>
        </div>
    );
}

// WITHOUT COMPOUND PATTERN
// function AddCabin(): JSX.Element {
//     const [isOpenModal, setIsOpenModal] = useState(false);

//     return (
//         <div>
//             <Button onClick={() => setIsOpenModal((show) => !show)}>
//                 Add new cabin
//             </Button>
//             {isOpenModal && (
//                 <Modal onClose={() => setIsOpenModal(false)}>
//                     <CreateCabinForm
//                         onCloseModal={() => setIsOpenModal(false)}
//                     />
//                 </Modal>
//             )}
//         </div>
//     );
// }

export default AddCabin;
