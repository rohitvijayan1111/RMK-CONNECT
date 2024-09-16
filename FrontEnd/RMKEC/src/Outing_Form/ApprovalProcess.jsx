import React from 'react';
import { FaUser, FaCalendarAlt, FaClock, FaCheckCircle, FaCommentDots, FaMars, FaVenus, FaIdCard, FaSchool, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import './ApprovalProcess.css'
const ApprovalProcess = () => {
  const dummyData = {
    studentName: "John Doe",
    registrationNumber: "123456",
    year: 3,
    department: "Information Technology",
    section: "A",
    roomNumber: "B12",
    noOfDays: 5,
    fromDate: "2024-09-20",
    toDate: "2024-09-25",
    reasonForLeave: "Family Emergency",
    fatherName: "Michael Doe",
    motherName: "Jane Doe",
    contactNumber1: "9876543210",
    contactNumber2: "9876543222",
    nativePlace: "New York",
    gender:"Male",
    counselorName: "Mr. Smith",
    counselorComments: "Verified with parents",
    yearCoordinatorName: "Mrs. Johnson", 
    dateOfLeaving: "2024-09-20",
    timeOfLeaving: "10:00 AM",
    requestDate: "2024-09-15",
    status: {
      counsellor: "Approved",
      yearCoordinator: "Approved", 
      hod: "Approved",
      principal: "Pending"
    }
  };

  return (
    <div className="approval-card">
      <h2>Leave Request Approval</h2>

      <div className="details">
       
        <div className="detail-item">
          <FaUser className="icon" />
          <div>
            <strong>Name:</strong> <p>{dummyData.studentName}</p>
          </div>
        </div>

     
        <div className="detail-item">
          <FaIdCard className="icon" />
          <div>
            <strong>Registration No:</strong> <p>{dummyData.registrationNumber}</p>
          </div>
        </div>


        <div className="detail-item">
        {dummyData.gender === 'Male' ? <FaMars className="icon" /> : <FaVenus className="icon" />}
          <div>
            <strong>Gender:</strong> <p>{dummyData.gender}</p>
          </div>
        </div>

        <div className="detail-item">
          <FaSchool className="icon" />
          <div>
            <strong>Branch:</strong> <p>{dummyData.department}</p>
          </div>
        </div>

     
        <div className="detail-item">
          <FaSchool className="icon" />
          <div>
            <strong>Year:</strong> <p>{dummyData.year}</p>
          </div>
        </div>

      
        <div className="detail-item">
          <FaSchool className="icon" />
          <div>
            <strong>Section:</strong> <p>{dummyData.section}</p>
          </div>
        </div>

       
        <div className="detail-item">
          <FaUser className="icon" />
          <div>
            <strong>Room Number:</strong> <p>{dummyData.roomNumber}</p>
          </div>
        </div>

       
        <div className="detail-item">
          <FaClock className="icon" />
          <div>
            <strong>No of Days:</strong> <p>{dummyData.noOfDays}</p>
          </div>
        </div>

        
        <div className="detail-item">
          <FaCalendarAlt className="icon" />
          <div>
            <strong>Date of Application:</strong> <p>{dummyData.requestDate}</p>
          </div>
        </div>

       
        <div className="detail-item">
          <FaCalendarAlt className="icon" />
          <div>
            <strong>From Date:</strong> <p>{dummyData.fromDate}</p>
          </div>
        </div>

        
        <div className="detail-item">
          <FaCalendarAlt className="icon" />
          <div>
            <strong>To Date:</strong> <p>{dummyData.toDate}</p>
          </div>
        </div>

        
        <div className="detail-item">
          <FaCommentDots className="icon" />
          <div>
            <strong>Reason for Leave:</strong> <p>{dummyData.reasonForLeave}</p>
          </div>
        </div>

        
        <div className="detail-item">
          <FaUser className="icon" />
          <div>
            <strong>Father's Name:</strong> <p>{dummyData.fatherName}</p>
          </div>
        </div>

        
        <div className="detail-item">
          <FaUser className="icon" />
          <div>
            <strong>Mother's Name:</strong> <p>{dummyData.motherName}</p>
          </div>
        </div>

        
        <div className="detail-item">
          <FaPhoneAlt className="icon" />
          <div>
            <strong>Contact Number 1:</strong> <p>{dummyData.contactNumber1}</p>
          </div>
        </div>

       
        <div className="detail-item">
          <FaPhoneAlt className="icon" />
          <div>
            <strong>Contact Number 2:</strong> <p>{dummyData.contactNumber2}</p>
          </div>
        </div>

        
        <div className="detail-item">
          <FaMapMarkerAlt className="icon" />
          <div>
            <strong>Native Place:</strong> <p>{dummyData.nativePlace}</p>
          </div>
        </div>

        <div className="detail-item">
          <FaUser className="icon" />
          <div>
            <strong>Year Coordinator:</strong> <p>{dummyData.yearCoordinatorName}</p>
          </div>
        </div>

        
        <div className="detail-item">
          <FaUser className="icon" />
          <div>
            <strong>Counselor:</strong> <p>{dummyData.counselorName}</p>
          </div>
        </div>

      
        <div className="detail-item">
          <FaCommentDots className="icon" />
          <div>
            <strong>Counselor's Comments:</strong> <p>{dummyData.counselorComments}</p>
          </div>
        </div>

        
        <div className="detail-item">
          <FaCalendarAlt className="icon" />
          <div>
            <strong>Date of Leaving:</strong> <p>{dummyData.dateOfLeaving}</p>
          </div>
        </div>

        
        <div className="detail-item">
          <FaClock className="icon" />
          <div>
            <strong>Time of Leaving:</strong> <p>{dummyData.timeOfLeaving}</p>
          </div>
        </div>
      </div>

      <div className="approval-status">
        <div className="status-item">
          <span>Counsellor</span>
          <FaCheckCircle className={dummyData.status.counsellor === "Approved" ? "approved" : "pending"} />
        </div>
        <div className="status-item">
          <span>Year Coordinator</span> 
          <FaCheckCircle className={dummyData.status.yearCoordinator === "Approved" ? "approved" : "pending"} />
        </div>
        <div className="status-item">
          <span>HoD</span>
          <FaCheckCircle className={dummyData.status.hod === "Approved" ? "approved" : "pending"} />
        </div>
        <div className="status-item">
          <span>Principal</span>
          <FaCheckCircle className={dummyData.status.principal === "Approved" ? "approved" : "pending"} />
        </div>
      </div>
    </div>
  );
};

export default ApprovalProcess;
