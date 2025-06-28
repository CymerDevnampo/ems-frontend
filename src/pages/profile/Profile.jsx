import { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import Swal from 'sweetalert2';

export default function Profile() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        profile_photo: null,
        preview: null,
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    useEffect(() => {
        axiosClient.get('/get/profile').then(({ data }) => {
            const user = data[0];
            const baseURL = new URL(axiosClient.defaults.baseURL).origin;

            setForm({
                name: user.name,
                email: user.email,
                profile_photo: null,
                preview: user.profile_photo
                    ? `${baseURL}/storage/avatar/${user.profile_photo}`
                    : null,

            });
        });
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setForm((prev) => ({
            ...prev,
            profile_photo: file,
            preview: URL.createObjectURL(file),
        }));
    };

    const handleSubmitProfile = (e) => {
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

        const payload = new FormData();
        payload.append('name', form.name);
        payload.append('email', form.email);
        if (form.profile_photo) {
            payload.append('profile_photo', form.profile_photo);
        }

        axiosClient
            .post('/profile/update', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    // title: 'Login successful',
                    text: 'Profile updated successfully...',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                    timerProgressBar: true,
                    // }).then(() => navigate('/dashboard'));
                });
            })
            .catch((err) => {
                loadingSwal.close();

                const errorMessage = err.response?.data?.message || 'Please check your input.';

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
            });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitPassword = (e) => {
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

        axiosClient
            .post('/profile/password', passwordForm)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    // title: 'Login successful',
                    text: 'Password updated successfully...',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                    timerProgressBar: true,
                    // }).then(() => navigate('/dashboard'));
                });
                setPasswordForm({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: '',
                });
            })
            .catch((err) => {
                loadingSwal.close();

                const errorMessage = err.response?.data?.message || 'Please check your input.';

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
            });
    };

    return (
        <div className="container mt-4">
            <h3>My Profile</h3>
            <form onSubmit={handleSubmitProfile} encType="multipart/form-data">
                <div className="mb-3">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleProfileChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleProfileChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label>Profile Photo</label>
                    <input type="file" onChange={handleFileChange} className="form-control" />
                    {form.preview ? (
                        <img
                            src={form.preview}
                            onError={() => console.log('Image failed to load', form.preview)}
                            alt="Preview"
                            width={100}
                            className="mt-2 border rounded"
                        />
                    ) : (
                        <div className="text-muted">No preview</div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary">
                    Update Profile
                </button>
            </form>

            <hr />

            <h4>Change Password</h4>
            <form onSubmit={handleSubmitPassword}>
                <div className="mb-3">
                    <label>Current Password</label>
                    <input
                        type="password"
                        name="current_password"
                        value={passwordForm.current_password}
                        onChange={handlePasswordChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label>New Password</label>
                    <input
                        type="password"
                        name="new_password"
                        value={passwordForm.new_password}
                        onChange={handlePasswordChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        name="new_password_confirmation"
                        value={passwordForm.new_password_confirmation}
                        onChange={handlePasswordChange}
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-success">
                    Update Password
                </button>
            </form>
        </div>
    );
}
