import { saveAs } from 'file-saver';
import { useFormik } from 'formik';
import axios from 'axios';
import './DetailList.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import ExcelJS from 'exceljs';
import toast from "react-hot-toast";





function DetailsList() {
  const [timeValue, setTimeValue] = useState('');
  const navigate = useNavigate();
  const [jsonData, setJsonData] = useState(null);




  const fetchData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_URL}/api/details`
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

    const result = await axios.post(
      `${process.env.REACT_APP_URL}/api/detailsnewform`,
      payload
    );

    console.log(result.data);
    await fetchData(); 

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

  


  
  // const generatePdf = () => {

    
  //   if (!jsonData) return;

    
  
  //   const pdfContainer = document.createElement('div');
  //   pdfContainer.innerHTML = `<pre>${JSON.stringify(jsonData, null, 2)}</pre>`;
  
  //   html2pdf()
  //     .set({ margin: 0.5 })
  //     .from(pdfContainer)
  //     .save()
  //     .then((pdf) => {
  //       saveAs(pdf, 'data.pdf');
  //     })
  //     .catch((error) => {
  //       console.error('Error generating PDF:', error);
  //     });
      
  // };

  const generatePdf = () => {
  if (!jsonData || jsonData.length === 0) {
    toast.error("No data available to export");
    return;
  }

  const tableRows = jsonData
    .map(
      (item) => `
      <tr>
        <td>${item.NameoftheUPSI || ""}</td>
        <td>${item.InfoSharedBy || ""}</td>
        <td>${item.PANNumber1 || ""}</td>
        <td>${item.InformationSharedInCapacity1 || ""}</td>
        <td>${item.Designation1 || ""}</td>
        <td>${item.InfoSharedTo || ""}</td>
        <td>${item.PANNumber2 || ""}</td>
        <td>${item.InformationSharedInCapacity2 || ""}</td>
        <td>${item.Designation2 || ""}</td>
        <td>${item.TypeofOrganization || ""}</td>
        <td>${item.NameoftheOrganization || ""}</td>
        <td>${item.DateofSharing?.split("T")[0] || ""}</td>
        <td>${item.ParticularofInfoShared || ""}</td>
        <td>${item.PurposeofSharing || ""}</td>
        <td>${item.ModeofSharing || ""}</td>
        <td>${item.TimeofSharing || ""}</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <h2 style="
  text-align:center;
  margin-bottom:5px;
">
  National Fittings Limited
</h2>

<h3 style="
  text-align:center;
  margin-top:0;
  margin-bottom:20px;
  font-weight:600;
">
  UPSI Details Report
</h3>

      <table style="border-collapse:collapse;width:100%;font-size:10px;">
        <thead>
          <tr style="background:#e5e5e5;">
            <th>Name of UPSI</th>
            <th>Info Shared By</th>
            <th>PAN 1</th>
            <th>Capacity 1</th>
            <th>Designation 1</th>
            <th>Info Shared To</th>
            <th>PAN 2</th>
            <th>Capacity 2</th>
            <th>Designation 2</th>
            <th>Organization Type</th>
            <th>Organization</th>
            <th>Date</th>
            <th>Particular</th>
            <th>Purpose</th>
            <th>Mode</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
  `;

  const element = document.createElement("div");
  element.innerHTML = html;

html2pdf()
  .set({
    margin: 0.3,
    filename: "UPSI_Details_Report.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
    },
    jsPDF: {
      unit: "in",
      format: "a2",
      orientation: "landscape",
    },
  })
  .from(element)
  .save()
  .then(() => {
    toast.success("PDF downloaded successfully!");
  })
  .catch((error) => {
    console.error(error);
    toast.error("Failed to download PDF");
  });
};
  

  const convertToExcel = () => {
if (!jsonData || jsonData.length === 0) {
    toast.error("No data available to export");
    return;
}

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Headers from the first object
worksheet.columns = [
  { header: "Name of UPSI", key: "NameoftheUPSI", width: 25 },
  { header: "Info Shared By", key: "InfoSharedBy", width: 25 },
  { header: "PAN Number 1", key: "PANNumber1", width: 20 },
  { header: "Information Shared In Capacity 1", key: "InformationSharedInCapacity1", width: 30 },
  { header: "Designation 1", key: "Designation1", width: 25 },
  { header: "Info Shared To", key: "InfoSharedTo", width: 25 },
  { header: "PAN Number 2", key: "PANNumber2", width: 20 },
  { header: "Information Shared In Capacity 2", key: "InformationSharedInCapacity2", width: 30 },
  { header: "Designation 2", key: "Designation2", width: 30 },
  { header: "Type of Organization", key: "TypeofOrganization", width: 25 },
  { header: "Organization", key: "NameoftheOrganization", width: 30 },
  { header: "Date", key: "DateofSharing", width: 18 },
  { header: "Particular", key: "ParticularofInfoShared", width: 30 },
  { header: "Purpose", key: "PurposeofSharing", width: 30 },
  { header: "Mode", key: "ModeofSharing", width: 20 },
  { header: "Time", key: "TimeofSharing", width: 15 },
];

  // Add each document
  jsonData.forEach((item) => {
    worksheet.addRow({
  ...item,
  DateofSharing: item.DateofSharing
    ? item.DateofSharing.split("T")[0]
    : "",
});
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "data.xlsx");
    toast.success("Excel downloaded successfully!");
  });
};


  async function handleLogout() {
    try {
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

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
        <button type="submit">SUBMIT</button>
      </div>
    </div>

    <div className="row" style={{ marginTop: '20px' }}></div>

<div className="row">
  <div className="col-md-6">
    <button type="button" onClick={generatePdf} className="button downloads-button">
      PDF- file
    </button>
  </div>
</div>

<div className="row" style={{ marginTop: '20px' }}></div>

<div className="row">
  <div className="col-md-6">
    <button type="button" onClick={convertToExcel} className="button excel-button">
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