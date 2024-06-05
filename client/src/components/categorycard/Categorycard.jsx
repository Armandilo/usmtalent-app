import React from 'react'
import './Categorycard.scss'
import { Link } from 'react-router-dom' 
const Categorycard = ({item}) => {
  return (
    <Link to={`/skills?category=${item.cat}`}>
    <div className='categorycard'>
        <img src={item.img} alt="" />
        <span className='description'>{item.desc}</span>
        <span className='categorytitle'>{item.title}</span>

    </div>
    </Link>
  )
}

export default Categorycard