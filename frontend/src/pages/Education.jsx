import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Education = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null); // For detail view modal

  const categories = ['Climate Change', 'Renewable Energy', 'Waste Reduction', 'Sustainable Living'];

  const fetchArticles = async () => {
    try {
      setLoading(true);
      let url = '/articles';
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const res = await axios.get(url, { params });
      if (res.data.success) {
        setArticles(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category]); // Auto refetch on category change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  return (
    <div className="container py-5 fade-in-up">
      <div className="text-center mb-5">
        <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-2 rounded-pill mb-2 fw-bold">
          EDUCATIONAL HUB
        </span>
        <h1 className="text-dark">Knowledge Center</h1>
        <p className="text-muted">Master sustainable lifestyle practices, renewable energy options, and clean living tips.</p>
      </div>

      {/* Filters and Search */}
      <div className="card glass-card border-0 p-4 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <form onSubmit={handleSearchSubmit} className="input-group">
              <input
                type="text"
                className="form-control form-control-eco"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-eco" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>
          <div className="col-md-7 d-flex flex-wrap gap-2 justify-content-md-end">
            <button
              className={`btn btn-sm ${category === '' ? 'btn-eco' : 'btn-eco-outline'}`}
              onClick={() => setCategory('')}
            >
              All Articles
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`btn btn-sm ${category === cat ? 'btn-eco' : 'btn-eco-outline'}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : articles.length > 0 ? (
        <div className="row g-4">
          {articles.map((art) => (
            <div className="col-md-6 col-lg-4" key={art._id}>
              <div className="card h-100 border-0 bg-white shadow-sm hover-shadow-up rounded-4 overflow-hidden">
                <img
                  src={art.image}
                  className="card-img-top"
                  alt={art.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill small py-1 px-2 fw-semibold">
                      {art.category}
                    </span>
                    <span className="text-muted small">
                      <i className="bi bi-clock me-1"></i> {art.readingTime} min read
                    </span>
                  </div>
                  <h5 className="card-title text-dark fw-bold mb-3">{art.title}</h5>
                  <p className="card-text text-secondary small mb-4">
                    {art.content.substring(0, 140)}...
                  </p>
                  <button
                    className="btn btn-eco btn-sm w-100 mt-auto"
                    onClick={() => setSelectedArticle(art)}
                  >
                    Read Article
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-journal-x fs-1 mb-2 text-secondary d-block"></i>
          No articles found matching your criteria. Try adjusting filters or keyword searches.
        </div>
      )}

      {/* Article Detail View Overlay Modal */}
      {selectedArticle && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 overflow-hidden">
              <div className="position-relative">
                <img
                  src={selectedArticle.image}
                  className="w-100"
                  alt={selectedArticle.title}
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3 bg-dark p-2 rounded-circle"
                  onClick={() => setSelectedArticle(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4 p-md-5 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-30 px-3 py-1 rounded-pill fw-bold">
                    {selectedArticle.category}
                  </span>
                  <span className="text-muted small">
                    <i className="bi bi-clock me-1"></i> {selectedArticle.readingTime} min read
                  </span>
                </div>
                <h2 className="text-dark mb-3 fw-extrabold">{selectedArticle.title}</h2>
                <p className="text-muted small mb-4">
                  By <strong>{selectedArticle.author}</strong> &bull; Published on {new Date(selectedArticle.createdAt).toLocaleDateString()}
                </p>
                <div className="text-secondary leading-relaxed small" style={{ whiteSpace: 'pre-line' }}>
                  {selectedArticle.content}
                </div>
              </div>
              <div className="modal-footer border-0 p-3 bg-light d-flex justify-content-end">
                <button type="button" className="btn btn-eco px-4" onClick={() => setSelectedArticle(null)}>
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;

const styles = `
.hover-shadow-up {
  transition: all 0.3s ease;
}
.hover-shadow-up:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(45, 106, 79, 0.12) !important;
}
`;
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(styles));
  document.head.appendChild(style);
}
