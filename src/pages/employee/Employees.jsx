import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDownload, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isAdmin = currentUser?.role_id === 1;
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

    const handleDelete = (encryptedId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!',
            position: 'top-end',
            toast: true,
            showConfirmButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.delete(`/delete/employee/${encryptedId}`)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Employee has been deleted.',
                            toast: true,
                            position: 'top-end',
                            timer: 3000,
                            showConfirmButton: false
                        });
                        fetchEmployees(pagination.current_page); // Refresh the same page
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            text: 'Failed to delete employee.',
                            toast: true,
                            position: 'top-end',
                            timer: 3000,
                            showConfirmButton: false
                        });
                    });
            }
        });
    };

    const handleDownloadEmployees = () => {
        axiosClient.get('/download/employees', {
            responseType: 'blob'
        })
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'employees.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to download employee file',
                    toast: true,
                    position: 'top-end',
                    timer: 3000,
                    showConfirmButton: false,
                });
            });
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">All Employees</h3>

            <div className='d-flex gap-1'>
                <Link className="nav-link" to="/createEmployee">
                    <button className='btn btn-primary'>
                        <FontAwesomeIcon icon={faPlus} /> Add Employee
                    </button>
                </Link>
                
                {isAdmin && (
                    <button className='btn btn-success' onClick={() => handleDownloadEmployees()}>
                        <FontAwesomeIcon icon={faDownload} /> Download Employees
                    </button>
                )}
            </div>

            {employees.length === 0 ? (
                <p>No employees found.</p>
            ) : (
                <div className="table-responsive mt-4">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Created by</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Birthday</th>
                                <th>Department</th>
                                <th>Position</th>
                                <th>Role</th>
                                <th>Company</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((data) => (
                                <tr key={data.encrypted_id}>
                                    <td>{data.created_by?.name}</td>
                                    <td>{data.user?.name}</td>
                                    <td>{data.user?.email}</td>
                                    <td>{data.birthday}</td>
                                    <td>{data.employee_details[0]?.department}</td>
                                    <td>{data.employee_details[0]?.position?.name}</td>
                                    <td>{data.user?.role.name}</td>
                                    <td>{data.employee_details[0]?.company}</td>
                                    <td className='d-flex'>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/edit/employee/${data.encrypted_id}`)}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>

                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(data.encrypted_id)}
                                        >
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
                                    className={`page-item ${pagination.current_page === index + 1 ? 'active' : ''}`}
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

                            <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
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
