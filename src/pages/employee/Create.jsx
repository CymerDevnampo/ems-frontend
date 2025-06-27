import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios';
import Swal from 'sweetalert2';

export default function Register() {
    const [positions, setPositions] = useState([]);
    const [roles, setRoles] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isAdmin = currentUser?.role === 1;


    useEffect(() => {
        axiosClient.get('/get/position')
            .then((res) => {
                setPositions(res.data.data);
                // const cydata = res.data.data;
                // console.log(cydata);
            })
            .catch((err) => {
                console.error('Failed to load positions:', err);
            });

        axiosClient.get('/get/roles')
            .then((res) => {
                setRoles(res.data);
                // console.log(res.data.data);
            })
            .catch((err) => {
                console.error('Failed to load roles:', err);
            });
    }, []);

    const [form, setForm] = useState({
        name: '',
        email: '',
        address: '',
        birthday: '',
        age: '',
        department: '',
        position: '',
        role: '',
        company: '',
        sss: '',
        tin: '',
        philhealth: '',
        hdmf: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loadingSwal = Swal.fire({
            text: 'Please wait...',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            position: 'top-end',
            toast: true,
            timer: 0,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await axiosClient.post('/store/employee', form);
            Swal.fire({
                icon: 'success',
                text: 'Employee added Successfully...',
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                timerProgressBar: true
            });
            navigate('/employees');
        } catch (err) {
            loadingSwal.close();

            const errorMessage = err.response?.data?.message || 'Theres an error while adding the employee.';

            Swal.fire({
                icon: 'error',
                text: errorMessage,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                timerProgressBar: true,
            });
            console.error(err.response?.data);
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-10">
                <h3>Add Employee</h3>
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {/* Name */}
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    id="floatingName"
                                    placeholder="Name"
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="floatingName">Name</label>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    id="floatingEmail"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="floatingEmail">Email</label>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    name="address"
                                    type="text"
                                    className="form-control"
                                    id="floatingAddress"
                                    placeholder="Address"
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="floatingAddress">Address</label>
                            </div>
                        </div>

                        {/* Birthday */}
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    name="birthday"
                                    type="date"
                                    className="form-control"
                                    id="floatingBirthday"
                                    placeholder="Date of Birth"
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="floatingBirthday">Date of Birth</label>
                            </div>
                        </div>

                        {/* Age */}
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    name="age"
                                    type="number"
                                    className="form-control"
                                    id="floatingAge"
                                    placeholder="Age"
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="floatingAge">Age</label>
                            </div>
                        </div>

                        {/* Department */}
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    name="department"
                                    type="text"
                                    className="form-control"
                                    id="floatingDepartment"
                                    placeholder="Department"
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="floatingDepartment">Department</label>
                            </div>
                        </div>

                        {/* Position */}
                        <div className="col-md-6">
                            <div className="form-floating">
                                <select
                                    name="position"
                                    className="form-select"
                                    id="floatingPosition"
                                    onChange={handleChange}
                                    required
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        {positions.length === 0 ? 'No positions available — please add one' : 'Select Position'}
                                    </option>

                                    {positions.map((pos) => (
                                        <option key={pos.encrypted_id} value={pos.encrypted_id}>
                                            {pos.name}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor="floatingPosition">Position</label>
                            </div>
                        </div>

                        {/* Role */}
                        {isAdmin && (
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <select
                                        name="role"
                                        className="form-select"
                                        id="floatingRole"
                                        onChange={handleChange}
                                        required
                                        value={form.role}
                                    >
                                        <option value="" disabled>
                                            {roles.length === 0 ? 'No roles available' : 'Select Role'}
                                        </option>

                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="floatingRole">Role</label>
                                </div>
                            </div>
                        )}


                        {/* Company */}
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    name="company"
                                    type="text"
                                    className="form-control"
                                    id="floatingCompany"
                                    placeholder="Company"
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="floatingCompany">Company</label>
                            </div>
                        </div>

                        {/* SSS */}
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    name="sss"
                                    type="text"
                                    className="form-control"
                                    id="floatingSSS"
                                    placeholder="SSS"
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="floatingSSS">SSS</label>
                            </div>
                        </div>

                        {/* Tin */}
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    name="tin"
                                    type="text"
                                    className="form-control"
                                    id="floatingTIN"
                                    placeholder="TIN"
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="floatingTin">TIN</label>
                            </div>
                        </div>

                        {/* Philhealth */}
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    name="philhealth"
                                    type="text"
                                    className="form-control"
                                    id="floatingPhilhealth"
                                    placeholder="Philhealth"
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="floatingPhilhealth">Philhealth</label>
                            </div>
                        </div>

                        {/* Hdmf */}
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    name="hdmf"
                                    type="text"
                                    className="form-control"
                                    id="floatingHDMF"
                                    placeholder="HDMF"
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="floatingHDMF">HDMF</label>
                            </div>
                        </div>

                    </div>

                    {/* Submit Button */}
                    <div className="mt-4 d-flex gap-1">
                        <button className="btn btn-success" type="submit">
                            Add
                        </button>

                        <button className="btn btn-secondary" type="button">
                            <Link className="nav-link" to="/employees">Back</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}
