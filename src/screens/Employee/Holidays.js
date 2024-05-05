import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Toast } from "react-bootstrap";
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import PageHeader from "../../components/common/PageHeader";    

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function Holidays() {
    const [isModal, setIsModal] = useState(false);
    const [isEditModalData, setIsEditModalData] = useState("");
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/holidays/get-holidays');
            const formattedHolidays = response.data.map((holiday, index) => ({
                id: holiday._id,
                day: holiday.day,
                startDate: formatDate(holiday.startDate),
                endDate: formatDate(holiday.endDate),
                name: holiday.name,
            }));
            setHolidays(formattedHolidays);
        } catch (error) {
            console.error('Erreur lors de la récupération des vacances :', error);
        }
    };

    const deleteHoliday = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/ProductOwners/delete-holidays/${id}`);
            fetchHolidays();
            toast.success("Holiday deleted successfully!");
        } catch (error) {
            console.error('Erreur lors de la suppression de la vacance :', error);
            toast.error("Failed to delete holiday!");
        }
    };

    const updateHoliday = async () => {
        try {
            await axios.put(`http://localhost:3000/api/ProductOwners/update-holidays/${isEditModalData.id}`, isEditModalData);
            setIsModal(false);
            fetchHolidays();
            toast.success("Holiday updated successfully!");
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la vacance :', error);
            toast.error("Failed to update holiday!");
        }
    };

    const addHoliday = async () => {
        try {
            await axios.post('http://localhost:3000/api/ProductOwners/add-holidays', isEditModalData);
            setIsModal(false);
            fetchHolidays();
            toast.success("Holiday added successfully!");
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la nouvelle vacance :', error);
            toast.error("Failed to add holiday!");
        }
    };

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Holidays" renderRight={() => (
                <div className="col-auto d-flex w-sm-100">
                    <Button variant="dark" className="btn-set-task w-sm-100 me-2" onClick={() => setIsModal(true)}>
                        <i className="icofont-plus-circle me-2 fs-6"></i>Add Holidays
                    </Button>
                </div>
            )} />
            <div className="container-xxl">
                <div className="row clearfix g-3">
                    {holidays.map((holiday, index) => (
                        <div key={index} className="col-lg-4">
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>  <h5 className="text-center">{holiday.name}</h5></Card.Title>
                                    <Card.Text className="text-center">
                                    
                                        <strong>Start Date </strong> {holiday.startDate}<br />
                                        <strong>End Date </strong> {holiday.endDate}
                                    </Card.Text>
                                    <div className="d-flex justify-content-end">
                                        <Button variant="outline-secondary" onClick={() => { setIsModal(true); setIsEditModalData(holiday) }}>
                                            <AiOutlineEdit className="text-success" />
                                        </Button>
                                        <Button variant="outline-secondary" className="ms-2" onClick={() => deleteHoliday(holiday.id)}>
                                            <AiOutlineDelete className="text-danger" />
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            <Modal centered show={isModal} onHide={() => { setIsModal(false); setIsEditModalData("") }} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{isEditModalData ? "Edit" : "Add"} Holiday</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Holiday Name</label>
                        <input type="text" className="form-control" placeholder="Holiday Name" value={isEditModalData ? isEditModalData.name : ""} onChange={(e) => setIsEditModalData({ ...isEditModalData, name: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Start Date</label>
                        <input type="date" className="form-control" placeholder="Start Date" value={isEditModalData ? isEditModalData.startDate : ""} onChange={(e) => setIsEditModalData({ ...isEditModalData, startDate: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">End Date</label>
                        <input type="date" className="form-control" placeholder="End Date" value={isEditModalData ? isEditModalData.endDate : ""} onChange={(e) => setIsEditModalData({ ...isEditModalData, endDate: e.target.value })} min={isEditModalData.startDate} />
                    </div>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setIsModal(false) }}>Cancel</Button>
                    {isEditModalData ? (
                        <Button variant="primary" onClick={updateHoliday}>Update</Button>
                    ) : (
                        <Button variant="primary" onClick={addHoliday}>Add</Button>
                    )}
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default Holidays;
