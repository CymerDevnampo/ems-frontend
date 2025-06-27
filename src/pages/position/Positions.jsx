import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Positions() {
    const [positions, setPositions] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });

    const navigate = useNavigate();

    const fetchPositions = (page = 1) => {
        axiosClient
            .get(`/get/position?page=${page}`)
            .then((res) => {
                setPositions(res.data.data);
                setPagination({
                    current_page: res.data.current_page,
                    last_page: res.data.last_page,
                });
            })
            .catch((err) => {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to fetch position',
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
        fetchPositions();
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
                axiosClient.delete(`/delete/position/${encryptedId}`)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Position has been deleted.',
                            toast: true,
                            position: 'top-end',
                            timer: 3000,
                            showConfirmButton: false
                        });
                        fetchPositions();
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            text: 'Failed to delete position.',
                            toast: true,
                            position: 'top-end',
                            timer: 3000,
                            showConfirmButton: false
                        });
                    });
            }
        });
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">All Position</h3>

            <div>
                <Link className="nav-link" to="/createPosition">
                    <button className='btn btn-primary'>
                        Add Positions
                    </button>
                </Link>
            </div>

            {positions.length === 0 ? (
                <p>No positions found.</p>
            ) : (
                <div className="table-responsive mt-4">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {positions.map((data) => (
                                <tr key={data.id}>
                                    <td>{data.name}</td>
                                    <td className='d-flex'>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/edit/position/${data.encrypted_id}`)}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>

                                        <button className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(data.encrypted_id)}>
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
                                    onClick={() => fetchPositions(pagination.current_page - 1)}
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
                                        onClick={() => fetchPositions(index + 1)}
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
                                    onClick={() => fetchPositions(pagination.current_page + 1)}
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
