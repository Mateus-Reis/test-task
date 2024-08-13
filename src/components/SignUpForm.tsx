import React, { useState } from "react";
import { useToken } from "../hooks/useToken";
import axiosInstance from "@/api/axiosConfig";
import { usePositions } from "@/hooks/usePositions";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "@react-spring/web";

interface FormData {
  name: string;
  email: string;
  phone: string;
  position_id: string;
  photo: File | null;
}

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    position_id: "",
    photo: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeIn = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(50px)",
  });

  const { token, loading, fetchToken } = useToken();
  const positions = usePositions();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, photo: "File size must not exceed 5MB" });
      return;
    }
    if (file && !file.type.includes("jpeg")) {
      setErrors({ ...errors, photo: "File must be in jpeg/jpg format" });
      return;
    }
    setFormData({
      ...formData,
      photo: file,
    });
    setErrors({ ...errors, photo: "" });
  };

  const handleClearPhoto = () => {
    setFormData({ ...formData, photo: null });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    return phone.startsWith("+380");
  };

  const validateForm = () => {
    let newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name || formData.name.length < 2 || formData.name.length > 60)
      newErrors.name = "Name should be 2-60 characters.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone number should start with +380.";
    }
    if (!formData.position_id) newErrors.position_id = "Position is required.";
    if (!formData.photo) newErrors.photo = "Photo is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await fetchToken();

    if (!token) {
      console.error("No token available.");
      return;
    }

    console.log("Token being used:", token);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("position_id", formData.position_id);
    if (formData.photo) {
      formDataToSend.append("photo", formData.photo);
    }

    try {
      const response = await axiosInstance.post("/users", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("User registered successfully:", response.data);
    } catch (error: any) {
      console.error(
        "Error registering user:",
        error.response?.data || error.message
      );
    }
  };

  const positionOptions = positions.map((position) => ({
    value: position.id.toString(),
    label: position.name,
  }));

  return (
    <animated.div
      ref={ref}
      style={fadeIn}
      id="signup"
      className="w-full min-h-screen bg-[#F8F8F8] flex items-center justify-center"
    >
      <form
        className="bg-white p-8 rounded-md max-w-lg mx-auto space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-8"> Working with POST request</h2>

        <div className="relative">
          <input
            type="text"
            name="name"
            placeholder="Your name"
            className={`w-full p-3 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            onChange={handleInputChange}
            value={formData.name}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 mb-2">{errors.name}</p>
          )}
        </div>
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`w-full p-3 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            onChange={handleInputChange}
            value={formData.email}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 mb-2">{errors.email}</p>
          )}
        </div>
        <div className="relative">
          <PhoneInput
            international
            defaultCountry="UA"
            value={formData.phone}
            onChange={(phone) => {
              setFormData({ ...formData, phone: phone || "" });
              setErrors({ ...errors, phone: "" });
            }}
            inputComponent="input"
            className={`w-full p-3 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1 mb-2">{errors.phone}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">Ex: +38 (098) 278 90 24</p>{" "}
          {/* Descrição abaixo do campo de telefone */}
        </div>
        <div className="flex flex-col">
          <label className="mb-2">Select your position</label>
          <Select
            options={positionOptions}
            onChange={(selectedOption) =>
              setFormData({
                ...formData,
                position_id: selectedOption?.value || "",
              })
            }
            classNamePrefix="react-select"
            className="react-select-container"
            placeholder="Choose a position"
            value={positionOptions.find(
              (option) => option.value === formData.position_id
            )}
          />
          {errors.position_id && (
            <p className="text-red-500 text-xs mt-1 mb-2">
              {errors.position_id}
            </p>
          )}
        </div>
        <div className="relative border border-gray-300 rounded-md p-3">
          {!formData.photo && (
            <div className="w-full">
              <input
                type="file"
                name="photo"
                id="photo-upload"
                className="hidden"
                onChange={(e) => {
                  handleFileChange(e);
                  e.target.value = "";
                }}
                accept="image/jpeg, image/jpg"
              />
              <label
                htmlFor="photo-upload"
                className="block p-3 bg-[#00BDD3] text-white font-semibold text-center rounded-md cursor-pointer hover:bg-[#0097a7] transition-colors duration-300"
              >
                Choose File
              </label>
            </div>
          )}
          {formData.photo && (
            <div className="flex flex-col items-center">
              <img
                src={URL.createObjectURL(formData.photo)}
                alt="Preview"
                className="w-32 h-32 object-cover border border-gray-300 rounded-md mb-2"
              />
              <button
                type="button"
                onClick={handleClearPhoto}
                className="text-red-500 text-sm underline"
              >
                Clear Image
              </button>
            </div>
          )}
          {errors.photo && (
            <p className="text-red-500 text-xs mt-1 mb-2">{errors.photo}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-[#F4E041] text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors duration-300"
        >
          Sign Up
        </button>
      </form>
    </animated.div>
  );
};

export default SignUpForm;
