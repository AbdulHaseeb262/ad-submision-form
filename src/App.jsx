// App.js
// This React application implements a backend-ready advertisement submission form.
// It dynamically renders different form fields based on the selected form type,
// validates required fields, handles image uploads (with preview via object URLs),
// and simulates an API call on submission.
//
// To run this project:
// 1. npx create-react-app ad-submission-form
// 2. Replace src/App.js and src/index.css with the code below.
// 3. Run "npm install" and "npm start" in your project directory.

import React, { useState } from "react";
import "./index.css";

// Define the available form types
const FORM_TYPES = {
  GENERAL: "General Ad",
  CONTACT: "Contact",
  LOCATIONS: "Locations",
  REAL_ESTATE: "Real Estate",
  SPECIALS: "Specials",
  PRODUCTS: "Products",
  CAR_SALES: "Car Sales",
  JOBS: "Jobs",
  EVENTS: "Events",
};

// Initial form state for each form type following the provided schema
const initialFormState = {
  general: {
    id: "", // auto-generated on submission if needed
    ad_type: "",
    custom_ad_type: "",
    title: "",
    description: "",
    price: "",
    date_valid_from: "",
    date_valid_to: "",
    image_url: [],
    industry: "",
    category: "",
    sub_category: "",
    sub_sub_category: "",
    keywords: "",
    notes: "",
  },
  contact: {
    id: "",
    ad_id: "",
    type: "",
    name: "",
    phone_numbers: "",
    email: "",
    website: "",
    social_media: "",
  },
  locations: {
    id: "",
    ad_id: "",
    branch: "",
    address: "",
    phone_number: "",
  },
  realEstate: {
    id: "",
    ad_id: "",
    listing_type: "",
    property_type: "",
    status: "",
    address: "",
    price: "",
    square_footage: "",
    lot_size: "",
    bedrooms: "",
    bathrooms: "",
    floor_level: "",
    furnished: "",
    utilities_included: "",
    customizable: "",
    office_rooms: "",
    parking_availability: "",
    lease_term: "",
    amenities: "",
    condition: "",
    details: "",
    agents: "",
    notes: "",
  },
  specials: {
    id: "",
    ad_id: "",
    department: "",
    product: "",
    price: "",
  },
  products: {
    id: "",
    ad_id: "",
    name: "",
    description: "",
    price: "",
  },
  carSales: {
    id: "",
    ad_id: "",
    year: "",
    make: "",
    model: "",
    mileage: "",
    condition: "",
    price: "",
  },
  jobs: {
    id: "",
    ad_id: "",
    job_type: "",
    company_name: "",
    employment_type: "",
    schedule: "",
    salary: "",
    application_method: "",
    application_details: "",
    application_link: "",
    skills: "",
    experience: "",
  },
  events: {
    id: "",
    ad_id: "",
    name: "",
    highlights: "",
    dates: "",
    location: "",
  },
};

