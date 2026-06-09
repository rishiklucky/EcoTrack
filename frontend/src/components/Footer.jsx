import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-md-4 mb-4">
            <h5 className="brand-font d-flex align-items-center gap-2 text-success">
              <i className="bi bi-leaf-fill"></i> EcoTrack
            </h5>
            <p className="text-secondary small mt-3">
              EcoTrack is a carbon footprint tracking and awareness platform built to empower individuals to make sustainable daily choices, achieve goals, and reduce global warming.
            </p>
          </div>
          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase fw-bold text-success mb-3">Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/" className="text-secondary text-decoration-none hover-white">Home</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none hover-white">About Climate Change</Link></li>
              <li><Link to="/calculator" className="text-secondary text-decoration-none hover-white">Emissions Calculator</Link></li>
              <li><Link to="/education" className="text-secondary text-decoration-none hover-white">Educational Hub</Link></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase fw-bold text-success mb-3">Goal Targets</h6>
            <p className="text-secondary small">
              Let's aim to reduce personal emissions by 30% by 2030. Every small step counts.
            </p>
            <div className="d-flex gap-3 fs-5 mt-3 text-secondary">
              <i className="bi bi-github cursor-pointer hover-white"></i>
              <i className="bi bi-twitter cursor-pointer hover-white"></i>
              <i className="bi bi-globe cursor-pointer hover-white"></i>
            </div>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
          <span>&copy; {new Date().getFullYear()} EcoTrack Platform. All Rights Reserved.</span>
          <span className="mt-2 mt-md-0">Designed with <i className="bi bi-heart-fill text-danger mx-1"></i> for a cleaner Earth.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
const hoverStyle = `
.hover-white:hover {
  color: #fff !important;
}
.cursor-pointer {
  cursor: pointer;
}
`;
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(hoverStyle));
  document.head.appendChild(style);
}
