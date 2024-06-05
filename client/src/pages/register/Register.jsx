  import React, { useState } from "react";
  import upload from "../../utils/upload";
  import "./Register.scss";
  import newRequest from "../../utils/newRequest";
  import { useNavigate } from "react-router-dom";
  import { FiPlus } from "react-icons/fi";
  import { IoLogInSharp } from "react-icons/io5";


  function Register() {
    const [file, setFile] = useState(null);
    const [user, setUser] = useState({
      username: "",
      email: "",
      password: "",
      img: "",
      country: "",
      isSeller: true,
      desc: "",
    });

    console.log(user);
    

    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }

      setFile(file);
    };

    const handleChange = (e) => {
      setUser((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    };

    const handleSeller = (e) => {
      setUser((prev) => {
        return { ...prev, isSeller: e.target.checked };
      });
    };
    const handleSubmit = async (e) => {
      e.preventDefault();

      const url = await upload(file);
      try {
        await newRequest.post("/auth/register", {
          ...user,
          img: url,
        });
        alert("User created successfully");
        navigate("/")
      } catch (err) {
        console.log(err);
      }
    };

  
    return (
      <div className="register">
   

        <div className="registercontainer">
        <form onSubmit={handleSubmit}>
          <div className="left">
            
            <h1>Create a new account</h1>
            <label htmlFor="">Profile Picture</label>
            <input id='upload-button' type="file" onChange={handleFileChange} style={{display:'none'}}/>
            <button className='inputButton' style={{backgroundImage: `url(${image})`, backgroundSize: 'cover'}} onClick={()=> document.getElementById('upload-button').click()}>{!image && (<><FiPlus className="icon"/></>) }</button>
            
            <label htmlFor="">Username</label>
            <input
              name="username"
              type="text"
              placeholder="John Doe"
              onChange={handleChange}
            />
            <label htmlFor="">Email</label>
            <input
              name="email"
              type="email"
              placeholder="johndoe@gmail.com"
              onChange={handleChange}
            />
            <label htmlFor="">Password</label>
            <input name="password" type="password" onChange={handleChange} />

            
        

            <label htmlFor="">Country</label>
            <input
              name="country"
              type="text"
              placeholder="Malaysia"
              onChange={handleChange}
            />
            
          </div>

          <div className="right">

            <label htmlFor="">Phone Number</label>
            <input
              name="phone"
              type="text"
              placeholder="+60111857291"
              onChange={handleChange}
            />
            <label htmlFor="">Description</label>
            <textarea
              placeholder="A short description of yourself"
              name="desc"
              id=""
              cols="30"
              rows="10"
              onChange={handleChange}
            ></textarea>
            <button type="submit"><IoLogInSharp size={24}/> Register</button>
          </div>
          
        </form>
        </div>
      </div>
    );
  }

  export default Register;