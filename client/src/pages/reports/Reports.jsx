import { useState, useEffect } from 'react';
import API from '../../utils/api';
import {
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
import './Reports.css';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#feca57', '#48dbfb'];

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const [summaryRes, topProductsRes, categoryRes, monthlyRes] = await Promise.all([
        API.get('/analytics/summary'),
        API.get('/analytics/top-products'),
        API.get('/analytics/category-distribution'),
        API.get('/analytics/monthly-sales'),
      ]);

      setSummary(summaryRes.data);
      setTopProducts(topProductsRes.data);
      setCategoryDistribution(categoryRes.data);
      setMonthlySales(monthlyRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvData = [
      ['VyaparPro - Sales Report'],
      [''],
      ['Summary'],
      ['Total Products', summary?.totalProducts || 0],
      ['Total Categories', summary?.totalCategories || 0],
      ['Total Suppliers', summary?.totalSuppliers || 0],
      ['Total Sales', summary?.totalSales || 0],
      ['Total Revenue', `₹${summary?.totalRevenue || 0}`],
      ['Total Stock Value', `₹${summary?.totalStockValue || 0}`],
      [''],
      ['Top Selling Products'],
      ['Product Name', 'SKU', 'Quantity Sold', 'Revenue'],
      ...topProducts.map((p) => [
        p.product?.name || 'N/A',
        p.product?.sku || 'N/A',
        p.totalQuantitySold,
        `₹${p.totalRevenue}`,
      ]),
    ];

    const csv = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VyaparPro_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Generating reports...</p>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>📈 Business Reports</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={printReport}>
            🖨️ Print
          </button>
          <button className="btn-primary" onClick={exportToCSV}>
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Summary Overview */}
      <div className="report-section">
        <h2>Summary Overview</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Total Products</span>
            <span className="summary-value">{summary?.totalProducts || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Categories</span>
            <span className="summary-value">{summary?.totalCategories || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Suppliers</span>
            <span className="summary-value">{summary?.totalSuppliers || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Sales</span>
            <span className="summary-value">{summary?.totalSales || 0}</span>
          </div>
          <div className="summary-item highlight">
            <span className="summary-label">Total Revenue</span>
            <span className="summary-value">₹{summary?.totalRevenue || 0}</span>
          </div>
          <div className="summary-item highlight">
            <span className="summary-label">Stock Value</span>
            <span className="summary-value">₹{summary?.totalStockValue || 0}</span>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="report-section">
        <h2>Top Selling Products</h2>
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Quantity Sold</th>
                <th>Sales Count</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="rank-cell">#{index + 1}</td>
                    <td>{product.product?.name || 'N/A'}</td>
                    <td>{product.product?.sku || 'N/A'}</td>
                    <td>{product.totalQuantitySold}</td>
                    <td>{product.salesCount}</td>
                    <td className="revenue-cell">₹{product.totalRevenue?.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No sales data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Monthly Sales Chart */}
        <div className="report-section">
          <h2>Monthly Sales Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSales" fill="#667eea" name="Revenue (₹)" />
              <Bar dataKey="count" fill="#764ba2" name="Sales Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Chart */}
        <div className="report-section">
          <h2>Stock Distribution by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="totalStock"
                nameKey="categoryName"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.categoryName}: ${entry.totalStock}`}
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
      </div>

      {/* Category Details Table */}
      <div className="report-section">
        <h2>Category-wise Stock Report</h2>
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Products Count</th>
                <th>Total Stock</th>
                <th>Stock Value</th>
              </tr>
            </thead>
            <tbody>
              {categoryDistribution.length > 0 ? (
                categoryDistribution.map((cat, index) => (
                  <tr key={index}>
                    <td>{cat.categoryName}</td>
                    <td>{cat.productCount}</td>
                    <td>{cat.totalStock}</td>
                    <td className="value-cell">₹{cat.totalValue?.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">No category data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      {summary?.lowStockProducts && summary.lowStockProducts.length > 0 && (
        <div className="report-section alert-section">
          <h2>⚠️ Low Stock Alert</h2>
          <div className="alert-grid">
            {summary.lowStockProducts.map((product) => (
              <div key={product._id} className="alert-item">
                <div className="alert-product">
                  <strong>{product.name}</strong>
                  <span className="alert-sku">SKU: {product.sku}</span>
                </div>
                <span className="alert-stock">
                  Only {product.quantity} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Footer */}
      <div className="report-footer">
        <p>Report Generated: {new Date().toLocaleString('en-IN')}</p>
        <p>VyaparPro - Inventory Management System</p>
      </div>
    </div>
  );
};

export default Reports;
