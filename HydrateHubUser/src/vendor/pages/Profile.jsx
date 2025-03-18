import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

// Yup Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  companyName: yup.string().required("Company Name is required").min(3, "Company Name must be at least 3 characters"),
  location: yup.string().required("Location is required"),
  phone: yup.string().matches(/^\d{10,11}$/, "Phone number must be 10-11 digits long").required("Phone number is required"),
  cnic: yup.string().matches(/^\d{13}$/, "CNIC must be 13 digits long").required("CNIC is required"),
});

const Profile = () => {
  const [data, setData] = useState();
  const [image, setImage] = useState(null); // Holds the preview URL for the image
  const [file, setFile] = useState(null); // Holds the selected file object
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    const decodedToken = jwtDecode(token);

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/partner/${decodedToken.userId}`);
        setData(response.data);
        setValue("name", response.data.name || "");
        setValue("phone", response.data.phone || "");
        setValue("companyName", response.data.companyName || "");
        setValue("location", response.data.location || "");
        setValue("cnic", response.data.cnic || "");
        setValue("about", response.data.about || "");
        setImage(`http://localhost:3001/uploads/${response.data.image}`); // Set the initial image from the backend
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [setValue]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Preview the selected image using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Update the image preview
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onSubmit = async (formData) => {
    const updatedData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      updatedData.append(key, value);
    });

    if (file) {
      updatedData.append("image", file); // Attach the actual file
    }

    try {
      const token = localStorage.getItem("vendorToken");
      const decodedToken = jwtDecode(token);

      await axios.patch(`http://localhost:3001/user/partnerUpdate/${decodedToken.userId}`, updatedData);
      toast.success("Vendor info updated successfully");
    } catch (error) {
      console.error("Error updating vendor info:", error);
      toast.error("Error updating Vendor info");
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password-vendor"); // Navigate to the change password page
  };

  return (
    <div className="bg-gray-100 h-full pt-1 flex flex-col items-center">
      <div className="my-4 bg-gradient-to-r from-blue-500 w-11/12 to-indigo-300 p-10 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl text-white font-semibold">Vendor Profile</h1>
      </div>
      <div className="flex flex-row justify-between w-11/12 gap-6">
        <div className="my-3 bg-gradient-to-r from-blue-500 to-indigo-300 p-10 rounded-lg shadow-lg w-3/12 h-fit justify-center flex flex-col">
          <img className="rounded-full h-44" src={image || "/assets/DefaultCompany.png"} alt="Vendor-Profile" />
          <button
            className="text-white bg-blue-700 mt-3 rounded-full px-2 py-1"
            type="button"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Upload new image
          </button>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
                                        <div className="my-3 bg-gradient-to-r from-blue-500 to-indigo-300 p-10 rounded-lg shadow-lg w-9/12">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="text-white font-semibold">
                                    Owner Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register('name')}
                                    className={`w-full py-2 px-4 my-2 bg-gray-200 rounded-lg focus:outline-none border-2 ${errors.name ? 'border-red-500' : 'focus:border-blue-800'
                                        }`}
                                />
                                <p className="text-red-500 text-sm">{errors.name?.message}</p>
                            </div>
                            <div>
                                <label htmlFor="companyName" className="text-white font-semibold">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    {...register('companyName')}
                                    className={`w-full py-2 px-4 my-2 bg-gray-200 rounded-lg focus:outline-none border-2 ${errors.companyName ? 'border-red-500' : 'focus:border-blue-800'
                                        }`}
                                />
                                <p className="text-red-500 text-sm">{errors.companyName?.message}</p>
                            </div>


                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="text-white font-semibold">
                                    Conatct Email
                                </label>
                                <input
                                    disabled
                                    type="email"
                                    id="email"
                                    className="w-full py-2 px-4 my-2 rounded-lg focus:outline-none focus:border-blue-800 border-2"
                                    value={data ? data.email : 'user@gmail.com'}
                                />
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label htmlFor="phone" className="text-white font-semibold">
                                    Contact Phone
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    {...register('phone')}
                                    className={`w-full py-2 px-4 my-2 bg-gray-200 rounded-lg focus:outline-none border-2 ${errors.phone ? 'border-red-500' : 'focus:border-blue-800'
                                        }`}
                                />
                                <p className="text-red-500 text-sm">{errors.phone?.message}</p>
                            </div>

                            {/* Address Field */}
                            <div>
                                <label htmlFor="location" className="text-white font-semibold">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    {...register('location')}
                                    className={`w-full py-2 px-4 my-2 bg-gray-200 rounded-lg focus:outline-none border-2 ${errors.location ? 'border-red-500' : 'focus:border-blue-800'
                                        }`}
                                />
                                <p className="text-red-500 text-sm">{errors.location?.message}</p>
                            </div>

                            <div>
                                <label htmlFor="cname" className="text-white font-semibold">
                                    Owner CNIC
                                </label>
                                <input
                                    type="text"
                                    id="cnic"
                                    {...register('cnic')}
                                    className={`w-full py-2 px-4 my-2 bg-gray-200 rounded-lg focus:outline-none border-2 ${errors.cnic ? 'border-red-500' : 'focus:border-blue-800'
                                        }`}
                                />
                                <p className="text-red-500 text-sm">{errors.cnic?.message}</p>
                            </div>



                        </div>
                        <div>
                            <label htmlFor="about" className="text-white font-semibold">
                                About
                            </label>
                            <textarea
                                rows='3'
                                type="text"
                                id="about"
                                {...register('about')}
                                className={`w-full py-2 px-4 my-2 bg-gray-200 rounded-lg focus:outline-none border-2 ${errors.about ? 'border-red-500' : 'focus:border-blue-800'
                                    }`}
                            />
                            <p className="text-red-500 text-sm">{errors.about?.message}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-5/6 mt-4">
                                <button
                                    type="submit"
                                    className="bg-gradient-to-b p-2 from-teal-400 to-blue-600 text-white rounded-full hover:scale-105"
                                >
                                    Update Info
                                </button>
                                <button
                                    type="button"
                                    onClick={handleChangePassword}
                                    className="bg-gradient-to-b p-2 from-teal-400 to-blue-600 text-white rounded-full hover:scale-105"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
