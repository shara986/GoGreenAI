import React from 'react';
import './Skeletons.css';

export const PlantCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-img"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-subtitle"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-price"></div>
      <div className="skeleton-btn"></div>
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="skeleton-category">
    <div className="skeleton-cat-img"></div>
    <div className="skeleton-cat-title"></div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="skeleton-dashboard">
    <div className="skeleton-header"></div>
    <div className="skeleton-stats-grid">
      <div className="skeleton-stat-card"></div>
      <div className="skeleton-stat-card"></div>
      <div className="skeleton-stat-card"></div>
      <div className="skeleton-stat-card"></div>
    </div>
    <div className="skeleton-section-title"></div>
    <div className="skeleton-grid">
      <PlantCardSkeleton />
      <PlantCardSkeleton />
      <PlantCardSkeleton />
      <PlantCardSkeleton />
    </div>
  </div>
);

export const PlantTableSkeleton = () => (
  <div className="skeleton-table-container">
    <div className="skeleton-row header-row"></div>
    <div className="skeleton-row"></div>
    <div className="skeleton-row"></div>
    <div className="skeleton-row"></div>
    <div className="skeleton-row"></div>
    <div className="skeleton-row"></div>
  </div>
);

export const PlantFormSkeleton = () => (
  <div className="skeleton-form-container">
    <div className="skeleton-field"></div>
    <div className="skeleton-field"></div>
    <div className="skeleton-field"></div>
    <div className="skeleton-field full-width"></div>
    <div className="skeleton-field full-width"></div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="skeleton-profile-container">
    <div className="skeleton-profile-header"></div>
    <div className="skeleton-profile-card">
      <div className="skeleton-logo"></div>
      <div className="skeleton-profile-info"></div>
    </div>
  </div>
);
