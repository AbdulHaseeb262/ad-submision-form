import { useState, useEffect } from "react";

// Initial structure for the ad data.
const initialAdData = {
  id: "",
  ad_type: "",
  title: "",
  description: "",
  ad_valid_from: "",
  ad_valid_to: "",
  image_url: [],
  industry: "",
  category: "",
  sub_category: "",
  sub_sub_category: "",
  keywords: [],
  notes: "",
  contact: {
    type: "",
    name: "",
    phone_numbers: [""],
    email: "",
    website: "",
    social_media: [""],
    addresses: [],
  },
  locations: [{ branch: "", address: "", phone_number: "", email: "" }],
  items: [],
};

// Returns a default item object based on the selected ad type.
function getDefaultItem(adType) {
  switch (adType) {
    case "Real Estate":
      return {
        type: "Property",
        // Title removed.
        listing_type: "", // Manual entry now.
        property_type: "",
        custom_property_type: "",
        status: "Available",
        property_location: "",
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
        zoning_information: "",
        preferred_tenants: "",
      };
    case "Car Sales":
      return {
        type: "Vehicle",
        listing_type: "",
        year: "",
        make: "",
        model: "",
        mileage: "",
        condition: "",
        price: "",
      };
    case "Job Placement":
      return {
        type: "Job",
        job_type: "",
        ad_purpose: "",
        employment_type: "",
        full_part: "",
        schedule: "",
        salary: "",
        application_method: "",
        application_link: "",
        perks: "",
        skills: "",
      };
    case "Event":
      return {
        type: "Event",
        ad_id: "",
        name: "",
        purpose: "",
        dates: [{ date: "", time: "" }],
        highlights: "",
      };
    case "Specials":
      return {
        department: "",
        brand: "",
        product: "",
        uom: "",
        SalePrice: "",
        RegPrice: "",
        specials_end_date: "",
        image_url: "",
      };
    case "Product":
      return {
        ad_purpose: "",
        title: "",
        description: "",
        price: "",
        image_url: "",
      };
    case "Service":
      return {
        ad_purpose: "",
        title: "",
        description: "",
        Service: "",
      };
    default:
      return {
        ad_purpose: "",
        ad_type: "",
        name: "",
        description: "",
        price: "",
        category: "",
        image_url: "",
      };
  }
}

