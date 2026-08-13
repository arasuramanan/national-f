import { useFormik } from 'formik';
import axios from 'axios';
import toast from "react-hot-toast";
import './DetailList.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';



function DetailsList() {
  const [timeValue, setTimeValue] = useState('');
  const navigate = useNavigate();
  const [jsonData, setJsonData] = useState(null);


  // PDF EXPORT
  const exportPDF = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_URL}/api/export/pdf`,
      {
        withCredentials: true,
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "UPSI_Details_Report.pdf");

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success("PDF exported successfully!");
  } catch (error) {
    console.error("PDF export failed:", error);
    toast.error("Failed to export PDF");
  }
};


  const fetchData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_URL}/api/details`,
        {
          withCredentials: true,
  }
    );

    setJsonData(response.data);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchData();
}, []);

  const formik = useFormik({
    initialValues: {
      NameoftheUPSI: '',
      InfoSharedBy: '',
      PANNumber1: '',
      InformationSharedInCapacity1: '',
      Designation1: '',
      InfoSharedTo: '',
      PANNumber2: '',
      InformationSharedInCapacity2: '',
      Designation2: '',
      TypeofOrganization: '',
      NameoftheOrganization: '',
      DateofSharing: '',
      ParticularofInfoShared: '',
      PurposeofSharing: '',
      ModeofSharing: '',
      TimeofSharing: '',
    },
    onSubmit: async (values, { resetForm }) => {
  try {
    const payload = {
      ...values,
      TimeofSharing: timeValue,
    };

      const response = await axios.post(
  `${process.env.REACT_APP_URL}/api/detailsnewform`,
  payload,
  {
    withCredentials: true,
  }
  );

    setJsonData((prevData) => [
      ...(prevData || []),
      response.data.data,
      ]);

    toast.success("Form submitted successfully!");

    resetForm({
      values: {
        NameoftheUPSI: "",
        InfoSharedBy: "",
        PANNumber1: "",
        InformationSharedInCapacity1: "",
        Designation1: "",
        InfoSharedTo: "",
        PANNumber2: "",
        InformationSharedInCapacity2: "",
        Designation2: "",
        TypeofOrganization: "",
        NameoftheOrganization: "",
        DateofSharing: "",
        ParticularofInfoShared: "",
        PurposeofSharing: "",
        ModeofSharing: "",
        TimeofSharing: "",
      },
    });

    setTimeValue("");
  } catch (err) {
    console.error(err);

    toast.error(
      err.response?.data?.message || "Submission failed"
    );
  }
},
  });



  // EXCEL EXPORT
