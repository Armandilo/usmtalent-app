import React from "react";
import "./AddSkills.scss";
import { INITIAL_STATE } from "../../reducers/skillReducer";
import { useReducer } from "react";
import { skillReducer } from "../../reducers/skillReducer";
import { useState } from "react";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import {FiCheckCircle} from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { Link } from "react-router-dom";




const AddSkills = () => {

  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(skillReducer, INITIAL_STATE);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (skill) => {
      return newRequest.post("/skills", skill);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mySkills"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const myUserId = currentUser._id;
    mutation.mutate({...state, userId: myUserId});
    navigate("/mySkills")
  };

  console.log(state);
  return (
    <div className="add">
      <div className="container">
        
        <div className="breadcrumbs">
          <span><Link to="/mySkills" className="link">MY SKILL</Link> {">"} ADD SKILL</span>
        </div>

        <div className="sections">
          <div className="info">

          <div className="sectionheader">
            <h1>Add Skill</h1>
          </div>
          
          <div className="images">
              <div className="imagesInputs">
              <div className="cover">
                <label htmlFor="">Cover</label>
                <input type="file" id="cover-image" style={{display:'none'}} onChange={(e)=> setSingleFile(e.target.files[0])} />
                <button className='inputButton'  onClick={()=> document.getElementById('cover-image').click()}>{singleFile? <FiCheckCircle className="icon"/> : <FiPlus className="icon"/>}</button>
              </div>

              <div className="pageimage">
              <label htmlFor="">Product</label>
              <input type="file" id="skillimage" style={{display:'none'}} multiple onChange={(e)=> setFiles(e.target.files)} accept="image/*,video/*"/>
              <button className='inputButton'  onClick={()=> document.getElementById('skillimage').click()}>{files.length>0 ? <FiCheckCircle className="icon"/> : <FiPlus className="icon"/>}</button>
              </div>
              </div>
              <button className="uploadbutton" onClick={handleUpload}>
                  {uploading ? "Uploading..." : "Upload"}
              </button>
    
              
              
          </div>
          
            
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"  
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="category" id="category" onChange={handleChange} defaultValue="design">
              <option value="design">Graphic & Design</option>
              <option value="digital">Digital Marketing</option>
              <option value="writing">Writing & Translation</option>
              <option value="video">Video & Animation</option>
              <option value="music">Music & Audio</option>
              <option value="programming">Programming & Tech</option>
              <option value="business">Business</option>
              <option value="events">Events</option>
              <option value="education">Education</option>
              <option value="others">Others</option>
            </select>
            
            

            <label htmlFor="">Description</label>
            <textarea 
            name="desc" id="" 
            placeholder="Brief descriptions to introduce your service to customers" 
            cols="0" 
            rows="3"
            onChange={handleChange}>

            </textarea>
            <label htmlFor="">Price</label>
            <input name="price" onChange={handleChange} type="number" />

            <div className="emptyspace">

            </div>
           
          </div>
          <div className="details">
            <div className="emptyspace2"></div>
            <label htmlFor="">Short Title</label>
            <input type="text" name="shortTitle" placeholder="e.g. One-page web design" onChange={handleChange}/>

            <label htmlFor="">Short Description</label>
            <textarea name="shortDesc" id="" onChange={handleChange} placeholder="Short description of your service" cols="30" rows="1"></textarea>
            
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} />
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit"><FaCirclePlus />Add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            <label htmlFor="">Revision Number</label>
            <input type="number" name="revisionNumber" onChange={handleChange}/>

          

            <button className="createbtn" onClick={handleSubmit}><IoMdSend />Create</button>          
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AddSkills;