const AdForm = () => {
  // Current selected form type
  const [currentForm, setCurrentForm] = useState(FORM_TYPES.GENERAL);
  // Form data for all form types
  const [formData, setFormData] = useState(initialFormState);
  // For inline error messages on required fields
  const [errors, setErrors] = useState({});
  // For image URLs from file uploads (only applicable for General Ad)
  const [imageUrls, setImageUrls] = useState([]);
  // Message from simulated API call
  const [apiMessage, setApiMessage] = useState("");

  // Handle input changes for the currently selected form type
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Adjust key based on form type; note that for multi-word types we simplify the key
    const key =
      currentForm === FORM_TYPES.REAL_ESTATE
        ? "realEstate"
        : currentForm === FORM_TYPES.CAR_SALES
        ? "carSales"
        : currentForm.toLowerCase().replace(" ", "");
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [name]: value,
      },
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle image upload: simulate upload and generate preview URLs
  const handleImageUpload = (e) => {
    const files = e.target.files;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImageUrls((prev) => [...prev, ...urls]);
  };

  // Validate required fields for the current form type
  const validateForm = () => {
    const key =
      currentForm === FORM_TYPES.REAL_ESTATE
        ? "realEstate"
        : currentForm === FORM_TYPES.CAR_SALES
        ? "carSales"
        : currentForm.toLowerCase().replace(" ", "");
    const currentData = formData[key];
    let newErrors = {};

    // Add validations for each form type as needed
    if (currentForm === FORM_TYPES.GENERAL) {
      if (!currentData.title) newErrors.title = "Title is required";
      if (!currentData.description)
        newErrors.description = "Description is required";
    }
    if (currentForm === FORM_TYPES.CONTACT) {
      if (!currentData.name) newErrors.name = "Name is required";
      if (!currentData.email) newErrors.email = "Email is required";
    }
    if (currentForm === FORM_TYPES.LOCATIONS) {
      if (!currentData.branch) newErrors.branch = "Branch is required";
      if (!currentData.address) newErrors.address = "Address is required";
    }
    if (currentForm === FORM_TYPES.REAL_ESTATE) {
      if (!currentData.listing_type)
        newErrors.listing_type = "Listing type is required";
      if (!currentData.address) newErrors.address = "Address is required";
    }
    if (currentForm === FORM_TYPES.SPECIALS) {
      if (!currentData.department)
        newErrors.department = "Department is required";
    }
    if (currentForm === FORM_TYPES.PRODUCTS) {
      if (!currentData.name) newErrors.name = "Product name is required";
      if (!currentData.description)
        newErrors.description = "Description is required";
    }
    if (currentForm === FORM_TYPES.CAR_SALES) {
      if (!currentData.make) newErrors.make = "Make is required";
      if (!currentData.model) newErrors.model = "Model is required";
    }
    if (currentForm === FORM_TYPES.JOBS) {
      if (!currentData.job_type) newErrors.job_type = "Job type is required";
      if (!currentData.company_name)
        newErrors.company_name = "Company name is required";
    }
    if (currentForm === FORM_TYPES.EVENTS) {
      if (!currentData.name) newErrors.name = "Event name is required";
      if (!currentData.dates) newErrors.dates = "Event dates are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission: validate, create JSON payload, and simulate an API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Generate an auto-generated ID if not already set
    const generateId = () => new Date().getTime().toString();

    const key =
      currentForm === FORM_TYPES.REAL_ESTATE
        ? "realEstate"
        : currentForm === FORM_TYPES.CAR_SALES
        ? "carSales"
        : currentForm.toLowerCase().replace(" ", "");

    let payload = { ...formData };
    if (!payload[key].id) {
      payload[key].id = generateId();
    }
    if (currentForm === FORM_TYPES.GENERAL) {
      payload.general.image_url = imageUrls;
    }
    const jsonPayload = JSON.stringify(payload[key], null, 2);
    console.log("Submission Payload:", jsonPayload);

    setApiMessage("Submitting...");
    try {
      const response = await fetch("https://api.example.com/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonPayload,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setApiMessage("Advertisement submitted successfully!");
    } catch (error) {
      setApiMessage("Submission failed. Please try again.");
      console.error("Submission error:", error);
    }
  };

  // ---------- Dynamic Form Render Functions with Updated Floating Label Structure ----------

  // General Ad Form
  const renderGeneralForm = () => {
    const data = formData.general;
    return (
      <div className="form-section">
        <div className="form-group">
          <select
            name="ad_type"
            value={data.ad_type}
            onChange={handleInputChange}
          >
            <option value="">Select Ad Type</option>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
            <option value="Other">Other</option>
          </select>
          <label>Ad Type</label>
        </div>
        {data.ad_type === "Other" && (
          <div className="form-group">
            <input
              type="text"
              name="custom_ad_type"
              value={data.custom_ad_type}
              placeholder=" "
              onChange={handleInputChange}
            />
            <label>Custom Ad Type</label>
          </div>
        )}
        <div className="form-group">
          <input
            type="text"
            name="title"
            value={data.title}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Title</label>
          {errors.title && <div className="error">{errors.title}</div>}
        </div>
        <div className="form-group">
          <textarea
            name="description"
            value={data.description}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Description</label>
          {errors.description && (
            <div className="error">{errors.description}</div>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="price"
            value={data.price}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Price</label>
        </div>
        <div className="form-group">
          <input
            type="date"
            name="date_valid_from"
            value={data.date_valid_from}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Date Valid From</label>
        </div>
        <div className="form-group">
          <input
            type="date"
            name="date_valid_to"
            value={data.date_valid_to}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Date Valid To</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="industry"
            value={data.industry}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Industry</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="category"
            value={data.category}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Category</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="sub_category"
            value={data.sub_category}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Sub Category</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="sub_sub_category"
            value={data.sub_sub_category}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Sub Sub Category</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="keywords"
            value={data.keywords}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Keywords</label>
        </div>
        <div className="form-group">
          <textarea
            name="notes"
            value={data.notes}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Notes</label>
        </div>
      </div>
    );
  };

  // Contact Form
  const renderContactForm = () => {
    const data = formData.contact;
    return (
      <div className="form-section">
        <div className="form-group">
          <input
            type="text"
            name="type"
            value={data.type}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Type</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={data.name}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Name</label>
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="phone_numbers"
            value={data.phone_numbers}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Phone Numbers</label>
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={data.email}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Email</label>
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="website"
            value={data.website}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Website</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="social_media"
            value={data.social_media}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Social Media</label>
        </div>
      </div>
    );
  };

  // Locations Form
  const renderLocationsForm = () => {
    const data = formData.locations;
    return (
      <div className="form-section">
        <div className="form-group">
          <input
            type="text"
            name="branch"
            value={data.branch}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Branch</label>
          {errors.branch && <div className="error">{errors.branch}</div>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="address"
            value={data.address}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Address</label>
          {errors.address && <div className="error">{errors.address}</div>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="phone_number"
            value={data.phone_number}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Phone Number</label>
        </div>
      </div>
    );
  };

  // Real Estate Form
  const renderRealEstateForm = () => {
    const data = formData.realEstate;
    return (
      <div className="form-section">
        <div className="form-group">
          <input
            type="text"
            name="listing_type"
            value={data.listing_type}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Listing Type</label>
          {errors.listing_type && (
            <div className="error">{errors.listing_type}</div>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="property_type"
            value={data.property_type}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Property Type</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="status"
            value={data.status}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Status</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="address"
            value={data.address}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Address</label>
          {errors.address && <div className="error">{errors.address}</div>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="price"
            value={data.price}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Price</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="square_footage"
            value={data.square_footage}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Square Footage</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="lot_size"
            value={data.lot_size}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Lot Size</label>
        </div>
        <div className="form-group">
          <input
            type="number"
            name="bedrooms"
            value={data.bedrooms}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Bedrooms</label>
        </div>
        <div className="form-group">
          <input
            type="number"
            name="bathrooms"
            value={data.bathrooms}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Bathrooms</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="floor_level"
            value={data.floor_level}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Floor Level</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="furnished"
            value={data.furnished}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Furnished</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="utilities_included"
            value={data.utilities_included}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Utilities Included</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="customizable"
            value={data.customizable}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Customizable</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="office_rooms"
            value={data.office_rooms}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Office Rooms</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="parking_availability"
            value={data.parking_availability}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Parking Availability</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="lease_term"
            value={data.lease_term}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Lease Term</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="amenities"
            value={data.amenities}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Amenities</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="condition"
            value={data.condition}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Condition</label>
        </div>
        <div className="form-group">
          <textarea
            name="details"
            value={data.details}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Details</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="agents"
            value={data.agents}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Agents</label>
        </div>
        <div className="form-group">
          <textarea
            name="notes"
            value={data.notes}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Notes</label>
        </div>
      </div>
    );
  };

  // Specials Form
  const renderSpecialsForm = () => {
    const data = formData.specials;
    return (
      <div className="form-section">
        <div className="form-group">
          <input
            type="text"
            name="department"
            value={data.department}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Department</label>
          {errors.department && (
            <div className="error">{errors.department}</div>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="product"
            value={data.product}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Product</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="price"
            value={data.price}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Price</label>
        </div>
      </div>
    );
  };

  // Products Form
  const renderProductsForm = () => {
    const data = formData.products;
    return (
      <div className="form-section">
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={data.name}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Name</label>
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <textarea
            name="description"
            value={data.description}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Description</label>
          {errors.description && (
            <div className="error">{errors.description}</div>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="price"
            value={data.price}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Price</label>
        </div>
      </div>
    );
  };

  // Car Sales Form
  const renderCarSalesForm = () => {
    const data = formData.carSales;
    return (
      <div className="form-section">
        <div className="form-group">
          <input
            type="text"
            name="year"
            value={data.year}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Year</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="make"
            value={data.make}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Make</label>
          {errors.make && <div className="error">{errors.make}</div>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="model"
            value={data.model}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Model</label>
          {errors.model && <div className="error">{errors.model}</div>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="mileage"
            value={data.mileage}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Mileage</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="condition"
            value={data.condition}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Condition</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="price"
            value={data.price}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Price</label>
        </div>
      </div>
    );
  };

  // Jobs Form
  const renderJobsForm = () => {
    const data = formData.jobs;
    return (
      <div className="form-section">
        <div className="form-group">
          <input
            type="text"
            name="job_type"
            value={data.job_type}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Job Type</label>
          {errors.job_type && <div className="error">{errors.job_type}</div>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="company_name"
            value={data.company_name}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Company Name</label>
          {errors.company_name && (
            <div className="error">{errors.company_name}</div>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="employment_type"
            value={data.employment_type}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Employment Type</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="schedule"
            value={data.schedule}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Schedule</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="salary"
            value={data.salary}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Salary</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="application_method"
            value={data.application_method}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Application Method</label>
        </div>
        <div className="form-group">
          <textarea
            name="application_details"
            value={data.application_details}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Application Details</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="application_link"
            value={data.application_link}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Application Link</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="skills"
            value={data.skills}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Skills</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="experience"
            value={data.experience}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Experience</label>
        </div>
      </div>
    );
  };

  // Events Form
  const renderEventsForm = () => {
    const data = formData.events;
    return (
      <div className="form-section">
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={data.name}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Name</label>
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <textarea
            name="highlights"
            value={data.highlights}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Highlights</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="dates"
            value={data.dates}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Dates</label>
          {errors.dates && <div className="error">{errors.dates}</div>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="location"
            value={data.location}
            placeholder=" "
            onChange={handleInputChange}
          />
          <label>Location</label>
        </div>
      </div>
    );
  };

  // Render the correct form fields based on the selected form type
  const renderFormFields = () => {
    switch (currentForm) {
      case FORM_TYPES.GENERAL:
        return renderGeneralForm();
      case FORM_TYPES.CONTACT:
        return renderContactForm();
      case FORM_TYPES.LOCATIONS:
        return renderLocationsForm();
      case FORM_TYPES.REAL_ESTATE:
        return renderRealEstateForm();
      case FORM_TYPES.SPECIALS:
        return renderSpecialsForm();
      case FORM_TYPES.PRODUCTS:
        return renderProductsForm();
      case FORM_TYPES.CAR_SALES:
        return renderCarSalesForm();
      case FORM_TYPES.JOBS:
        return renderJobsForm();
      case FORM_TYPES.EVENTS:
        return renderEventsForm();
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <h1>Advertisement Submission Form</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Form Type Selection */}
          <div className="form-group">
            <select
              value={currentForm}
              onChange={(e) => {
                setCurrentForm(e.target.value);
                setApiMessage("");
              }}
            >
              {Object.values(FORM_TYPES).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label>Select Form Type</label>
          </div>

          {/* Render dynamic form fields */}
          {renderFormFields()}

          {/* Image Upload Section (for General Ad) */}
          <div className="form-section">
            <h3>Images</h3>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="image-preview">
              {imageUrls.map((url) => (
                <img key={url} src={url} alt="Upload preview" />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Submit Advertisement
          </button>
          {apiMessage && <p>{apiMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdForm;
