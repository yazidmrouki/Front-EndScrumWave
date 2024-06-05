import React from "react";

function InterviewCard(props) {
    const { value, label, Numbres, chartClass } = props;
    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="d-flex align-items-center flex-fill">
                    <span className="avatar lg -bg rounded-circle text-center d-flex align-items-center justify-content-center">
                        {Numbres === 1 ? (
                            <div style={{
                                position: 'relative',
                                width: '50px', // Adjust the size as needed
                                height: '50px', // Adjust the size as needed
                                borderRadius: '50%', // Make it circular
                                overflow: 'hidden', // Hide overflow for circular shape
                                display: 'inline-block', // Ensure it behaves like an inline element
                                verticalAlign: 'middle' // Align it vertically in the middle
                            }}>
                                <video 
                                    autoPlay 
                                    loop 
                                    muted 
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover' // Ensure video fills the circular container
                                    }}>
                                    <source src="https://cdn-icons-mp4.flaticon.com/512/15578/15578482.mp4" type="video/mp4" />
                                </video>
                            </div>
                        ) : (
                            <div style={{
                                position: 'relative',
                                width: '50px', // Adjust the size as needed
                                height: '50px', // Adjust the size as needed
                                borderRadius: '50%', // Make it circular
                                overflow: 'hidden', // Hide overflow for circular shape
                                display: 'inline-block', // Ensure it behaves like an inline element
                                verticalAlign: 'middle' // Align it vertically in the middle
                            }}>
                                <video 
                                    autoPlay 
                                    loop 
                                    muted 
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover' // Ensure video fills the circular container
                                    }}>
                                    <source src="https://cdn-icons-mp4.flaticon.com/512/14164/14164987.mp4" type="video/mp4" />
                                </video>
                            </div>
                        )}
                    </span>
                    <div className="d-flex flex-column ps-3 flex-fill">
                        <h6 className="fw-bold mb-0 fs-4">{value ? value : ""}</h6>
                        <span className="text-muted">{label}</span>
                    </div>
                    <i className={chartClass}></i>
                </div>
            </div>
        </div>
    );
}

export default InterviewCard;
