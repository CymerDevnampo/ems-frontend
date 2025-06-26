import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });

    const navigate = useNavigate();

    const fetchEmployees = (page = 1) => {
        axiosClient
            .get(`/get/employee?page=${page}`)
            .then((res) => {
                setEmployees(res.data.data);
                setPagination({
                    current_page: res.data.current_page,
                    last_page: res.data.last_page,
                });
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
    };

    useEffect(() => {
        fetchEmployees();
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
                                <th>Action</th>
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
                                    <td className='d-flex'>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/edit/employee/${data.encrypted_id}`)}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>

                                        <button className="btn btn-sm btn-danger">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <nav className="mt-3">
                        <ul className="pagination justify-content-end">
                            <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => fetchEmployees(pagination.current_page - 1)}
                                >
                                    Previous
                                </button>
                            </li>

                            {[...Array(pagination.last_page)].map((_, index) => (
                                <li
                                    className={`page-item ${pagination.current_page === index + 1 ? 'active' : ''
                                        }`}
                                    key={index}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => fetchEmployees(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}

                            <li
                                className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => fetchEmployees(pagination.current_page + 1)}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>

                </div>
            )}
        </div>
    );
}
