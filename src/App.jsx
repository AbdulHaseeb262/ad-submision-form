import React, { useState, useEffect } from "react";

/*
  Ad Submission Form
  ------------------
  This component renders a dynamic ad submission form that builds a JSON payload matching
  the unified ad data model. It supports:
  • Dynamic ad type selection (including “Add New Type”)
  • Input fields for title, description, price, dates (with MM-DD-YYYY format)
  • Dynamic arrays for keywords, contact phone numbers/social media, and locations
  • Specialized item detail forms for Real Estate, Car Sales, Job Placement, and Event ads
  • Image upload simulation (using URL.createObjectURL)
  • Inline error validation with the provided CSS styling
  • On submit, the payload is logged and an API call is simulated using fetch.
*/

function App() {
  // State for backend-provided ad types (simulate API call)
  const [adTypes, setAdTypes] = useState([]);
  const [selectedAdType, setSelectedAdType] = useState("");
  const [customAdType, setCustomAdType] = useState("");
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(false);

  // Main form state based on unified JSON structure.
  const [formData, setFormData] = useState({
    id: "",
    ad_type: "",
    title: "",
    description: "",
    price: "",
    date_valid: { from: "", to: "" },
    keywords: [],
    contact: {
      type: "",
      name: "",
      phone_numbers: [""],
      email: "",
      website: "",
      social_media: [""],
    },
    locations: [{ branch: "", address: "", phone_number: "" }],
    items: [],
    notes: "",
    image_url: [],
  });

  // Error state for inline validations
  const [errors, setErrors] = useState({});

  // States for dynamic "items" based on ad type
  const [realEstateDetails, setRealEstateDetails] = useState({
    title: "",
    listing_type: "",
    property_type: "",
    property_type_custom: "",
    status: "Available", // always "Available" per instructions
    address: "",
    price: "",
    details: "",
    agents: "",
  });

  const [vehicleDetails, setVehicleDetails] = useState({
    title: "",
    year: "",
    make: "",
    model: "",
    trim: "",
    mileage: "",
    condition: "",
    price: "",
    notes: "",
  });

  const [jobDetails, setJobDetails] = useState({
    job_type: "",
    title: "",
    company_name: "",
    position: "",
    employment_type: "",
    schedule: "",
    location: "",
    salary: "",
    application_method: "",
    application_details: "",
    skills: "",
    experience: "",
    availability: "",
    expected_pay: "",
  });

  const [eventDetails, setEventDetails] = useState({
    title: "",
    name: "",
    dates: [{ date: "", time: "", location: "" }],
    highlights: [""],
    notes: "",
  });

  // Simulate fetching ad types from backend
  useEffect(() => {
    setTimeout(() => {
      const types = [
        "Company",
        "Specials",
        "Product",
        "Service",
        "Job Placement",
        "Car Sales",
        "General Item",
        "Lost & Found",
        "Event",
        "Real Estate",
        "Other",
        "Add New Type",
      ];
      setAdTypes(types);
    }, 500);
  }, []);

  // Generic change handler for top-level formData fields.
  const handleChange = (e) => {
    const { name, value } = e.target;
    // For nested date_valid fields (from/to)
    if (name.includes("date_valid.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        date_valid: { ...prev.date_valid, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle comma-separated keywords
  const handleKeywordsChange = (e) => {
    const value = e.target.value;
    const keywords = value
      .split(",")
      .map((kw) => kw.trim())
      .filter((kw) => kw);
    setFormData((prev) => ({ ...prev, keywords }));
  };

  // Contact (object) change handlers
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  const handleContactArrayChange = (index, field, value) => {
    const updatedArray = [...formData.contact[field]];
    updatedArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: updatedArray },
    }));
  };

  const addContactArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: [...prev.contact[field], ""] },
    }));
  };

  // Locations change handlers
  const handleLocationChange = (index, field, value) => {
    const updatedLocations = [...formData.locations];
    updatedLocations[index][field] = value;
    setFormData((prev) => ({ ...prev, locations: updatedLocations }));
  };

  const addLocationField = () => {
    setFormData((prev) => ({
      ...prev,
      locations: [
        ...prev.locations,
        { branch: "", address: "", phone_number: "" },
      ],
    }));
  };

  // Handle image upload (simulate URL creation)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      image_url: [...prev.image_url, ...urls],
    }));
  };

  // Handlers for Real Estate details
  const handleRealEstateChange = (e) => {
    const { name, value } = e.target;
    setRealEstateDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Vehicle details
  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Job details
  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Event details (including nested arrays)
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("dates-")) {
      // e.g. "dates-0-date", "dates-0-time", "dates-0-location"
      const parts = name.split("-");
      const idx = parseInt(parts[1], 10);
      const field = parts[2];
      const updatedDates = [...eventDetails.dates];
      updatedDates[idx][field] = value;
      setEventDetails((prev) => ({ ...prev, dates: updatedDates }));
    } else if (name.startsWith("highlights-")) {
      const parts = name.split("-");
      const idx = parseInt(parts[1], 10);
      const updatedHighlights = [...eventDetails.highlights];
      updatedHighlights[idx] = value;
      setEventDetails((prev) => ({ ...prev, highlights: updatedHighlights }));
    } else {
      setEventDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addEventDate = () => {
    setEventDetails((prev) => ({
      ...prev,
      dates: [...prev.dates, { date: "", time: "", location: "" }],
    }));
  };

  const addEventHighlight = () => {
    setEventDetails((prev) => ({
      ...prev,
      highlights: [...prev.highlights, ""],
    }));
  };

  // Handle ad type selection from dropdown.
  const handleAdTypeSelect = (e) => {
    const value = e.target.value;
    if (value === "Add New Type") {
      setShowCustomTypeInput(true);
      setSelectedAdType("");
      setFormData((prev) => ({ ...prev, ad_type: "" }));
    } else {
      setShowCustomTypeInput(false);
      setSelectedAdType(value);
      setFormData((prev) => ({ ...prev, ad_type: value }));
    }
  };

  // Validate required fields and date formats.
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.ad_type) {
      tempErrors.ad_type = "Ad type is required.";
    }
    if (!formData.title) {
      tempErrors.title = "Title is required.";
    }
    if (!formData.description) {
      tempErrors.description = "Description is required.";
    }
    // Regex to match MM-DD-YYYY
    const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/;
    if (formData.date_valid.from && !dateRegex.test(formData.date_valid.from)) {
      tempErrors.date_valid_from = "Date (from) must be in MM-DD-YYYY format.";
    }
    if (formData.date_valid.to && !dateRegex.test(formData.date_valid.to)) {
      tempErrors.date_valid_to = "Date (to) must be in MM-DD-YYYY format.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // On submission, create the final JSON payload and simulate an API call.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let finalPayload = {
      ...formData,
      // Generate a random id if none provided.
      id: formData.id || Math.random().toString(36).substr(2, 9),
    };

    // If a custom ad type is entered, use that value.
    if (showCustomTypeInput && customAdType) {
      finalPayload.ad_type = customAdType;
    }

    // Map specialized "items" based on selected ad type.
    if (selectedAdType === "Real Estate") {
      finalPayload.items = [
        { type: "Property", ...realEstateDetails, status: "Available" },
      ];
    } else if (selectedAdType === "Car Sales") {
      finalPayload.items = [{ type: "Vehicle", ...vehicleDetails }];
    } else if (selectedAdType === "Job Placement") {
      // Convert comma-separated skills into an array.
      const skillsArray = jobDetails.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
      finalPayload.items = [
        { type: "Job", ...jobDetails, skills: skillsArray },
      ];
    } else if (selectedAdType === "Event") {
      finalPayload.items = [{ type: "Event", ...eventDetails }];
    } else {
      // For other ad types, items remain empty or you can extend as needed.
      finalPayload.items = [];
    }

    console.log("Final JSON Payload:", JSON.stringify(finalPayload, null, 2));

    // Simulate an API call to a placeholder URL.
    try {
      const response = await fetch("https://api.example.com/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });
      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1>Ad Submission Form</h1>
        <form onSubmit={handleSubmit}>
          {/* Ad Type Selection */}
          <div className="form-group">
            <select
              name="ad_type"
              value={selectedAdType}
              onChange={handleAdTypeSelect}
              required
            >
              <option value="">Select Ad Type</option>
              {adTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label>Ad Type</label>
            {errors.ad_type && <div className="error">{errors.ad_type}</div>}
          </div>
          {showCustomTypeInput && (
            <div className="form-group">
              <input
                type="text"
                name="custom_ad_type"
                value={customAdType}
                onChange={(e) => setCustomAdType(e.target.value)}
                placeholder="Enter custom ad type"
                required
              />
              <label>Custom Ad Type</label>
            </div>
          )}
          {/* Title */}
          <div className="form-group">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Title</label>
            {errors.title && <div className="error">{errors.title}</div>}
          </div>
          {/* Description */}
          <div className="form-group">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Description</label>
            {errors.description && (
              <div className="error">{errors.description}</div>
            )}
          </div>
          {/* Price */}
          <div className="form-group">
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder=" "
            />
            <label>Price</label>
          </div>
          {/* Date Valid From */}
          <div className="form-group">
            <input
              type="text"
              name="date_valid.from"
              value={formData.date_valid.from}
              onChange={handleChange}
              placeholder="MM-DD-YYYY"
            />
            <label>Date Valid From</label>
            {errors.date_valid_from && (
              <div className="error">{errors.date_valid_from}</div>
            )}
          </div>
          {/* Date Valid To */}
          <div className="form-group">
            <input
              type="text"
              name="date_valid.to"
              value={formData.date_valid.to}
              onChange={handleChange}
              placeholder="MM-DD-YYYY"
            />
            <label>Date Valid To</label>
            {errors.date_valid_to && (
              <div className="error">{errors.date_valid_to}</div>
            )}
          </div>
          {/* Keywords */}
          <div className="form-group">
            <input
              type="text"
              name="keywords"
              onChange={handleKeywordsChange}
              placeholder="Comma separated keywords"
            />
            <label>Keywords</label>
          </div>
          {/* Contact Section */}
          <h2 style={{ color: "#fff", marginBottom: "1rem" }}>
            Contact Details
          </h2>
          {/* Contact Type */}
          <div className="form-group">
            <select
              name="type"
              value={formData.contact.type}
              onChange={handleContactChange}
              required
            >
              <option value="">Select Contact Type</option>
              <option value="Person">Person</option>
              <option value="Business">Business</option>
            </select>
            <label>Contact Type</label>
          </div>
          {/* Contact Name */}
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.contact.name}
              onChange={handleContactChange}
              placeholder=" "
              required
            />
            <label>Contact Name</label>
          </div>
          {/* Contact Phone Numbers */}
          {formData.contact.phone_numbers.map((phone, idx) => (
            <div className="form-group" key={idx}>
              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  handleContactArrayChange(idx, "phone_numbers", e.target.value)
                }
                placeholder="Phone Number"
              />
              <label>Phone Number</label>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addContactArrayField("phone_numbers")}
          >
            + Add Phone Number
          </button>
          {/* Contact Email */}
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.contact.email}
              onChange={handleContactChange}
              placeholder=" "
            />
            <label>Email</label>
          </div>
          {/* Contact Website */}
          <div className="form-group">
            <input
              type="text"
              name="website"
              value={formData.contact.website}
              onChange={handleContactChange}
              placeholder=" "
            />
            <label>Website</label>
          </div>
          {/* Contact Social Media */}
          {formData.contact.social_media.map((social, idx) => (
            <div className="form-group" key={idx}>
              <input
                type="text"
                value={social}
                onChange={(e) =>
                  handleContactArrayChange(idx, "social_media", e.target.value)
                }
                placeholder="Social Media Link"
              />
              <label>Social Media</label>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addContactArrayField("social_media")}
          >
            + Add Social Media
          </button>
          {/* Locations Section */}
          <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Locations</h2>
          {formData.locations.map((loc, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div className="form-group">
                <input
                  type="text"
                  value={loc.branch}
                  onChange={(e) =>
                    handleLocationChange(idx, "branch", e.target.value)
                  }
                  placeholder=" "
                />
                <label>Branch</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={loc.address}
                  onChange={(e) =>
                    handleLocationChange(idx, "address", e.target.value)
                  }
                  placeholder=" "
                />
                <label>Address</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={loc.phone_number}
                  onChange={(e) =>
                    handleLocationChange(idx, "phone_number", e.target.value)
                  }
                  placeholder=" "
                />
                <label>Location Phone Number</label>
              </div>
            </div>
          ))}
          <button type="button" onClick={addLocationField}>
            + Add Location
          </button>
          {/* Dynamic Items Section Based on Ad Type */}
          {selectedAdType === "Real Estate" && (
            <>
              <h2 style={{ color: "#fff", marginBottom: "1rem" }}>
                Real Estate Details
              </h2>
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  value={realEstateDetails.title}
                  onChange={handleRealEstateChange}
                  placeholder=" "
                />
                <label>Property Title</label>
              </div>
              <div className="form-group">
                <select
                  name="listing_type"
                  value={realEstateDetails.listing_type}
                  onChange={handleRealEstateChange}
                >
                  <option value="">Select Listing Type</option>
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Lease">Lease</option>
                </select>
                <label>Listing Type</label>
              </div>
              <div className="form-group">
                <select
                  name="property_type"
                  value={realEstateDetails.property_type}
                  onChange={handleRealEstateChange}
                >
                  <option value="">Select Property Type</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Condo">Condo</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Other">Other</option>
                </select>
                <label>Property Type</label>
              </div>
              {realEstateDetails.property_type === "Other" && (
                <div className="form-group">
                  <input
                    type="text"
                    name="property_type_custom"
                    value={realEstateDetails.property_type_custom}
                    onChange={handleRealEstateChange}
                    placeholder=" "
                  />
                  <label>Custom Property Type</label>
                </div>
              )}
              <div className="form-group">
                <input
                  type="text"
                  name="address"
                  value={realEstateDetails.address}
                  onChange={handleRealEstateChange}
                  placeholder=" "
                />
                <label>Property Address</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="price"
                  value={realEstateDetails.price}
                  onChange={handleRealEstateChange}
                  placeholder=" "
                />
                <label>Property Price</label>
              </div>
              <div className="form-group">
                <textarea
                  name="details"
                  value={realEstateDetails.details}
                  onChange={handleRealEstateChange}
                  placeholder=" "
                />
                <label>Property Details</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="agents"
                  value={realEstateDetails.agents}
                  onChange={handleRealEstateChange}
                  placeholder=" "
                />
                <label>Property Agents</label>
              </div>
            </>
          )}
          {selectedAdType === "Car Sales" && (
            <>
              <h2 style={{ color: "#fff", marginBottom: "1rem" }}>
                Vehicle Details
              </h2>
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  value={vehicleDetails.title}
                  onChange={handleVehicleChange}
                  placeholder=" "
                />
                <label>Vehicle Title</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="year"
                  value={vehicleDetails.year}
                  onChange={handleVehicleChange}
                  placeholder="Year"
                />
                <label>Year</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="make"
                  value={vehicleDetails.make}
                  onChange={handleVehicleChange}
                  placeholder=" "
                />
                <label>Make</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="model"
                  value={vehicleDetails.model}
                  onChange={handleVehicleChange}
                  placeholder=" "
                />
                <label>Model</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="trim"
                  value={vehicleDetails.trim}
                  onChange={handleVehicleChange}
                  placeholder=" "
                />
                <label>Trim</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="mileage"
                  value={vehicleDetails.mileage}
                  onChange={handleVehicleChange}
                  placeholder=" "
                />
                <label>Mileage</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="condition"
                  value={vehicleDetails.condition}
                  onChange={handleVehicleChange}
                  placeholder=" "
                />
                <label>Condition</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="price"
                  value={vehicleDetails.price}
                  onChange={handleVehicleChange}
                  placeholder=" "
                />
                <label>Price</label>
              </div>
              <div className="form-group">
                <textarea
                  name="notes"
                  value={vehicleDetails.notes}
                  onChange={handleVehicleChange}
                  placeholder=" "
                />
                <label>Notes</label>
              </div>
            </>
          )}
          {selectedAdType === "Job Placement" && (
            <>
              <h2 style={{ color: "#fff", marginBottom: "1rem" }}>
                Job Placement Details
              </h2>
              <div className="form-group">
                <select
                  name="job_type"
                  value={jobDetails.job_type}
                  onChange={handleJobChange}
                >
                  <option value="">Select Job Type</option>
                  <option value="Employer">Employer</option>
                  <option value="Job Seeker">Job Seeker</option>
                </select>
                <label>Job Type</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  value={jobDetails.title}
                  onChange={handleJobChange}
                  placeholder=" "
                />
                <label>Job Title</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="company_name"
                  value={jobDetails.company_name}
                  onChange={handleJobChange}
                  placeholder=" "
                />
                <label>Company Name</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="position"
                  value={jobDetails.position}
                  onChange={handleJobChange}
                  placeholder=" "
                />
                <label>Position</label>
              </div>
              <div className="form-group">
                <select
                  name="employment_type"
                  value={jobDetails.employment_type}
                  onChange={handleJobChange}
                >
                  <option value="">Select Employment Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
                <label>Employment Type</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="schedule"
                  value={jobDetails.schedule}
                  onChange={handleJobChange}
                  placeholder=" "
                />
                <label>Schedule</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="location"
                  value={jobDetails.location}
                  onChange={handleJobChange}
                  placeholder=" "
                />
                <label>Job Location</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="salary"
                  value={jobDetails.salary}
                  onChange={handleJobChange}
                  placeholder=" "
                />
                <label>Salary</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="application_method"
                  value={jobDetails.application_method}
                  onChange={handleJobChange}
                  placeholder=" "
                />
                <label>Application Method</label>
              </div>
              <div className="form-group">
                <textarea
                  name="application_details"
                  value={jobDetails.application_details}
                  onChange={handleJobChange}
                  placeholder=" "
                />
                <label>Application Details</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="skills"
                  value={jobDetails.skills}
                  onChange={handleJobChange}
                  placeholder="Comma separated skills"
                />
                <label>Skills</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="experience"
                  value={jobDetails.experience}
                  onChange={handleJobChange}
                  placeholder=" "
                />
                <label>Experience</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="availability"
                  value={jobDetails.availability}
                  onChange={handleJobChange}
                  placeholder=" "
                />
                <label>Availability</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="expected_pay"
                  value={jobDetails.expected_pay}
                  onChange={handleJobChange}
                  placeholder=" "
                />
                <label>Expected Pay</label>
              </div>
            </>
          )}
          {selectedAdType === "Event" && (
            <>
              <h2 style={{ color: "#fff", marginBottom: "1rem" }}>
                Event Details
              </h2>
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  value={eventDetails.title}
                  onChange={handleEventChange}
                  placeholder=" "
                />
                <label>Event Title</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={eventDetails.name}
                  onChange={handleEventChange}
                  placeholder=" "
                />
                <label>Event Name</label>
              </div>
              {eventDetails.dates.map((d, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div className="form-group">
                    <input
                      type="text"
                      name={`dates-${idx}-date`}
                      value={d.date}
                      onChange={handleEventChange}
                      placeholder="MM-DD-YYYY"
                    />
                    <label>Event Date</label>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name={`dates-${idx}-time`}
                      value={d.time}
                      onChange={handleEventChange}
                      placeholder="Time"
                    />
                    <label>Event Time</label>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name={`dates-${idx}-location`}
                      value={d.location}
                      onChange={handleEventChange}
                      placeholder=" "
                    />
                    <label>Event Location</label>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addEventDate}>
                + Add Event Date
              </button>
              {eventDetails.highlights.map((h, idx) => (
                <div className="form-group" key={idx}>
                  <input
                    type="text"
                    name={`highlights-${idx}`}
                    value={h}
                    onChange={handleEventChange}
                    placeholder="Highlight"
                  />
                  <label>Highlight</label>
                </div>
              ))}
              <button type="button" onClick={addEventHighlight}>
                + Add Event Highlight
              </button>
              <div className="form-group">
                <textarea
                  name="notes"
                  value={eventDetails.notes}
                  onChange={handleEventChange}
                  placeholder=" "
                />
                <label>Event Notes</label>
              </div>
            </>
          )}
          {/* Image Upload */}
          <div className="form-group">
            <input type="file" multiple onChange={handleImageUpload} />
            <label>Upload Images</label>
            <div className="image-preview">
              {formData.image_url.map((url, idx) => (
                <img key={idx} src={url} alt={`preview-${idx}`} />
              ))}
            </div>
          </div>
          {/* Additional Notes */}
          <div className="form-group">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder=" "
            />
            <label>Additional Notes</label>
          </div>
          <button type="submit" className="submit-button">
            Submit Ad
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
