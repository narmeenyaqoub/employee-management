import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ initialUser, onSave }) => {
  const [userData, setUserData] = useState({
    fullName: initialUser?.fullName || 'Soran Ahmed',
    email: initialUser?.email || 'admin@mol.gov',
    role: initialUser?.role || 'Admin',
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(userData);
    }
    alert('Profile updated successfully!');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-container">
      <h2 className="profile-page-title">My Profile</h2>

      <div className="profile-card">
        <div className="profile-banner"></div>

        <div className="profile-card-body">
          <div className="profile-avatar-badge">
            {getInitials(userData.fullName)}
          </div>

          <div className="profile-user-meta">
            <h3 className="profile-user-name">{userData.fullName}</h3>
            <p className="profile-user-email">{userData.email}</p>
            <span className="profile-role-badge">{userData.role}</span>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-input-group">
              <label className="profile-label">FULL NAME</label>
              <input
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleChange}
                className="profile-input"
              />
            </div>

            <div className="profile-input-group">
              <label className="profile-label">EMAIL</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="profile-input"
              />
            </div>

            <div className="profile-input-group">
              <label className="profile-label">CURRENT PASSWORD</label>
              <input
                type="password"
                name="currentPassword"
                placeholder="••••••••"
                value={userData.currentPassword}
                onChange={handleChange}
                className="profile-input"
              />
            </div>

            <div className="profile-input-group">
              <label className="profile-label">NEW PASSWORD</label>
              <input
                type="password"
                name="newPassword"
                placeholder="••••••••"
                value={userData.newPassword}
                onChange={handleChange}
                className="profile-input"
              />
            </div>

            <button type="submit" className="profile-save-btn">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;