import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from './../axios';
import Swal from 'sweetalert2';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
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
            await axiosClient.post('/register', form);

            // const res = await axiosClient.post('/login', {
            //     email: form.email,
            //     password: form.password,
            // });

            loadingSwal.close();

            // localStorage.setItem('token', res.data.token);
            // localStorage.setItem('user', JSON.stringify(res.data.user));

            Swal.fire({
                icon: 'success',
                text: 'Registration successful.',
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                timerProgressBar: true,
            }).then(() => {
                navigate('/dashboard');
            });

        } catch (err) {
            loadingSwal.close();

            const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
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
            <div className="col-md-6">
                <h3>Register</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Name</label>
                        <input
                            name="name"
                            type="text"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Confirm Password</label>
                        <input
                            name="password_confirmation"
                            type="password"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button className="btn btn-success" type="submit">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
