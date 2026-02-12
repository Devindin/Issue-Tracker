import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  FaEdit,
  FaTimes,
  FaCamera,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaSave,
} from "react-icons/fa";
import { type UserProfile } from "../../types";
import { useUpdateProfileMutation } from "../../features/profile/profileApi";
import { setCredentials } from "../../features/auth/authSlice";

interface ProfileTabProps {
  profile: UserProfile;
  onSuccess?: () => void;
}

// Validation schema
const profileValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\+?[\d\s\-\(\)]*$/, "Please enter a valid phone number")
    .optional(),
  location: Yup.string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  website: Yup.string()
    .url("Please enter a valid URL")
    .max(200, "Website URL must be less than 200 characters")
    .optional(),
  bio: Yup.string()
    .max(500, "Bio must be less than 500 characters")
    .optional(),
});

const ProfileTab: React.FC<ProfileTabProps> = ({ profile, onSuccess }) => {
  const dispatch = useDispatch();
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatar || "");

  // Handle avatar upload
  const handleAvatarUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFieldValue("avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Formik
      initialValues={profile}
      validationSchema={profileValidationSchema}
      onSubmit={async (values) => {
        try {
          const result = await updateProfile(values).unwrap();
          
          // Update auth state with new user name
          const token = localStorage.getItem("token");
          if (token) {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            user.name = result.name;
            dispatch(setCredentials({ user, token }));
          }
          
          setIsEditingProfile(false);
          onSuccess?.();
        } catch (err) {
          console.error("Profile update failed:", err);
        }
      }}
      enableReinitialize
    >
      {({ isSubmitting, dirty, isValid, setFieldValue, values }) => (
        <Form className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Profile Information
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsEditingProfile(!isEditingProfile);
                if (isEditingProfile) {
                  setAvatarPreview(profile.avatar || "");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              {isEditingProfile ? (
                <>
                  <FaTimes /> Cancel
                </>
              ) : (
                <>
                  <FaEdit /> Edit
                </>
              )}
            </button>
          </div>

        
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {(error as any)?.data?.message || "Failed to update profile"}
            </div>
          )}

          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {avatarPreview || values.avatar ? (
                  <img
                    src={avatarPreview || values.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  values.name.charAt(0).toUpperCase()
                )}
              </div>
              {isEditingProfile && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                  <FaCamera />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAvatarUpload(e, setFieldValue)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {values.name}
              </h3>
              <p className="text-gray-600">{values.email}</p>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <Field
                name="name"
                type="text"
                disabled={!isEditingProfile}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2" />
                Email *
              </label>
              <Field
                name="email"
                type="email"
                disabled={true}
                title="Email cannot be changed"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaPhone className="inline mr-2" />
                Phone
              </label>
              <Field
                name="phone"
                type="tel"
                disabled={!isEditingProfile}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                Location
              </label>
              <Field
                name="location"
                type="text"
                disabled={!isEditingProfile}
                placeholder="City, Country"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
              <ErrorMessage
                name="location"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaGlobe className="inline mr-2" />
                Website
              </label>
              <Field
                name="website"
                type="url"
                disabled={!isEditingProfile}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
              <ErrorMessage
                name="website"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <Field
                name="bio"
                as="textarea"
                disabled={!isEditingProfile}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none"
              />
              <ErrorMessage
                name="bio"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>
          </div>

          {isEditingProfile && (
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={isSubmitting || isLoading || !dirty || !isValid}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FaSave />
                {isSubmitting || isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  setAvatarPreview(profile.avatar || "");
                }}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default ProfileTab;