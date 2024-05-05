  import React, { useState, useEffect } from "react";
  import DataTable from "react-data-table-component";
  import PageHeader from "../../components/common/PageHeader";
  import axios from 'axios';
  import { EmployessYearlyStatusData, TodayTimeUtilisationData } from "../../components/Data/ChartData";
  import RecentActivityCard from "../../components/Employees/RecentActivityCard";
  import StatisticsCard from "../../components/Employees/StatisticsCard";
  import GeneralChartCard from "../../components/Employees/TodayTimeUtilisation";
  import { Modal, Button, Form } from 'react-bootstrap';
  import { ToastContainer, toast } from 'react-toastify';
  export const TimeAttendanceData = {
      title: "Time Attendance",
      columns: [
          {
              name: "Numéro de Compte",
              selector: (row, index) => index + 1,
              sortable: true
          },
          {
              name: "Jour",
              selector: row => row.jour,
              sortable: true,
          },
          {
              name: "Heure d'Embauche",
              selector: row => row.punchinTime,
              sortable: true,
          },
          {
              name: "Heure de Débauche",
              selector: row => <span className="text-danger">{row.punchoutTime}</span>,
              sortable: true,
          },
          {
              name: "Temps de Pause",
              selector: row => <span className="text-danger">{row.breackTime}</span>,
              sortable: true,
          },
          {
              name: "Demi-Journée",
              selector: row => <i className={`icofont-close-circled ${row.halfDay ? 'text-success' : 'text-danger'}`}></i>,
              sortable: true
          },
          {
              name: "Journée Complète",
              selector: row => <i className={`icofont-close-circled ${row.fullDay ? 'text-success' : 'text-danger'}`}></i>,
              sortable: true
          },
          {
              name: "Heures Supplémentaires",
              selector: row => <span className="text-success">{row.overTime}</span>,
              sortable: true,
          },
          {
              name: "Production Totale",
              selector: row => row.total
          }
      ]
  }

  function AttendanceEmployees() {
      const [dayRoutines, setDayRoutines] = useState([]);
      const [selectedDayRoutine, setSelectedDayRoutine] = useState(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [formData, setFormData] = useState({
        punchinTime: "",
        punchoutTime: "",
        breackTime: "",
        halfDay: false,
        fullDay: false,
        overTime: "",
        total: ""
      });
    
      const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.put(`http://localhost:3000/api/ProductOwners/update-journee/${selectedDayRoutine._id}`, formData);
          toast.success('Routine updated successfully');
          setIsModalOpen(false);
          fetchData(); // Re-fetch data after update
        } catch (error) {
          console.error('Error updating routine:', error);
          toast.error('Error updating routine');
        }
      };
    
      const handleRowClick = (row) => {
        setSelectedDayRoutine(row);
        setFormData({
          punchinTime: row.punchinTime,
          punchoutTime: row.punchoutTime,
          breackTime: row.breackTime,
          halfDay: row.halfDay,
          fullDay: row.fullDay,
          overTime: row.overTime,
          total: row.total
        });
        setIsModalOpen(true);
      };
    
      const fetchData = () => {
        axios.get('http://localhost:3000/api/ProductOwners/get-journees')
          .then((response) => {
            setDayRoutines(response.data);
          })
          .catch((error) => {
            console.error('Error fetching day routines:', error);
          });
      };
    
      useEffect(() => {
        fetchData();
      }, []);
    
      return (
          <div className="container-xxl">
              <ToastContainer />
              <PageHeader headerTitle="Attendance Employees" />
              <div className="row align-item-center row-deck g-3 mb-3">
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12">
                      <GeneralChartCard Title="Today Time Utilisation" extraDivBody={() =>
                          <div className="timesheet-info d-flex align-items-center justify-content-between flex-wrap">
                              <div className="intime d-flex align-items-center mt-2">
                                  <i className="icofont-finger-print fs-4 color-light-success"></i>
                                  <span className="fw-bold ms-1">Punching: 10:00 Am</span>
                              </div>
                              <div className="outtime mt-2 w-sm-100">
                                  <button type="button" className="btn btn-dark w-sm-100"><i className="icofont-foot-print me-2"></i>Punch Out</button>
                              </div>
                          </div>
                      }
                          identity="todaytimeutl"
                          data={TodayTimeUtilisationData}
                          footerBody={
                              <div class="timesheet-info d-flex align-items-center justify-content-around flex-wrap">
                                  <div class="intime d-flex align-items-center">
                                      <i class="icofont-lunch fs-3 color-lavender-purple"></i>
                                      <span class="fw-bold ms-1">Break: 1:10 Hr</span>
                                  </div>
                                  <div class="intime d-flex align-items-center">
                                      <i class="icofont-ui-timer fs-4 color-light-success"></i>
                                      <span class="fw-bold ms-1">Overtime: 02:10 Hr</span>
                                  </div>
                              </div>
                          }
                      />

                  </div>
                  <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-12">
                      <GeneralChartCard Title="Employess Yearly Status" identity="Employessyearlystatus" data={EmployessYearlyStatusData} />
                  </div>

              </div>
              <div className="row clearfix g-3 mb-3">
                  <div className="col-lg-12 col-md-12 flex-column">
                      <div className="row g-3 row-deck">
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
                              <StatisticsCard />
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
                              <RecentActivityCard />
                          </div>
                      </div>
                  </div>
              </div>
              <div className="row clearfix g-3">
          <div className="col-sm-12">
            <DataTable
              title="Attendance List"
              columns={TimeAttendanceData.columns}
              data={dayRoutines}
              defaultSortField="title"
              pagination
              selectableRows={false}
              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
              highlightOnHover={true}
              onRowClicked={handleRowClick}
            />
          </div>
        </div>
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedDayRoutine ? "Edit" : "Add"} Day Routine</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="punchinTime" className="form-label">Heure d'Embauche</label>
          <input type="text" className="form-control" id="punchinTime" name="punchinTime" value={formData.punchinTime} onChange={handleFormChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="punchoutTime" className="form-label">Heure de Débauche</label>
          <input type="text" className="form-control" id="punchoutTime" name="punchoutTime" value={formData.punchoutTime} onChange={handleFormChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="breackTime" className="form-label">Temps de Pause</label>
          <input type="text" className="form-control" id="breackTime" name="breackTime" value={formData.breackTime} onChange={handleFormChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="halfDay" className="form-label">Demi-Journée</label>
          <input type="text" className="form-control" id="halfDay" name="halfDay" value={formData.halfDay} onChange={handleFormChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="fullDay" className="form-label">Journée Complète</label>
          <input type="text" className="form-control" id="fullDay" name="fullDay" value={formData.fullDay} onChange={handleFormChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="overTime" className="form-label">Heures Supplémentaires</label>
          <input type="text" className="form-control" id="overTime" name="overTime" value={formData.overTime} onChange={handleFormChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="total" className="form-label">Production Totale</label>
          <input type="text" className="form-control" id="total" name="total" value={formData.total} onChange={handleFormChange} />
        </div>
        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>{' '}
              <Button variant="primary" type="submit">Save changes</Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  export default AttendanceEmployees;