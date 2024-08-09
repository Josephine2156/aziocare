import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

const Navigation = ({ isLoggedIn, userRole, profileIncomplete, handleLogout }) => {
  const navigate = useNavigate();

  console.log("isLoggedIn:", isLoggedIn);
  console.log("userRole:", userRole);
  console.log("profileIncomplete:", profileIncomplete);

  const logoutAndNavigate = () => {
    handleLogout(navigate);
  };

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <Link className="navbar-brand page-scroll" to="/">
            AzioCare
          </Link>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            {!isLoggedIn && (
              <>
                <li>
                  <HashLink smooth to="/#about" className="page-scroll">
                    About
                  </HashLink>
                </li>
                <li>
                  <HashLink smooth to="/#services" className="page-scroll">
                    Services
                  </HashLink>
                </li>
                <li>
                  <HashLink smooth to="/#portfolio" className="page-scroll">
                    Gallery
                  </HashLink>
                </li>
                <li>
                  <HashLink smooth to="/#testimonials" className="page-scroll">
                    Testimonials
                  </HashLink>
                </li>
                <li>
                  <HashLink smooth to="/#team" className="page-scroll">
                    FAQ
                  </HashLink>
                </li>
                <li>
                  <HashLink smooth to="/#contact" className="page-scroll">
                    Contact
                  </HashLink>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
            {isLoggedIn && userRole === 'Patient' && !profileIncomplete && (
              <>
                <li>
                  <Link to="/dashboard/patient">Dashboard</Link>
                </li>
                
                <li>
                  <Link to="/" onClick={logoutAndNavigate}>Logout</Link>
                </li>
              </>
            )}
            {isLoggedIn && userRole === 'Patient' && profileIncomplete && (
              <>
                <li>
                  <Link to="/" onClick={logoutAndNavigate}>Logout</Link>
                </li>
              </>
            )}
            {isLoggedIn && userRole === 'Doctor' && (
              <>
                <li>
                  <Link to="/dashboard/doctor">Dashboard</Link>
                </li>
                <li>
                  <Link to="/" onClick={logoutAndNavigate}>Logout</Link>
                </li>
              </>
            )}
            {isLoggedIn && userRole === 'Admin' && (
              <>
                <li>
                  <Link to="/dashboard/admin">Dashboard</Link>
                </li>
                <li>
                  <Link to="/" onClick={logoutAndNavigate}>Logout</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