const exportExcel = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_URL}/api/export/excel`,
      {
        withCredentials: true,
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    );

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      "UPSI_Details_Report.xlsx"
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success("Excel exported successfully!");
  } catch (error) {
    console.error("Excel export failed:", error);

    toast.error("Failed to export Excel");
  }
};
  



const handleLogout = async () => {
  try {
    await axios.post(
      `${process.env.REACT_APP_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    navigate("/", { replace: true });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row" style={{ marginBottom: '20px' }}></div>
  <div className="container">
    <div className="row">
      <div className="col-md-6">
        <label htmlFor="text" className="form-label">Name of the UPSI:</label>
      </div>
      <div className="col-md-6">
        <input
    type="text"
    name="NameoftheUPSI"
    value={formik.values.NameoftheUPSI}
    onChange={formik.handleChange}
    className="form-control"
/>
      </div>
    </div>
    <div className="row">
      <div className="col-md-6">
        <label htmlFor="inputPassword" className="form-label">Info Shared By:</label>
      </div>
      
      <div className="col-md-6">
        <input type="text" value={formik.values.InfoSharedBy} onChange={formik.handleChange} name="InfoSharedBy" className="form-control" />
      </div>
    </div>
    <div className="row">
      <div className="col-md-6">
        <label htmlFor="inputPassword" className="form-label">PAN Number1:</label>
      </div>
      <div className="col-md-6">
        <input type="text" value={formik.values.PANNumber1} onChange={formik.handleChange} name="PANNumber1" className="form-control" />
      </div>
    </div>
    
    <div className="row">
      <div className="col-md-6">
        <label htmlFor="text" className="form-label">Information Shared In Capacity 1:</label>
      </div>
      
      <div className="col-md-6">
        <select className="form-select" onChange={formik.handleChange} name="InformationSharedInCapacity1" value={formik.values.InformationSharedInCapacity1} aria-label=".form-select-lg example">
          <option value="">--- Select ---</option>
          <option value="Designated Person">Designated Person</option>
          <option value="Insider">Insider</option>
          <option value="UPSI Project">UPSI Project</option>
        </select>
      </div>
    </div>

    <div className="row" style={{ marginTop: '15px' }}>
      <div className="col-md-6">
        <label htmlFor="text" className="form-label">Designation 1:</label>
      </div>
      <div className="col-md-6">
        <select className="form-select" onChange={formik.handleChange} name="Designation1" value={formik.values.Designation1} aria-label=".form-select-lg example">
          <option value="">--- Select ---</option>
          <option value="Director">Director</option>
          <option value="Managing Director">Managing Director</option>
          <option value="Independent Director">Independent Director</option>
          <option value="CFO">CFO</option>
          <option value="Company Secretary">Company Secretary</option>
          <option value="Auditor">Auditor</option>
          <option value="Company Secretary - In Practice">Company Secretary - In Practice</option>
          <option value="Others">Others</option>
          
        </select>
      </div>
    </div>


    <div className="row">
  <div className="col-md-6">
    <label htmlFor="text" className="form-label">Insider Signed Confidentiality Agreement:</label>
  </div>

 
  <div className="col-md-6">
    <label htmlFor="text" className="form-label" style={{ color: "red", whiteSpace: "nowrap", marginTop: "10px" }}>
      
      No Confidentiality Agreement Signed
    </label>
    </div>
</div>


<div className="row" style={{ marginTop: "20px" }}>
  <div className="col-md-6">
    <label htmlFor="text" className="form-label">Info Shared To:</label>
  </div>
  <div className="col-md-6">
    <input type="text" value={formik.values.InfoSharedTo} onChange={formik.handleChange} name="InfoSharedTo" className="form-control" />
  </div>
</div>

    <div className="row">
      <div className="col-md-6">
        <label htmlFor="inputPassword" className="form-label">PAN Number2:</label>
      </div>
      <div className="col-md-6">
        <input type="text" value={formik.values.PANNumber2} onChange={formik.handleChange} name="PANNumber2" className="form-control" />
      </div>
    </div>

    <div className="row">
      <div className="col-md-6">
        <label htmlFor="text" className="form-label">Information Shared In Capacity 2:</label>
      </div>
      
      <div className="col-md-6">
        <select className="form-select" onChange={formik.handleChange} name="InformationSharedInCapacity2" value={formik.values.InformationSharedInCapacity2} aria-label=".form-select-lg example">
          <option value="">--- Select ---</option>
          <option value="Designated Person">Designated Person</option>
          <option value="Insider">Insider</option>
          <option value="UPSI Project">UPSI Project</option>
        </select>
      </div>
    </div>

    <div className="row" style={{ marginTop: '15px' }}>
      <div className="col-md-6">
        <label htmlFor="text" className="form-label">Designation 2:</label>
      </div>
      <div className="col-md-6">
        <select className="form-select" onChange={formik.handleChange} name="Designation2" value={formik.values.Designation2} aria-label=".form-select-lg example">
          <option value="">--- Select ---</option>
          <option value="Director">Director</option>
          <option value="Managing Director">Managing Director</option>
          <option value="Independent Director">Independent Director</option>
          <option value="CFO">CFO</option>
          <option value="Company Secretary">Company Secretary</option>
          <option value="Auditor">Auditor</option>
          <option value="Company Secretary - In Practice">Company Secretary - In Practice</option>
          <option value="Others">Others</option>
          
        </select>
      </div>
    </div>


    <div className="row">
      <div className="col-md-6">
        <label htmlFor="text" className="form-label">Type of Organization:</label>
      </div>
      <div className="col-md-6">
        <select className="form-select" name="TypeofOrganization" value={formik.values.TypeofOrganization} onChange={formik.handleChange}  aria-label=".form-select-lg example">
          <option value="">--- Select ---</option>
          <option value="Partnership">Partnership</option>
          <option value="Individual">Individual</option>
          <option value="Company">Company</option>
        </select>
      </div>
    </div>
    <div className="row" style={{ marginTop: '15px' }}>
      <div className="col-md-6">
        <label htmlFor="text" className="form-label">Name of the Organization:</label>
      </div>
      <div className="col-md-6">
        <input type="text" value={formik.values.NameoftheOrganization} onChange={formik.handleChange} name="NameoftheOrganization" className="form-control" />
      </div>
    </div>
    <div className="row">
      <div className="col-md-6">
        <label htmlFor="text" className="form-label">Date of Sharing:</label>
      </div>
      <div className="col-md-6">
        <input type="date" id="date" value={formik.values.DateofSharing} onChange={formik.handleChange} name="DateofSharing" className="form-control" />
      </div>
    </div>
    <div className="row" style={{ marginTop: '15px' }}>
      <div className="col-md-6">
        <label htmlFor="text" className="form-label">Particular of Info Shared:</label>
      </div>
      <div className="col-md-6">
        <input type="text" value={formik.values.ParticularofInfoShared} onChange={formik.handleChange} name="ParticularofInfoShared" className="form-control" />
      </div>
    </div>
    <div className="row">
      <div className="col-md-6">
        <label htmlFor="text" className="form-label">Purpose of Sharing:</label>
      </div>
      <div className="col-md-6">
        <input type="text" value={formik.values.PurposeofSharing} onChange={formik.handleChange} name="PurposeofSharing" className="form-control" />
      </div>
    </div>
    <div className="row">
      <div className="col-md-6">
        <label htmlFor="text" className="form-label">Mode of Sharing:</label>
      </div>
      <div className="col-md-6">
        <select className="form-select" value={formik.values.ModeofSharing} onChange={formik.handleChange} name="ModeofSharing" aria-label=".form-select-lg example">
          <option value="">--- Select ---</option>
          <option value="Email">Email</option>
          <option value="Physical">Physical</option>
          <option value="Pendrive">Pendrive</option>
        </select>
      </div>
    </div>


    <div className="row">
  <div className="col-md-6">
    <label htmlFor="time" className="form-label">Time of Sharing:</label>
  </div>
  <div className="col-md-6">
    <input
      type="time"
      value={timeValue}
      onChange={(e) => setTimeValue(e.target.value)}
      name="TimeofSharing"
      className="form-control"
    />
  </div>
</div>


    <div className="row">
      <div className="col-md-6">
        <button
        type="submit"
        disabled={formik.isSubmitting}
          >
      {formik.isSubmitting ? "Submitting..." : "SUBMIT"}
      </button>
      </div>
    </div>

    <div className="row" style={{ marginTop: '20px' }}></div>

    <div className="row">
      <div className="col-md-6">

    <button type="button" onClick={exportPDF}>
                Export PDF
    </button>
  </div>
</div>

<div className="row" style={{ marginTop: '20px' }}></div>

<div className="row">
  <div className="col-md-6">
    <button type="button" onClick={exportExcel} className="button excel-button">
      Excel
    </button>
  </div>
</div>
</div>
<div className="row" style={{ marginTop: '20px' }}></div>

      
      {/* Logout Button */}
      <div className="row">
        <div className="col-md-6">
          <button type="button" onClick={handleLogout} className="button logout-button">
            Logout
          </button>


        </div>
        
      </div>
{/* <div className="col-md-6">
                <button
  type="button"
  className="btn btn-primary"
  onClick={() => navigate("/entered-documents")}
>
  Entered Documents
</button>
</div> */}

      <div className="row" style={{ marginTop: '20px' }}></div>
</form>
  
    );
}

export default DetailsList;