import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [recentSales, setRecentSales] = useState([]);

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [summaryRes, monthlyRes, categoryRes, recentRes] = await Promise.all([
        API.get('/analytics/summary'),
        API.get('/analytics/monthly-sales'),
        API.get('/analytics/category-distribution'),
        API.get('/analytics/recent-sales?limit=5'),
      ]);

      setSummary(summaryRes.data);
      setMonthlySales(monthlyRes.data);
      setCategoryDistribution(categoryRes.data);
      setRecentSales(recentRes.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}! 👋</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card card-purple">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>{summary?.totalProducts || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="card card-blue">
          <div className="card-icon">🏷️</div>
          <div className="card-content">
            <h3>{summary?.totalCategories || 0}</h3>
            <p>Categories</p>
          </div>
        </div>

        <div className="card card-green">
          <div className="card-icon">🚚</div>
          <div className="card-content">
            <h3>{summary?.totalSuppliers || 0}</h3>
            <p>Suppliers</p>
          </div>
        </div>

        <div className="card card-orange">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>{summary?.totalSales || 0}</h3>
            <p>Total Sales</p>
          </div>
        </div>

        <div className="card card-pink">
          <div className="card-icon">💵</div>
          <div className="card-content">
            <h3>₹{summary?.totalRevenue || 0}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="card card-teal">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>₹{summary?.totalStockValue || 0}</h3>
            <p>Stock Value</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Monthly Sales Chart */}
        <div className="chart-card">
          <h3>Monthly Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalSales"
                stroke="#667eea"
                strokeWidth={3}
                name="Sales (₹)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Count Bar Chart */}
        <div className="chart-card">
          <h3>Sales Count by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#764ba2" name="Number of Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution & Recent Sales */}
      <div className="charts-section">
        {/* Category Distribution Pie Chart */}
        <div className="chart-card">
          <h3>Stock Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="totalStock"
                nameKey="categoryName"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Sales Table */}
        <div className="chart-card">
          <h3>Recent Sales</h3>
          <div className="recent-sales-list">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div key={sale._id} className="sale-item">
                  <div className="sale-info">
                    <strong>{sale.productName}</strong>
                    <span className="sale-date">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="sale-amount">
                    <span className="quantity">{sale.quantitySold} units</span>
                    <span className="price">₹{sale.totalPrice}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent sales</p>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {summary?.lowStockProducts && summary.lowStockProducts.length > 0 && (
        <div className="low-stock-alert">
          <h3>⚠️ Low Stock Alert</h3>
          <div className="low-stock-list">
            {summary.lowStockProducts.map((product) => (
              <div key={product._id} className="low-stock-item">
                <span className="product-name">{product.name}</span>
                <span className="product-sku">SKU: {product.sku}</span>
                <span className="stock-badge">{product.quantity} left</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
