export default function Dashboard({ user }) {
    return (
        <div className="mt-5 text-center">
            <h1>Dashboard</h1>
            <p className="lead">Welcome back, <strong>{user.name}</strong>!</p>

            <div className="mt-4">
                <p>You are now logged in and can access protected resources.</p>
                {/* You can add more dashboard features here */}
            </div>
        </div>
    );
}
