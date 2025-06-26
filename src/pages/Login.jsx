import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';
import Swal from 'sweetalert2';

export default function Login({ setUser }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loadingSwal = Swal.fire({
            // title: 'Logging in...',
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
            const res = await axiosClient.post('/login', form);

            loadingSwal.close();

            Swal.fire({
                icon: 'success',
                // title: 'Login successful',
                text: 'Login successfully...',
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                timerProgressBar: true,
            // }).then(() => navigate('/dashboard'));
            });

            // Store token and user data, then navigate
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user)); // save user
            setUser(res.data.user);
            navigate('/dashboard');
        } catch (err) {
            // Close the loading toast and show error toast
            loadingSwal.close();

            const errorMessage = err.response?.data?.message || 'Please check your credentials.';

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
                <h3>Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button className="btn btn-primary" type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
