import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from './../axios';

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
        try {
            await axiosClient.post('/register', form);
            alert('Registration successful. Please login.');
            navigate('/login');
        } catch (err) {
            alert('Registration failed.');
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
