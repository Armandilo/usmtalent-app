import React from "react";
import "./EditSkills.scss";
import { INITIAL_STATE } from "../../reducers/skillReducer";
import { useReducer } from "react";
import { skillReducer } from "../../reducers/skillReducer";
import { useState } from "react";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";




const EditSkills = () => {

  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(skillReducer, INITIAL_STATE);

  const { id } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { data: skill, isLoading } = useQuery({
    queryKey: ["skill", id],
    queryFn: () => newRequest.get(`/skills/single/${id}`)
  });

  

  

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

  

  const mutation = useMutation({
    mutationKey: 'updateSkill',
    mutationFn: (skill) => {
      return newRequest.put(`/skills/${id}`, skill);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mySkills"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const myUserId = currentUser._id;
    mutation.mutate({...state, userId:myUserId});
    navigate("/mySkills")
  };

  useEffect(() => {
    if (skill) {
      // Transform the skill object into the shape that your reducer expects
      
      const transformedSkill = {
        title: skill.data.title,
        category: skill.data.category,
        cover: skill.data.cover,
        images: skill.data.images,
        desc: skill.data.desc,
        shortTitle: skill.data.shortTitle,
        shortDesc: skill.data.shortDesc,
        deliveryTime: skill.data.deliveryTime,
        revisionNumber: skill.data.revisionNumber,
        features: skill.data.features,
        price: skill.data.price,
      };
      
      dispatch({ type: "SET_SKILL", payload: transformedSkill });
    }
  }, [skill]);

  const mutationDelete = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mySkills"]);
    },
  });

  const handleDelete = () => {
    mutationDelete.mutate(id);
    navigate("/mySkills");
  };

  




  return (
    <div className="edit">
      {isLoading ? ("Loading") : (<div className="container">
      <div className="breadcrumbs">
          <span><Link to="/mySkills" className="link">MY SKILL</Link> {">"} EDIT SKILL</span>
        </div>
        <div className="sections">
          <div className="info">
            <div className="sectionheader">
              <h1>Edit Skill</h1>
            </div>
          
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"  
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
              value={state.title}
            />

            <label htmlFor="">Short Title</label>
            <input type="text" name="shortTitle" placeholder="e.g. One-page web design" onChange={handleChange} value={state.shortTitle}/>

            <label htmlFor="">Category</label>
            <select name="category" id="category" onChange={handleChange} value={state.category}>
              <option value="design">Graphic & Design</option>
              <option value="marketing">Digital Marketing</option>
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
            onChange={handleChange}
            value={state.desc}>

            </textarea>

            <label htmlFor="">Price</label>
            <input name="price" onChange={handleChange} type="number" value={state.price} />
            <div className="emptyspace">

            </div>
          </div>
          <div className="details">

            
            <div className="buttondiv">
              <button className="deletebutton" onClick={handleDelete}><FaTrashAlt/>Delete</button>
            </div>
            <label htmlFor="">Short Description</label>
            <textarea name="shortDesc" id="" onChange={handleChange} placeholder="Short description of your service" cols="30" rows="2" value={state.shortDesc}></textarea>
            
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} value={state.deliveryTime} />

            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature} >
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
            <input type="number" name="revisionNumber" onChange={handleChange} value={state.revisionNumber}/>



            
            <button onClick={handleSubmit} className="createbtn"><IoMdSend/>Save</button>
          </div>
        </div>
      </div>)}
    </div>
  );
};

export default EditSkills;