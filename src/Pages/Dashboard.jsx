import { motion } from 'framer-motion';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from '../config/axiosConfig';


const Dashboard = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [updateModal, setUpdateModal] = useState(false);
    const [updateName, setUpdateName] = useState("")
    const [updateDob, setUpdateDob] = useState("")
    const [selectedItemId, setSelectedItemId] = useState(null)
    const [selectedDeleteItemId, setSelectedDeleteItemId] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const [canDelete, setCanDelete] = useState(false);


    const closeModal = () => {
        setIsOpen(false); // Close the modal
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleEditItem = async (e) => {
        e.preventDefault();
        toast.success("Item Edited Successfully");

        if (!updateName || !updateDob) {
            toast.warning("Input field Could not be empty")
            return
        }

        const dobYear = new Date(updateDob).getFullYear();
        if (dobYear > 2024) {
            toast.warning("Date of Birth Should be Less then 2024")
            return
        }

        if (selectedItemId === null) {
            toast.warning("Please select the Item")
            return
        }

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            const response = await axios.put(`/items/edit-item/${selectedItemId}`, {
                name: updateName,
                dob: updateDob
            }, {
                headers: {
                    'auth-token': token,
                },
            });

            console.log(response.data);
            toast.success("Item Updated Successfully", {
                position: 'top-center'
            })
            fetchUserData();
            setUpdateModal(false)
            setSelectedItemId(null)
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            setUpdateModal(false)
            setSelectedItemId(null)
        }
    };

    const handleDeleteItem = async (e) => {
        e.preventDefault();
        if (selectedDeleteItemId === null) {
            toast.warning("Please select the Item")
            return
        }

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            const response = await axios.delete(`/items/delete-item/${selectedDeleteItemId}`, {
                headers: {
                    'auth-token': token,
                },
            });

            toast.success("Item Delete Successfully", {
                position: 'top-center'
            })
            fetchUserData();
            setDeleteModal(false)
            setSelectedDeleteItemId(null)
            setCanDelete(false);

        } catch (error) {
            console.error("Error fetching user data:", error.message);
            setDeleteModal(false)
            setSelectedDeleteItemId(null)
            setCanDelete(false);
        }
    };

    const handleAddNewItem = async (e) => {
        e.preventDefault();

        if (!name || !dob) {
            toast.warning("Input field Could not be empty")
            return
        }

        const dobYear = new Date(dob).getFullYear();
        if (dobYear > 2024) {
            toast.warning("DoB Should be Less then 2024")
            return
        }

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            const response = await axios.post('/items/add-item', {
                name: name,
                dob: dob
            }, {
                headers: {
                    'auth-token': token,
                },
            });


            setData(response.data);
            toast.success("Item Added Successfully", {
                position: 'top-center'
            })
            fetchUserData();
            setIsOpen(false)
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            setIsOpen(false)
        }
    };

    const fetchUserData = async () => {
        setLoading(true)
        try {

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            const response = await axios.get('/items/get-user-items', {
                headers: {
                    'auth-token': token,
                },
            });

            setData(response.data);
            setLoading(false)
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            setLoading(false)
        }
    };

    const convertToIndianDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0'); // Ensures 2 digits
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        fetchUserData()
    }, [])

    const handleLogout = () => {
        localStorage.setItem('token', '')
        console.log('logout successfully', localStorage.getItem('token'))
        navigate('/')
        toast.warning("Logout Successfully", {
            position: 'top-center'
        })
    }

    const openUpdateModal = () => setUpdateModal(true);

    const closeUpdateModal = () => setUpdateModal(false);

    return (
        <>



            {isOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        className="w-[90%] max-w-lg bg-white rounded-lg shadow-lg p-6 relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={closeModal}
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
                            Add Item
                        </h2>

                        <form onSubmit={handleAddNewItem} className="flex flex-col">
                            <input
                                placeholder="Name"
                                className="bg-gray-100 text-gray-700 border border-gray-300 rounded-md p-3 mb-4 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150"
                                type="text"
                                required
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                placeholder="Date of Birth"
                                className="bg-gray-100 text-gray-700 border border-gray-300 rounded-md p-3 mb-4 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150"
                                type="date"
                                required
                                onChange={(e) => setDob(e.target.value)}
                            />
                            <button
                                className="bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:from-blue-500 hover:to-blue-600 transition ease-in-out duration-150 shadow-md"
                                type="submit"
                            >
                                Add Item
                            </button>
                        </form>
                    </motion.div>
                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
                </div>
            )}


            {updateModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        className="bg-white p-6 max-w-sm w-[90%] rounded-lg shadow-lg relative"
                        initial={{ opacity: 0, scale: 0.9 }} // Modal initially scaled down and transparent
                        animate={{ opacity: 1, scale: 1 }} // Modal appears fully with normal scale
                        exit={{ opacity: 0, scale: 0.9 }} // Modal disappears with fade and shrink effect
                        transition={{ duration: 0.3, ease: 'easeInOut' }} // Smooth transition for both opening and closing
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none"
                            onClick={closeUpdateModal}
                        >
                            &times;
                        </button>

                        {/* Modal Title */}
                        <p className="text-lg font-semibold text-center text-black mb-6">
                            Update Your Item
                        </p>

                        {/* Form */}
                        <form onSubmit={handleEditItem}>
                            {/* Name Input with Animation */}
                            <motion.div
                                className="relative mb-4"
                                initial={{ opacity: 0, y: -20 }} // Start with opacity 0 and slightly above
                                animate={{ opacity: 1, y: 0 }} // Fade in and move to normal position
                                transition={{ duration: 0.3, delay: 0.2 }} // Delay for smooth sequential animation
                            >
                                <input
                                    type="text"
                                    placeholder="Enter New Name"
                                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setUpdateName(e.target.value)}
                                />
                            </motion.div>

                            {/* Date of Birth Input with Animation */}
                            <motion.div
                                className="relative mb-4"
                                initial={{ opacity: 0, y: -20 }} // Start with opacity 0 and slightly above
                                animate={{ opacity: 1, y: 0 }} // Fade in and move to normal position
                                transition={{ duration: 0.3, delay: 0.4 }} // Delay slightly longer than the previous one
                            >
                                <input
                                    type="date"
                                    placeholder="Enter New Date of Birth"
                                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setUpdateDob(e.target.value)}
                                />
                            </motion.div>

                            {/* Update Button */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg uppercase focus:outline-none hover:bg-indigo-700 transition duration-150"
                            >
                                Update
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}


            {deleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        className="bg-white p-6 max-w-sm w-[90%] rounded-lg shadow-lg relative"
                        initial={{ opacity: 0, scale: 0.9 }} // Start with opacity 0 and scale down
                        animate={{ opacity: 1, scale: 1 }} // Fade in and scale to normal
                        exit={{ opacity: 0, scale: 0.9 }} // Fade out and scale down when closing
                        transition={{ duration: 0.3, ease: 'easeInOut' }} // Smooth transition for both opening and closing
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none"
                            onClick={() => setDeleteModal(false)}
                        >
                            &times;
                        </button>

                        {/* Modal Title */}
                        <p className="text-lg font-semibold text-center text-black mb-6">
                            Are you sure you want to delete this item?
                        </p>

                        {/* Form */}
                        <form onSubmit={handleDeleteItem}>
                            {/* Checkbox Animation */}
                            <motion.div
                                className="flex items-center mb-4"
                                initial={{ opacity: 0, y: -20 }} // Start with opacity 0 and slightly above
                                animate={{ opacity: 1, y: 0 }} // Fade in and move to normal position
                                transition={{ duration: 0.3, delay: 0.2 }} // Delay for smooth animation
                            >
                                <input
                                    type="checkbox"
                                    id="confirmDelete"
                                    className="mr-2"
                                    onChange={(e) => setCanDelete(e.target.checked)}
                                />
                                <label htmlFor="confirmDelete" className="text-sm text-gray-700">
                                    I confirm that I want to delete this item.
                                </label>
                            </motion.div>

                            {/* Button Group Animation */}
                            <motion.div
                                className="flex justify-between gap-4"
                                initial={{ opacity: 0, x: -20 }} // Start with opacity 0 and slide in from left
                                animate={{ opacity: 1, x: 0 }} // Fade in and move to normal position
                                transition={{ duration: 0.3, delay: 0.4 }} // Slight delay for smooth sequential animation
                            >
                                {/* Delete Button */}
                                <button
                                    onClick={handleDeleteItem}
                                    type="submit"
                                    disabled={!canDelete}
                                    className={`w-full py-2 font-semibold rounded-lg text-white focus:outline-none transition duration-150 ${canDelete
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    Delete
                                </button>

                                {/* Cancel Button */}
                                <button
                                    type="button"
                                    className="w-full py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg focus:outline-none hover:bg-gray-400 transition duration-150"
                                    onClick={() => {
                                        setDeleteModal(false);
                                        setCanDelete(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>

            )}




            <div className="dashboard-container max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                    <motion.h2
                        className="text-3xl font-semibold text-gray-800 mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        Dashboard
                    </motion.h2>

                    <motion.button
                        onClick={() => handleLogout()}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-200 mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                    >
                        Logout
                    </motion.button>
                </div>
                <div className="flex items-center justify-between  mb-4">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-100 text-black py-2 px-4 rounded-lg transition duration-200 "
                    >
                        Back
                    </button>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                    >
                        Add New Item
                    </button>
                </div>

                {loading ? (
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="p-4 text-left text-xs sm:text-sm md:text-base">Name</th>
                                <th className="p-4 text-left text-xs sm:text-sm md:text-base">Age</th>
                                <th className="p-4 text-left text-xs sm:text-sm md:text-base">Date of Birth</th>
                                <th className="p-4 text-left text-xs sm:text-sm md:text-base">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="p-4">
                                        <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <div className="w-16 h-8 bg-gray-300 rounded animate-pulse"></div>
                                            <div className="w-16 h-8 bg-gray-300 rounded animate-pulse"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <motion.tr
                                initial={{ opacity: 0 }} // Initial state: invisible and below the normal position
                                whileInView={{ opacity: 1 }} // Animate to visible and normal position when in view
                                viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the row is in view
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="bg-blue-600 text-white">
                                <th className="p-4 text-left text-xs sm:text-sm md:text-base">Name</th>
                                <th className="p-4 text-left text-xs sm:text-sm md:text-base">Age</th>
                                <th className="p-4 text-left text-xs sm:text-sm md:text-base">Date of Birth</th>
                                <th className="p-4 text-left text-xs sm:text-sm md:text-base">Action</th>
                            </motion.tr>
                        </thead>
                        <tbody>
                            {Array.isArray(data) &&
                                data.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        className="border-b border-gray-200"
                                        initial={{ opacity: 0, y: 20 }} // Initial state: invisible and below the normal position
                                        whileInView={{ opacity: 1, y: 0 }} // Animate to visible and normal position when in view
                                        viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the row is in view
                                        transition={{ duration: 0.4, ease: 'easeOut' }} // Smooth transition
                                    >
                                        <td className="p-4 text-gray-700 text-xs sm:text-sm md:text-base">{item.name}</td>
                                        <td className="p-4 text-gray-700 text-xs sm:text-sm md:text-base">{calculateAge(item.dob)}</td>
                                        <td className="p-4 text-gray-700 text-xs sm:text-sm md:text-base">{convertToIndianDate(item.dob)}</td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap justify-start gap-2">
                                                <button
                                                    onClick={() => {
                                                        openUpdateModal();
                                                        setSelectedItemId(item._id);
                                                    }}
                                                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200 text-xs sm:text-sm md:text-base"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleteModal(true);
                                                        setSelectedDeleteItemId(item._id);
                                                    }}
                                                    className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-200 text-xs sm:text-sm md:text-base"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>


    );
};

export default Dashboard;
