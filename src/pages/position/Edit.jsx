import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios';
import Swal from 'sweetalert2';

export default function EditPosition() {
    const { id } = useParams(); // encrypted ID
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
    });

    useEffect(() => {
        axiosClient.get(`/edit/position/${id}`).then((res) => {
            const data = res.data;
            setForm({
                name: data.name,
            });
        }).catch(() => {
            Swal.fire('Failed to load position', '', 'error');
            navigate('/positions');
        });
    }, [id]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosClient.put(`/update/position/${id}`, form)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    text: 'Position updated successfully.',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                    timerProgressBar: true
                });
                navigate('/positions');
            })
            .catch((err) => {
                const errorMessage = err.response?.data?.message || 'There was an error while updating the position.';
                Swal.fire({
                    icon: 'error',
                    text: errorMessage,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                    timerProgressBar: true
                });
                console.error(err.response?.data);
            });
    };

    return (
        <div className="container mt-4">
            <h3>Edit Position</h3>
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

                </div>
                <div className="mt-3 d-flex gap-1">
                    <button className="btn btn-success">Update</button>
                    <Link className="nav-link" to="/positions">
                        <button className="btn btn-secondary" type="button">
                            Back
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