function DynamicAdForm() {
  const [adData, setAdData] = useState(initialAdData);
  const [adTypes, setAdTypes] = useState([]);
  const [showAdTypeDropdown, setShowAdTypeDropdown] = useState(false);

  // Define ad types that require separate location fields.
  // Here "Real Estate" is the only one that shows its own locations.
  const locationAdTypes = ["Real Estate"];

  // Simulate fetching ad types.
  useEffect(() => {
    const fetchAdTypes = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAdTypes([
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
      ]);
    };
    fetchAdTypes();
  }, []);

  // When the ad type changes, clear items.
  const handleAdTypeSelect = (selectedType) => {
    if (selectedType === "Add New Type") {
      const customType = prompt("Enter new ad type:");
      if (customType) {
        setAdData({ ...adData, ad_type: customType, items: [] });
      }
    } else {
      setAdData({ ...adData, ad_type: selectedType, items: [] });
    }
    setShowAdTypeDropdown(false);
  };

  const handleAdTypeClick = () => setShowAdTypeDropdown(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdData({ ...adData, [name]: value });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setAdData({ ...adData, contact: { ...adData.contact, [name]: value } });
  };

  const handleContactArrayChange = (index, field, value) => {
    const updatedArray = [...adData.contact[field]];
    updatedArray[index] = value;
    setAdData({
      ...adData,
      contact: { ...adData.contact, [field]: updatedArray },
    });
  };

  const handleContactAddressChange = (index, value) => {
    const updatedAddresses = [...(adData.contact.addresses || [])];
    updatedAddresses[index] = value;
    setAdData({
      ...adData,
      contact: { ...adData.contact, addresses: updatedAddresses },
    });
  };

  const addContactArrayField = (field) => {
    setAdData({
      ...adData,
      contact: {
        ...adData.contact,
        [field]: [...adData.contact[field], ""],
      },
    });
  };

  const addContactAddressField = () => {
    setAdData({
      ...adData,
      contact: {
        ...adData.contact,
        addresses: [...(adData.contact.addresses || []), ""],
      },
    });
  };

  const handleLocationChange = (index, field, value) => {
    const newLocations = adData.locations.map((loc, i) =>
      i === index ? { ...loc, [field]: value } : loc,
    );
    setAdData({ ...adData, locations: newLocations });
  };

  const addLocation = () => {
    setAdData({
      ...adData,
      locations: [
        ...adData.locations,
        { branch: "", address: "", phone_number: "", email: "" },
      ],
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = adData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setAdData({ ...adData, items: newItems });
  };

  const handleItemNestedArrayChange = (
    itemIndex,
    arrayField,
    arrayIndex,
    value,
  ) => {
    const newItems = adData.items.map((item, i) => {
      if (i === itemIndex) {
        const updatedArray = [...(item[arrayField] || [])];
        updatedArray[arrayIndex] = value;
        return { ...item, [arrayField]: updatedArray };
      }
      return item;
    });
    setAdData({ ...adData, items: newItems });
  };

  const addItem = () => {
    const newItem = getDefaultItem(adData.ad_type);
    // Add only one default item if none exists.
    setAdData({ ...adData, items: [...adData.items, newItem] });
  };

  const addItemArrayField = (itemIndex, arrayField) => {
    const newItems = adData.items.map((item, i) => {
      if (i === itemIndex) {
        const updatedArray = [...(item[arrayField] || [])];
        updatedArray.push("");
        return { ...item, [arrayField]: updatedArray };
      }
      return item;
    });
    setAdData({ ...adData, items: newItems });
  };

  // Ensure that when the ad type changes, if no items exist then add one default item.
  useEffect(() => {
    if (adData.ad_type && adData.items.length === 0) {
      const defaultItem = getDefaultItem(adData.ad_type);
      setAdData((prev) => ({ ...prev, items: [defaultItem] }));
    }
  }, [adData.ad_type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.dir(adData, { depth: null });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {/* Ad Type Selector */}
      <div className="form-group">
        <input
          type="text"
          name="ad_type"
          placeholder=" "
          value={adData.ad_type}
          readOnly
          onClick={handleAdTypeClick}
        />
        <label>Ad Type</label>
        {showAdTypeDropdown && (
          <select
            onChange={(e) => handleAdTypeSelect(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select Ad Type
            </option>
            {adTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Basic Ad Fields */}
      <div className="form-group">
        <input
          type="text"
          name="title"
          placeholder=" "
          value={adData.title}
          onChange={handleInputChange}
        />
        <label>Title</label>
      </div>
      <div className="form-group">
        <textarea
          name="description"
          placeholder=" "
          value={adData.description}
          onChange={handleInputChange}
        />
        <label>Description</label>
      </div>
      <div className="form-group">
        <input
          type="date"
          name="ad_valid_from"
          placeholder=" "
          value={adData.ad_valid_from}
          onChange={handleInputChange}
        />
        <label>Ad Valid From</label>
      </div>
      <div className="form-group">
        <input
          type="date"
          name="ad_valid_to"
          placeholder=" "
          value={adData.ad_valid_to}
          onChange={handleInputChange}
        />
        <label>Ad Valid To</label>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="industry"
          placeholder=" "
          value={adData.industry}
          onChange={handleInputChange}
        />
        <label>Industry</label>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="category"
          placeholder=" "
          value={adData.category}
          onChange={handleInputChange}
        />
        <label>Category</label>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="sub_category"
          placeholder=" "
          value={adData.sub_category}
          onChange={handleInputChange}
        />
        <label>Sub Category</label>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="sub_sub_category"
          placeholder=" "
          value={adData.sub_sub_category}
          onChange={handleInputChange}
        />
        <label>Sub Sub Category</label>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="keywords"
          placeholder="Comma separated keywords"
          value={adData.keywords.join(", ")}
          onChange={(e) =>
            setAdData({
              ...adData,
              keywords: e.target.value.split(",").map((k) => k.trim()),
            })
          }
        />
        <label>Keywords</label>
      </div>
      <div className="form-group">
        <textarea
          name="notes"
          placeholder=" "
          value={adData.notes}
          onChange={handleInputChange}
        />
        <label>Additional Notes</label>
      </div>

      {/* Contact Details */}
      <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Contact Details</h2>
      <div className="form-group">
        <select
          name="type"
          value={adData.contact.type}
          onChange={handleContactChange}
        >
          <option value="" disabled>
            Select Contact Type
          </option>
          <option value="Person">Person</option>
          <option value="Business">Business</option>
        </select>
        <label>Contact Type</label>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder=" "
          value={adData.contact.name}
          onChange={handleContactChange}
        />
        <label>Contact Name</label>
      </div>
      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder=" "
          value={adData.contact.email}
          onChange={handleContactChange}
        />
        <label>Contact Email</label>
      </div>
      <div className="form-group">
        <input
          type="url"
          name="website"
          placeholder=" "
          value={adData.contact.website}
          onChange={handleContactChange}
        />
        <label>Contact Website</label>
      </div>
      <div className="form-group">
        {adData.contact.phone_numbers.map((phone, index) => (
          <div key={index} className="form-group">
            <input
              type="text"
              name={`phone_${index}`}
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) =>
                handleContactArrayChange(index, "phone_numbers", e.target.value)
              }
            />
            <label>Phone Numbers</label>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addContactArrayField("phone_numbers")}
        >
          +
        </button>
      </div>
      <div className="form-group">
        {adData.contact.social_media.map((sm, index) => (
          <div key={index} className="form-group">
            <input
              type="text"
              name={`social_${index}`}
              placeholder="Enter social media link"
              value={sm}
              onChange={(e) =>
                handleContactArrayChange(index, "social_media", e.target.value)
              }
            />
            <label>Social Media</label>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addContactArrayField("social_media")}
        >
          +
        </button>
      </div>
      {adData.ad_type === "Company" && (
        <div className="form-group">
          {(adData.contact.addresses || []).map((addr, index) => (
            <div key={index} className="form-group">
              <input
                type="text"
                name={`address_${index}`}
                placeholder="Enter address"
                value={addr}
                onChange={(e) =>
                  handleContactAddressChange(index, e.target.value)
                }
              />
              <label>Addresses</label>
            </div>
          ))}
          <button type="button" onClick={addContactAddressField}>
            +
          </button>
        </div>
      )}

      {/* Locations (if applicable) */}
      {locationAdTypes.includes(adData.ad_type) && (
        <>
          <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Locations</h2>
          {adData.locations.map((loc, index) => (
            <div
              key={index}
              className="form-group"
              style={{
                border: "1px solid var(--cyber-border)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <div className="form-group">
                <input
                  type="text"
                  placeholder=" "
                  value={loc.branch}
                  onChange={(e) =>
                    handleLocationChange(index, "branch", e.target.value)
                  }
                />
                <label>Branch</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder=" "
                  value={loc.address}
                  onChange={(e) =>
                    handleLocationChange(index, "address", e.target.value)
                  }
                />
                <label>Address</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder=" "
                  value={loc.phone_number}
                  onChange={(e) =>
                    handleLocationChange(index, "phone_number", e.target.value)
                  }
                />
                <label>Phone Number</label>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder=" "
                  value={loc.email}
                  onChange={(e) =>
                    handleLocationChange(index, "email", e.target.value)
                  }
                />
                <label>Email</label>
              </div>
            </div>
          ))}
          <button type="button" onClick={addLocation}>
            Add Location +
          </button>
        </>
      )}

      {/* Items Section */}
      <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Items</h2>
      {adData.items.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid var(--cyber-border)",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <ItemForm
            index={index}
            item={item}
            adType={adData.ad_type}
            onChange={handleItemChange}
            onNestedArrayChange={handleItemNestedArrayChange}
            addArrayField={addItemArrayField}
          />
        </div>
      ))}
      <button type="button" onClick={addItem}>
        Add Item +
      </button>
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
}

export default DynamicAdForm;

function ItemForm({
  index,
  item,
  adType,
  onChange,
  onNestedArrayChange,
  addArrayField,
}) {
  const handleFieldChange = (field, value) => onChange(index, field, value);

  const renderField = (label, fieldName, type = "text") => (
    <div className="form-group">
      <input
        type={type}
        name={fieldName}
        placeholder=" "
        value={item[fieldName]}
        onChange={(e) => handleFieldChange(fieldName, e.target.value)}
      />
      <label>{label}</label>
    </div>
  );

  switch (adType) {
    case "Real Estate":
      return (
        <>
          {renderField("Listing Type", "listing_type")}
          <div className="form-group">
            <select
              name="property_type"
              value={item.property_type}
              onChange={(e) =>
                handleFieldChange("property_type", e.target.value)
              }
            >
              <option value="" disabled>
                Select Property Type
              </option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Condo">Condo</option>
              <option value="Commercial">Commercial</option>
              <option value="Other">Other</option>
            </select>
            <label>Property Type</label>
          </div>
          {item.property_type === "Other" && (
            <div className="form-group">
              <input
                type="text"
                name="custom_property_type"
                placeholder=" "
                value={item.custom_property_type || ""}
                onChange={(e) =>
                  handleFieldChange("custom_property_type", e.target.value)
                }
              />
              <label>Specify Property Type</label>
            </div>
          )}
          {renderField("Property Location", "property_location")}
          {renderField("Price", "price")}
          {renderField("Square Footage", "square_footage")}
          {renderField("Lot Size", "lot_size")}
          {renderField("Bedrooms", "bedrooms")}
          {renderField("Bathrooms", "bathrooms")}
          {renderField("Floor Level", "floor_level")}
          {renderField("Furnished", "furnished")}
          {renderField("Utilities Included", "utilities_included")}
          {renderField("Customizable", "customizable")}
          {renderField("Office Rooms", "office_rooms")}
          {renderField("Parking Availability", "parking_availability")}
          {renderField("Lease Term", "lease_term")}
          {renderField("Amenities", "amenities")}
          {renderField("Condition", "condition")}
          {renderField("Details", "details")}
          {renderField("Agents", "agents")}
          {renderField("Notes", "notes")}
          {renderField("Zoning Information", "zoning_information")}
          {renderField("Preferred Tenants", "preferred_tenants")}
        </>
      );
    case "Car Sales":
      return (
        <>
          <div className="form-group">
            <select
              name="listing_type"
              value={item.listing_type}
              onChange={(e) =>
                handleFieldChange("listing_type", e.target.value)
              }
            >
              <option value="" disabled>
                Select Listing Type
              </option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
              <option value="Lease">Lease</option>
              <option value="Other">Other</option>
            </select>
            <label>Listing Type</label>
          </div>
          {item.listing_type === "Other" && (
            <div className="form-group">
              <input
                type="text"
                name="custom_listing_type"
                placeholder=" "
                value={item.custom_listing_type || ""}
                onChange={(e) =>
                  handleFieldChange("custom_listing_type", e.target.value)
                }
              />
              <label>Specify Listing Type</label>
            </div>
          )}
          {renderField("Year", "year")}
          {renderField("Make", "make")}
          {renderField("Model", "model")}
          {renderField("Mileage", "mileage")}
          {renderField("Condition", "condition")}
          {renderField("Price", "price")}
        </>
      );
    case "Job Placement":
      return (
        <>
          {renderField("Job Type", "job_type")}
          {renderField("Ad Purpose", "ad_purpose")}
          {renderField("Employment Type", "employment_type")}
          <div className="form-group">
            <select
              name="full_part"
              value={item.full_part}
              onChange={(e) => handleFieldChange("full_part", e.target.value)}
            >
              <option value="" disabled>
                Select Full-part
              </option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
            </select>
            <label>Full-part</label>
          </div>
          {renderField("Schedule", "schedule")}
          {renderField("Salary", "salary")}
          {renderField("Application Method", "application_method")}
          {renderField("Application Link", "application_link")}
          {renderField("Perks", "perks")}
          {renderField("Skills", "skills")}
        </>
      );
    case "Event":
      return (
        <>
          {renderField("Ad ID", "ad_id")}
          {renderField("Name", "name")}
          {renderField("Purpose", "purpose")}
          <div className="form-group">
            <label>Dates</label>
            {(item.dates || []).map((dateEntry, idx) => (
              <div key={idx} style={{ marginBottom: "1rem" }}>
                <div className="form-group">
                  <input
                    type="date"
                    name={`date_${idx}`}
                    placeholder=" "
                    value={dateEntry.date}
                    onChange={(e) => {
                      const newDates = [...item.dates];
                      newDates[idx].date = e.target.value;
                      handleFieldChange("dates", newDates);
                    }}
                  />
                  <label>Date</label>
                </div>
                <div className="form-group">
                  <input
                    type="time"
                    name={`time_${idx}`}
                    placeholder=" "
                    value={dateEntry.time}
                    onChange={(e) => {
                      const newDates = [...item.dates];
                      newDates[idx].time = e.target.value;
                      handleFieldChange("dates", newDates);
                    }}
                  />
                  <label>Time</label>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleFieldChange("dates", [
                  ...(item.dates || []),
                  { date: "", time: "" },
                ])
              }
            >
              Add Date +
            </button>
          </div>
          {renderField("Highlights", "highlights")}
        </>
      );
    case "Specials":
      return (
        <>
          {renderField("Department", "department")}
          {renderField("Brand", "brand")}
          {renderField("Product", "product")}
          {renderField("UOM", "uom")}
          {renderField("Sale Price", "SalePrice")}
          {renderField("Regular Price", "RegPrice")}
          {renderField("Specials End Date", "specials_end_date", "date")}
          {renderField("Image URL", "image_url")}
        </>
      );
    case "Product":
      return (
        <>
          {renderField("Ad Purpose", "ad_purpose")}
          {renderField("Title", "title")}
          {renderField("Description", "description")}
          {renderField("Price", "price")}
          {renderField("Image URL", "image_url")}
        </>
      );
    case "Service":
      return (
        <>
          {renderField("Ad Purpose", "ad_purpose")}
          {renderField("Title", "title")}
          {renderField("Description", "description")}
          {renderField("Service", "Service")}
        </>
      );
    default:
      return (
        <>
          {renderField("Ad Purpose", "ad_purpose")}
          {renderField("Ad Type", "ad_type")}
          {renderField("Name", "name")}
          {renderField("Description", "description")}
          {renderField("Price", "price")}
          {renderField("Category", "category")}
          {renderField("Image URL", "image_url")}
        </>
      );
  }
}
