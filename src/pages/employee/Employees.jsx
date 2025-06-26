import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import Swal from 'sweetalert2';

export default function Employees() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axiosClient
            .get('/get/employee')
            .then((res) => {
                setEmployees(res.data.data);
            })
            .catch((err) => {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to fetch employees',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
                console.error(err);
            });
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="mb-4">All Employees</h3>

            <div>
                <button className='btn btn-primary'>
                    <Link className="nav-link" to="/createEmployee">Add Employee</Link>
                </button>
            </div>

            {employees.length === 0 ? (
                <p>No employees found.</p>
            ) : (
                <div className="table-responsive mt-4">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Birthday</th>
                                <th>Department</th>
                                <th>Position</th>
                                <th>Company</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((data) => (
                                <tr key={data.id}>
                                    <td>{data.user.name}</td>
                                    <td>{data.user.email}</td>
                                    <td>{data.birthday}</td>
                                    <td>{data.employee_details[0]?.department}</td>
                                    <td>{data.employee_details[0]?.position}</td>
                                    <td>{data.employee_details[0]?.company}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
