import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-content">
          <h1>VyaparPro</h1>
          <p className="tagline">Smart Inventory Management System</p>
          <p className="version">Version 1.0.0</p>
        </div>
      </div>

      {/* Developer Section */}
      <div className="developer-section">
        <div className="developer-card">
          <div className="developer-avatar">
            {/* You can replace this with your photo later */}
            <span className="avatar-text">AH</span>
          </div>
          <div className="developer-info">
            <h2>Abhisheka C Hegde</h2>
            <p className="developer-title">Full Stack Developer</p>
            <a href="mailto:hegdeabhisheka@gmail.com" className="developer-email">
              📧 hegdeabhisheka@gmail.com
            </a>
          </div>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h3>👨‍💻 About the Developer</h3>
            <p>
              Hi! I'm Abhisheka C Hegde, a passionate Full Stack Developer specializing in 
              modern web technologies. I created VyaparPro as a comprehensive inventory 
              management solution to help businesses streamline their operations.
            </p>
            <p>
              With expertise in the MERN stack (MongoDB, Express.js, React.js, Node.js), 
              I love building scalable, user-friendly applications that solve real-world problems.
            </p>
          </div>

          <div className="about-section">
            <h3>🚀 About VyaparPro</h3>
            <p>
              VyaparPro is a full-featured inventory management system designed to help 
              businesses track products, manage suppliers, record sales, and generate 
              comprehensive reports. Built with modern technologies and best practices, 
              it offers role-based access control and real-time analytics.
            </p>
          </div>

          <div className="about-section">
            <h3>💡 Key Features</h3>
            <ul className="features-list">
              <li>✅ User Authentication & Authorization</li>
              <li>✅ Role-based Access Control (Admin, Staff, Viewer)</li>
              <li>✅ Product Management with Categories & Suppliers</li>
              <li>✅ Sales Recording with Automatic Stock Updates</li>
              <li>✅ Interactive Dashboard with Charts & Analytics</li>
              <li>✅ Comprehensive Reports with Export Functionality</li>
              <li>✅ Responsive Design for All Devices</li>
              <li>✅ Secure JWT Authentication</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>🛠️ Tech Stack</h3>
            <div className="tech-grid">
              <div className="tech-item">
                <span className="tech-icon">💾</span>
                <span className="tech-name">MongoDB</span>
              </div>
              <div className="tech-item">
                <span className="tech-icon">⚡</span>
                <span className="tech-name">Express.js</span>
              </div>
              <div className="tech-item">
                <span className="tech-icon">⚛️</span>
                <span className="tech-name">React.js</span>
              </div>
              <div className="tech-item">
                <span className="tech-icon">🟢</span>
                <span className="tech-name">Node.js</span>
              </div>
              <div className="tech-item">
                <span className="tech-icon">🎨</span>
                <span className="tech-name">Pure CSS</span>
              </div>
              <div className="tech-item">
                <span className="tech-icon">📊</span>
                <span className="tech-name">Recharts</span>
              </div>
              <div className="tech-item">
                <span className="tech-icon">🔐</span>
                <span className="tech-name">JWT Auth</span>
              </div>
              <div className="tech-item">
                <span className="tech-icon">🔗</span>
                <span className="tech-name">Axios</span>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>📞 Contact</h3>
            <p>
              For inquiries, feedback, or collaboration opportunities, feel free to reach out:
            </p>
            <div className="contact-info">
              <a href="mailto:hegdeabhisheka@gmail.com" className="contact-link">
                📧 Email: hegdeabhisheka@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="about-footer">
        <p>© 2025 VyaparPro. Developed by Abhisheka C Hegde</p>
        <p className="made-with">Made with ❤️ using MERN Stack</p>
      </div>
    </div>
  );
};

export default About;
