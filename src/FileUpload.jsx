import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from "./Table";
import "./index.css";

const perPage = 20;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("initial");
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [city, setCity] = useState(""); // Add city state variables
  const [state, setState] = useState("");
  const [zipAddress, setZipAddress] = useState();
  const [countyAddress, setCountyAddress] = useState("");
  const [propertyType, setPropertyType] = useState(""); // Add city state variables
  const [propertySubType, setPropertySubType] = useState("");
  const [selectedSoldDate, setSelectedSoldDate] = useState(null);
  const [mlsStatus, setMlsStatus] = useState("");
  const [dateSelectionMode, setDateSelectionMode] = useState("single");
  const [selectedFirstEntryDate, setFirstSelectedEntryDate] = useState(null);
  const [selectedSecondEntryDate, setSecondSelectedEntryDate] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [jobId, setJobId] = useState();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);

  const handleDateSelectionModeChange = (mode) => {
    setDateSelectionMode(mode);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };
  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };
  const handlePropertySubTypeChange = (e) => {
    setPropertySubType(e.target.value);
  };
  const handleZipAddressChange = (e) => {
    setZipAddress(e.target.value);
  };
  const handleCountyAddressChange = (e) => {
    setCountyAddress(e.target.value);
  };

  const handleSoldDateChange = (date) => {
    setSelectedSoldDate(date);
  };
  const handleMlsStatus = (e) => {
    setMlsStatus(e.target.value);
  };
  const handleFirstEntryDate = (date) => {
    setFirstSelectedEntryDate(date);
  };
  const handleSecondEntryDate = (date) => {
    setSecondSelectedEntryDate(date);
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;

      if (fileType === "text/csv") {
        setStatus("initial");
        setFile(selectedFile);
      } else {
        setStatus("invalid_file");
        console.error("Only CSV files are allowed for upload.");
      }
    }
  };

  const handleUpload = async () => {
    if (file) {
      setStatus("uploading");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = await fetch("http://localhost:3001/upload", {
          method: "POST",
          body: formData,
        });

        if (!result.ok) {
          throw new Error(`HTTP error! Status: ${result.status}`);
        }

        const responseData = await result.json();
        if (responseData.success) {
          setTotalRows(responseData.totalRows);
          setStatus("success");
          setCity("");
          setState("");
          setJobId(responseData.jobId);
        } else {
          if (
            responseData.errorType.includes("Columns are undefined or empty")
          ) {
            setStatus("fail_unknown_column");
          } else {
            setStatus("fail");
          }
          if (responseData.errorType.includes("Duplicate entry")) {
            setStatus("fail_duplicate_entry");
          } else {
            setStatus("fail");
          }
        }
      } catch (error) {
        console.error(error);
        setStatus("fail");
      }
    }
  };

  const handleGetData = async () => {
    try {
      let soldDate = selectedSoldDate
        ? selectedSoldDate.toLocaleDateString("en-GB")
        : "";
      let formattedStartDate = selectedFirstEntryDate
        ? selectedFirstEntryDate.toLocaleDateString("en-GB")
        : "";
      let formattedEndDate = selectedSecondEntryDate
        ? selectedSecondEntryDate.toLocaleDateString("en-GB")
        : "";
      console.log("solddate", soldDate);
      let url = `http://localhost:3001/getData?page=${currentPage}&pageSize=${perPage}`;
      if (city) {
        url += `&address_city=${city}`;
      }
      if (state) {
        url += `&address_state=${state}`;
      }
      if (propertyType) {
        url += `&mls_propertyType=${propertyType}`;
      }
      if (propertySubType) {
        url += `&mls_propertySubtype=${propertySubType}`;
      }
      if (zipAddress) {
        url += `&address_zip=${zipAddress}`;
      }
      if (countyAddress) {
        url += `&address_county=${countyAddress}`;
      }
      if (soldDate) {
        url += `&mls_soldDate=${soldDate}`;
      }
      if (mlsStatus) {
        url += `&mls_status=${mlsStatus}`;
      }
      if (formattedStartDate && formattedEndDate) {
        url += `&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      } else if (formattedStartDate) {
        url += `&startDate=${formattedStartDate}`;
      }
      console.log("url", url);
      const result = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) {
        throw new Error(`HTTP error! Status: ${result.status}`);
      }

      const responseData = await result.json();
      setData(responseData.data);
      setTotalItems(responseData.totalItems);
      setStatus("success");
      console.log("Data fetched successfully. Current page reset to 1.");
    } catch (error) {
      console.error(error);
      setStatus("fail");
    }
  };
  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/exportCSV", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setLoading(false);
    } catch (error) {
      console.error("Error exporting data:", error.message);
      setLoading(false);
    }
  };

  const handleSearchButtonClick = async () => {
    setCurrentPage(1);
    setLoading(true); // Set loading state to true
    await handleGetData();
    setLoading(false); // Set loading state to false after fetching data
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (jobId) {
        const result = await fetch(
          `http://localhost:3001/progress?jobId=${jobId}`,
          {
            method: "GET",
          }
        );

        const json = await result.json();
        setProgress(json.progress);
        if (json.progress === 100) {
          setJobId(null);
          clearInterval(interval);
        }
      }
    }, 1000);
  }, [jobId]);

  return (
    <>
      <div className="input-group mt-2 text-center">
        <label htmlFor="file" className="drag-and-drop-container"></label>
        <input id="file" type="file" name="file" onChange={handleFileChange} />
      </div>
      {file && (
        <section className="bg-gray-100 p-4 rounded-md w-full max-w-md mx-auto text-center">
          <h2 className="text-lg font-semibold mb-2">File details:</h2>
          <ul className="flex flex-col items-center">
            <li className="mb-2">Name: {file.name}</li>
            <li className="mb-2">Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
            <li>Total rows: {totalRows}</li>
            <li>Processed rows: {progress.rowsProcessed}</li>
            <p style={{ marginTop: "5px" }}>Progress: {progress.progress}%</p>
          </ul>
        </section>
      )}

      {file && (
        <div className="flex justify-center">
          <button
            onClick={handleUpload}
            className="submit text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Upload
          </button>
          <p className="ml-4">
            {" "}
            <Result status={status} data={data} />
          </p>
        </div>
      )}
      <section>
        <div className="grid grid-cols-5 place-content-start">
          <div className="m-6">
            <label className="mb-2 text-gray-700" htmlFor="city">
              Select Entry Date:
            </label>
            <div className="flex items-center">
              <div className="mr-4">
                <input
                  type="radio"
                  id="singleDate"
                  name="dateSelectionMode"
                  value="single"
                  checked={dateSelectionMode === "single"}
                  onChange={() => handleDateSelectionModeChange("single")}
                />
                <label className="ml-2 text-gray-700" htmlFor="singleDate">
                  Single Date
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="dateRange"
                  name="dateSelectionMode"
                  value="range"
                  checked={dateSelectionMode === "range"}
                  onChange={() => handleDateSelectionModeChange("range")}
                />
                <label className="ml-2 text-gray-700" htmlFor="dateRange">
                  Date Range
                </label>
              </div>
            </div>

            {dateSelectionMode === "single" ? (
              <DatePicker
                selected={selectedFirstEntryDate}
                onChange={handleFirstEntryDate}
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText="Select a date"
              />
            ) : (
              <div className="grid place-content-start">
                <div className="mr-4">
                  <label className="text-gray-700" htmlFor="startDate">
                    Start Date:
                  </label>
                  <DatePicker
                    id="startDate"
                    selected={selectedFirstEntryDate}
                    onChange={handleFirstEntryDate}
                    selectsStart
                    startDate={selectedFirstEntryDate}
                    dateFormat="dd/MM/yyyy"
                    isClearable
                    placeholderText="Select start date"
                  />
                </div>

                <div>
                  <label className="text-gray-700" htmlFor="endDate">
                    End Date:
                  </label>
                  <DatePicker
                    id="endDate"
                    selected={selectedSecondEntryDate}
                    onChange={handleSecondEntryDate}
                    selectsEnd
                    dateFormat="dd/MM/yyyy"
                    endDate={selectedSecondEntryDate}
                    isClearable
                    placeholderText="Select end date"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="m-8">
            <label className="mb-2 text-gray-700" htmlFor="city">
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={city}
              onChange={handleCityChange}
              className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <label className="mb-2 text-gray-700" htmlFor="state">
              State:
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={state}
              onChange={handleStateChange}
              className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="m-8">
            <label className="mb-2 text-gray-700" htmlFor="propertyType">
              Property Type:
            </label>
            <input
              type="text"
              id="propertyType"
              name="propertyType"
              value={propertyType}
              onChange={handlePropertyTypeChange}
              className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            />
            <label className="mb-2 text-gray-700" htmlFor="propertySubType">
              Property SubType:
            </label>
            <input
              type="text"
              id="propertySubType"
              name="propertySubType"
              value={propertySubType}
              onChange={handlePropertySubTypeChange}
              className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            />
          </div>
          <div className="m-8">
            <label className="mb-2 text-gray-700" htmlFor="zipAddress">
              Zip Address:
            </label>
            <input
              type="number"
              min={0}
              id="zipAddress"
              name="zipAddress"
              value={zipAddress}
              onChange={handleZipAddressChange}
              className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            />
            <label className="mb-2 text-gray-700" htmlFor="countyAddress">
              County Address:
            </label>
            <input
              type="text"
              id="countyAddress"
              name="countyAddress"
              value={countyAddress}
              onChange={handleCountyAddressChange}
              className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            />
          </div>
          <div className="m-8">
            <label className="mb-2 text-gray-700" htmlFor="city">
              Select Sold Date:
            </label>
            <DatePicker
              selected={selectedSoldDate}
              onChange={handleSoldDateChange}
              dateFormat="dd/MM/yyyy"
              isClearable
              placeholderText="Select a date"
            />
            <br />
            <label className="text-gray-700 mt-16" htmlFor="mlsStatus">
              MLS Status:
            </label>
            <input
              type="text"
              id="mlsStatus"
              name="mlsStatus"
              value={mlsStatus}
              onChange={handleMlsStatus}
              className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            />
          </div>
          <button
            disabled={loading}
            onClick={handleSearchButtonClick}
            className="ml-96 search-btn text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-2 w-full"
          >
            Search
          </button>
          <button
            disabled={loading}
            onClick={handleExport}
            className="ml-96 search-btn text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-2 w-full"
          >
            Export
          </button>
        </div>
      </section>

      {loading ? (
         <div className="spinner-container">
         <div className="spinner"></div>
       </div>
      ) : (
        data && (
          <Table
            data={data}
            perPage={perPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={totalItems}
          />
        )
      )}
    </>
  );
};

// ... (rest of the code)

const Result = ({ status, data }) => {
  if (status === "success") {
    return (
      <div>
        <p>✅ File uploaded successfully!</p>
      </div>
    );
  } else if (status === "fail") {
    return (
      <div>
        <p>❌ File upload failed!</p>
      </div>
    );
  } else if (status === "fail_unknown_column") {
    return (
      <div>
        <p>❌ Error uploading file: Unknown column in database</p>
      </div>
    );
  } else if (status === "uploading") {
    return <p>⏳ Uploading selected file...</p>;
  } else if (status === "invalid_file") {
    return <p>❌ Invalid File Format: Only CSV files supported</p>;
  } else if (status === "fail_duplicate_entry") {
    return <p>❌ Duplicate: address_houseNumber, address_street,mls_status</p>;
  } else {
    return null;
  }
};

export default FileUpload;
