import React, { useState } from "react";
import "./CSS/LoginSignup.css";

const LoginSignup = () => {

  const [state,setState] = useState("Login");
  const [formData,setFormData] = useState({username:"",email:"",password:""});
  const [errors, setErrors] = useState({});

  const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value});
    setErrors({...errors, [e.target.name]: ""}); // Clear the error message when the input changes
  }

  const validateForm = () => {
    const newErrors = {};

    if (state === "Sign Up" && !formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = "Please provide password atleast 5 character's";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  const isValidEmail = (email) => {
    // Simple email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    // Password must contain at least 5 alphanumeric characters and 1 special character
    const passwordRegex = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,}$/;
    return passwordRegex.test(password);
  };

  const login = async () => {
    // Validation before submitting the form
    if (validateForm()) {
      // Proceed with login
      let dataObj;
      await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((resp) => resp.json())
        .then((data) => {dataObj=data});
        console.log(dataObj);
        if (dataObj.success) {
          localStorage.setItem('auth-token',dataObj.token);
          window.location.replace("/");
        }
        else
        {
          alert(dataObj.errors)
        }
    }
  }

  const signup = async () => {
    // Validation before submitting the form
    if (validateForm()) {
      // Proceed with signup
      let dataObj;
      await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((resp) => resp.json())
        .then((data) => {dataObj=data});

        if (dataObj.success) {
          localStorage.setItem('auth-token',dataObj.token);
          window.location.replace("/");
        }
        else
        {
          alert(dataObj.errors)
        }
    }
  }

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign Up"?<input type="text" placeholder="Your name" name="username" value={formData.username} onChange={changeHandler}/>:<></>}
          {errors.username && <p className="error-message">{errors.username}</p>} {/* Display username error message */}
          <input type="email" placeholder="Email address" name="email" value={formData.email} onChange={changeHandler}/>
          {errors.email && <p className="error-message">{errors.email}</p>} {/* Display email error message */}
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={changeHandler}/>
          {errors.password && <p className="error-message">{errors.password}</p>} {/* Display password error message */}
        </div>

        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>

        {state==="Login"?
        <p className="loginsignup-login">Create an account? <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>
        :<p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>}

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
