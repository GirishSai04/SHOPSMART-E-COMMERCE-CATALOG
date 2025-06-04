const { useState, useMemo } = React;

const productsData = [
  {
    id: 'p1',
    title: 'Wireless Headphones',
    category: 'electronics',
    price: 59.99,
    description: 'High-quality wireless headphones with noise cancellation.',
    image: 'https://images.unsplash.com/photo-1512499617640-c2f999f7e4cc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p2',
    title: 'Running Shoes',
    category: 'footwear',
    price: 89.99,
    description: 'Durable running shoes for all terrain.',
    image: 'https://images.unsplash.com/photo-1528701800489-2e5c1662101f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p3',
    title: 'Smart Watch',
    category: 'electronics',
    price: 129.99,
    description: 'Smart watch with activity tracking features.',
    image: 'https://images.unsplash.com/photo-1513679563401-4e57bcf675f9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p4',
    title: 'Leather Wallet',
    category: 'accessories',
    price: 29.99,
    description: 'Premium genuine leather wallet with multiple compartments.',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p5',
    title: 'Sunglasses',
    category: 'accessories',
    price: 19.99,
    description: 'Stylish UV protection sunglasses for everyday wear.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p6',
    title: 'Office Chair',
    category: 'furniture',
    price: 149.99,
    description: 'Ergonomic office chair with adjustable height and lumbar support.',
    image: 'https://images.unsplash.com/photo-1587825140708-b49bbcf9ff00?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p7',
    title: 'Coffee Maker',
    category: 'home appliances',
    price: 89.99,
    description: 'Brew the perfect cup of coffee with this compact coffee maker.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p8',
    title: 'Yoga Mat',
    category: 'fitness',
    price: 25.99,
    description: 'Non-slip yoga mat with extra cushioning for comfort.',
    image: 'https://images.unsplash.com/photo-1590944917862-51bcf27bb4d9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p9',
    title: 'Bluetooth Speaker',
    category: 'electronics',
    price: 45.99,
    description: 'Portable Bluetooth speaker with deep bass and waterproof design.',
    image: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p10',
    title: 'Backpack',
    category: 'accessories',
    price: 39.99,
    description: 'Durable backpack with multiple pockets and laptop compartment.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'
  }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [modalProduct, setModalProduct] = useState(null);

  const categories = useMemo(() => {
    const cats = new Set(productsData.map(p => p.category));
    return Array.from(cats);
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = productsData;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (sortOrder === 'price-asc') {
      filtered = filtered.slice().sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      filtered = filtered.slice().sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'title-asc') {
      filtered = filtered.slice().sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'title-desc') {
      filtered = filtered.slice().sort((a, b) => b.title.localeCompare(a.title));
    }

    return filtered;
  }, [searchQuery, filterCategory, sortOrder]);

  return (
    <>
      <section className="controls">
        <input type="text" value={searchQuery} placeholder="Search products..." onChange={e => setSearchQuery(e.target.value)} />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="">Sort</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>
        <button onClick={() => {
          setSearchQuery('');
          setFilterCategory('');
          setSortOrder('');
        }}>Clear</button>
      </section>

      <ul className="product-grid">
        {filteredProducts.map(p => (
          <li key={p.id} className="product-card" onClick={() => setModalProduct(p)}>
            <img src={p.image} alt={p.title} className="product-image" />
            <div className="product-info">
              <h3 className="product-title">{p.title}</h3>
              <p className="product-category">{p.category}</p>
              <p className="product-price">₹{p.price}</p>
            </div>
          </li>
        ))}
      </ul>

      {modalProduct && (
        <div className="modal-overlay" onClick={() => setModalProduct(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setModalProduct(null)}>&times;</button>
            <img src={modalProduct.image} alt={modalProduct.title} />
            <h2>{modalProduct.title}</h2>
            <p><strong>Category: </strong>{modalProduct.category}</p>
            <p><strong>Price: </strong>₹{modalProduct.price}</p>
            <p>{modalProduct.description}</p>
          </div>
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
