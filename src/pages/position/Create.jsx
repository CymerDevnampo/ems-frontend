import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios';
import Swal from 'sweetalert2';

export default function CreatePosition() {
    const [form, setForm] = useState({
        name: '',
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
            await axiosClient.post('/store/position', form);
            Swal.fire({
                icon: 'success',
                text: 'Position added Successfully...',
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                timerProgressBar: true
            });
            navigate('/positions');
        } catch (err) {
            loadingSwal.close();

            const errorMessage = err.response?.data?.message || 'Theres an error while adding the position.';

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
                <h3>Add Position</h3>
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

                    </div>

                    {/* Submit Button */}
                    <div className="mt-4 d-flex gap-1">
                        <button className="btn btn-success" type="submit">
                            Add
                        </button>

                        <button className="btn btn-secondary" type="button">
                            <Link className="nav-link" to="/positions">Back</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}
