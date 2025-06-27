import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios';
import Swal from 'sweetalert2';

export default function EditEmployee() {
    const { id } = useParams(); // encrypted ID
    const navigate = useNavigate();
    const [positions, setPositions] = useState([]);
    const [roles, setRoles] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isAdmin = currentUser?.role_id === 1;

    const [form, setForm] = useState({
        name: '',
        email: '',
        address: '',
        birthday: '',
        age: '',
        department: '',
        position: '',
        company: '',
        sss: '',
        tin: '',
        philhealth: '',
        hdmf: ''
    });

    useEffect(() => {
        axiosClient.get(`/edit/employee/${id}`).then((res) => {
            const data = res.data;
            setForm({
                name: data.user.name,
                email: data.user.email,
                address: data.address,
                birthday: data.birthday,
                age: data.age,
                department: data.employee_details[0]?.department,
                position: data.employee_details[0]?.position,
                role_id: data.user.role?.id || '',
                company: data.employee_details[0]?.company,
                sss: data.employee_details[0]?.sss,
                tin: data.employee_details[0]?.tin,
                philhealth: data.employee_details[0]?.philhealth,
                hdmf: data.employee_details[0]?.hdmf,
            });
        }).catch(() => {
            Swal.fire('Failed to load employee', '', 'error');
            navigate('/employees');
        });


        axiosClient.get('/get/position')
            .then((res) => {
                setPositions(res.data.data);
            })
            .catch((err) => {
                console.error('Failed to load positions:', err);
            });


        axiosClient.get('/get/roles')
            .then((res) => {
                setRoles(res.data);
            })
            .catch((err) => {
                console.error('Failed to load roles:', err);
            });
    }, [id]);


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
            await axiosClient.put(`/update/employee/${id}`, form);
            Swal.fire({
                icon: 'success',
                text: 'Employee updated Successfully...',
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                timerProgressBar: true
            });
            navigate('/employees');
        } catch (err) {
            loadingSwal.close();

            const errorMessage = err.response?.data?.message || 'Theres an error while updating the employee.';

            Swal.fire({
                icon: 'error',
                text: errorMessage,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                timerProgressBar: true,
            });
        }

    };

    return (
        <div className="container mt-4">
            <h3>Edit Employee</h3>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                name="name"
                                type="text"
                                className="form-control"
                                id="floatingName"
                                placeholder="Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingName">Name</label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                name="email"
                                type="text"
                                className="form-control"
                                id="floatingEmail"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingEmail">Email</label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                name="address"
                                type="text"
                                className="form-control"
                                id="floatingAddress"
                                placeholder="Address"
                                value={form.address}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingAddress">Address</label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                name="birthday"
                                type="date"
                                className="form-control"
                                id="floatingbirthday"
                                placeholder="birthday"
                                value={form.birthday}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingbirthday">Date of birth</label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                name="age"
                                type="text"
                                className="form-control"
                                id="floatingAge"
                                placeholder="Age"
                                value={form.age}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingAge">Age</label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                name="department"
                                type="text"
                                className="form-control"
                                id="floatingDepartment"
                                placeholder="Department"
                                value={form.department}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingDepartment">Department</label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <select
                                name="position"
                                className="form-select"
                                id="floatingPosition"
                                value={form.position}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>
                                    {positions.length === 0 ? 'No positions available — please add one' : 'Select Position'}
                                </option>

                                {positions.map((pos) => (
                                    <option key={pos.id} value={pos.id}>
                                        {pos.name}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="floatingPosition">Position</label>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="col-md-6">
                            <div className="form-floating">
                                <select
                                    name="role_id"
                                    className="form-select"
                                    id="floatingRole"
                                    value={form.role_id}
                                    onChange={handleChange}
                                    required
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
                    
                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                name="company"
                                type="text"
                                className="form-control"
                                id="floatingCompany"
                                placeholder="Company"
                                value={form.company}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingCompany">Company</label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                name="sss"
                                type="text"
                                className="form-control"
                                id="floatingSSS"
                                placeholder="SSS"
                                value={form.sss}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingSSS">SSS</label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                name="tin"
                                type="text"
                                className="form-control"
                                id="floatingTIN"
                                placeholder="TIN"
                                value={form.tin}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingTIN">TIN</label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                name="philhealth"
                                type="text"
                                className="form-control"
                                id="floatingPhilhealth"
                                placeholder="Philhealth"
                                value={form.philhealth}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingPhilhealth">Philhealth</label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                name="hdmf"
                                type="text"
                                className="form-control"
                                id="floatingHDMF"
                                placeholder="HDMF"
                                value={form.hdmf}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingHDMF">HDMF</label>
                        </div>
                    </div>


                </div>
                <div className="mt-3 d-flex gap-1">
                    <button className="btn btn-success">Update</button>
                    <Link className="nav-link" to="/employees">
                        <button className="btn btn-secondary" type="button">
                            Back
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
