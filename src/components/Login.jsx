import React, { useState } from "react";
import '../assets/css/Login.css';
import { apiLogin } from "../api/Api.login";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton } from "@mui/material";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [severity, setSeverity] = useState("success");

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await apiLogin(username, password);
      localStorage.setItem('token', result.data.data.token);
      localStorage.setItem('refreshToken', result.data.data.refreshToken);
      localStorage.setItem('tokenExpiredAt', result.data.data.tokenExpiredAt);

      if (result.data.status === 'success') {
      navigate("/welcome");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      handleSnackbarOpen(
        error.response?.data?.message || "Error logging in. Please try again.",
        "error"
      );
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-offset-4 col-md-4 col-sm-offset-3 col-sm-6">
            <div className="form-container">
              <div className="right-content">
                <h3 className="form-title">Login</h3>
                <form className="form-horizontal" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={handleUsernameChange}
                      placeholder="Enter Username"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <div className="password-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control with-icon"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                      />
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        className="password-icon"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </div>
                  </div>
                  <div className="remember-me">
                    <input type="checkbox" className="checkbox" />
                    <span className="check-label">Remember Me</span>
                  </div>
                  <a href="#" className="forgot">
                    Forgot Password
                  </a>
                  <button type="submit" className="btn signin signinpointer">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        className="snackbar-right"
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity={severity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
