import React, { useState } from "react";
import { Modal, Dropdown } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import AttendanceCard from "../../components/Employees/AttendanceCard";

function Attendance() {

    const [isModal, setIsModal] = useState(false);

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Attendance  For Mouth "/>
            <div className="row clearfix g-3">
                <div className="col-sm-12">
                    <AttendanceCard />
                </div>
            </div>
           
        </div>
    )
}


export default Attendance;