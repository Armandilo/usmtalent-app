import React from 'react'
import './Home.scss'
import Homecard from '../../components/homecard/Homecard'
import Homeslide from '../../components/homeslide/Homeslide'
import Categorycard from '../../components/categorycard/Categorycard'
import { cards } from '../../data';
import Features from '../../components/features/Features'
import { projects } from '../../data'
import Projectcard from '../../components/projectcard/Projectcard'
import Projectslide from '../../components/projectslide/Projectslide'
import Getstarted from '../../components/getstarted/Getstarted'

import { motion } from "framer-motion"


const Home = () => {
  return (
    <div  className='home'>
      <Homecard />
      <Homeslide slidesToShow={5} arrowsScroll={5}>
        {cards.map((item) => (
          <Categorycard item={item} key={item.id} />
        ))}
      </Homeslide>
      <Features />
      <Projectslide slidesToShow={4} arrowsScroll={4}>
        {projects.map((item) => (
          <Projectcard item={item} key={item.id} />
        ))}
      </Projectslide>
      <Getstarted />
    </div>
  )
}

export default Home