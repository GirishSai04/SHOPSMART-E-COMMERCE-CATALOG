const { useState, useEffect, useMemo } = React;

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("https://dummyjson.com/products?limit=30");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (sortOrder === "price-asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortOrder === "title-asc") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "title-desc") {
      filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
    }

    return filtered;
  }, [products, searchQuery, filterCategory, sortOrder]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading products...</p>;
  if (error) return <p style={{ textAlign: "center" }}>Error: {error}</p>;

  return (
    <div>
      <header>
        <h1>🛒 ShopSmart</h1>
        <p>Your Smart Way to Shop Online</p>
      </header>

      <section className="controls">
        <input
          type="text"
          value={searchQuery}
          placeholder="Search products..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Sort</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>
        <button
          onClick={() => {
            setSearchQuery("");
            setFilterCategory("");
            setSortOrder("");
          }}
        >
          Clear
        </button>
      </section>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <h2>😢 No products found</h2>
          <p>Try adjusting your search or filter to find what you’re looking for.</p>
        </div>
      ) : (
        <ul className="product-grid">
          {filteredProducts.map((p) => (
            <li
              key={p.id}
              className="product-card"
              onClick={() => setModalProduct(p)}
            >
              <img src={p.images[0]} alt={p.title} />
              <h3>{p.title}</h3>
              <p>{p.category}</p>
              <p>₹{p.price}</p>
            </li>
          ))}
        </ul>
      )}

      {modalProduct && (
        <div className="modal-overlay" onClick={() => setModalProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalProduct(null)}>Close</button>
            <img src={modalProduct.images[0]} alt={modalProduct.title} />
            <h2>{modalProduct.title}</h2>
            <p><strong>Category: </strong>{modalProduct.category}</p>
            <p><strong>Price: </strong>₹{modalProduct.price}</p>
            <p>{modalProduct.description}</p>
          </div>
        </div>
      )}

      <footer>
        <p>© 2025 ShopSmart | Built with ❤️ using React</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
