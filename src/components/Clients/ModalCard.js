import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ImageCropper from "./ImageCropper";


const ModalCard = ({ updateAvatar, closeModal }) => {
  return (
    <Modal show={true} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier le profil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className="relative z-10"
          aria-labelledby="crop-image-dialog"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full justify-center px-2 py-12 text-center ">
              <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-gray-800 text-slate-100 text-left shadow-xl transition-all">
                <div className="px-5 py-4">
                  
                  <ImageCropper
                    updateAvatar={updateAvatar}
                    closeModal={closeModal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Fermer
        </Button>
        <Button variant="primary" onClick={updateAvatar}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCard;
