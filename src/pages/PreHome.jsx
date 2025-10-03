import React from "react";
import { Link, Navigate } from "react-router-dom";
import fictionalImg from "../assets/fictionalpage.webp";
import nonFictionalImg from "../assets/userdp.jpg";
import kabirSahab from "../assets/writers/kabir-sahab.webp";
import premchand from "../assets/writers/premchand.jpeg";
import styles from "./PreHome.module.css";
//import DynamicHero from '../components/DynamicHero';
import NewHero from "../components/NewHero"; // Assuming you have a NewHero component
import Faq from "../components/Faq";
import "bootstrap/dist/css/bootstrap.min.css";
import Patrika from "../components/Patrika";
import ReadingLetter from "../components/ReadingLetter";
import DynamicHero from "../components/DynamicHero";
import TopContributors from "../components/TopContributors";
import img01 from "../assets/img01.jpg"
import img02 from "../assets/img02.jpg"
import img03 from "../assets/img03.jpg"
import img04 from "../assets/img04.jpg"
import { easeIn, easeInOut, easeOut, motion, useScroll } from "motion/react"



// import "./HomeCrousel.css";

function PreHome() {
  
  return (
    <>
      {/* <DynamicHero /> */}
      <NewHero />

      <div >
        <div className={styles.card}>
          <h3>
            📚 Books: the only friends who don’t judge your weird search history
            😅
            <Link className="btn" to="/miniLibrary">
              Go to Mini Library
            </Link>
          </h3>
        </div>

        <TopContributors/>

        <div className="container-fluid d-flex flex-direction-row justify-content-center flex-wrap" style={{flexDirection:'column'}}>

        <motion.div initial={{opacity: 0 ,x:-200}} whileInView={{ opacity: 1 ,x:0}}  transition={{duration:2,property:easeInOut}} className="container-fluid "style={{background:`url(${nonFictionalImg})`,backgroundColor:'black'}}>
          <h2 className="text-center fw-bold mb-4 text-white">📚 Explore Genres</h2>
          <div
            id="genreCarousel"
            className="carousel slide w-50 justify-center"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner rounded shadow-sm ">
              <div className="carousel-item active">
                <Link to="/genre">
                  <img
                    src={img02}
                    className="d-block w-100"
                    alt="Fiction"
                  />
                  <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
                    <h5>Fiction</h5>
                    <p>Time travel, heartbreak & dragons await</p>
                  </div>
                </Link>
              </div>
              <div className="carousel-item">
                <Link to="/genre">
                  <img
                    src={img01}
                    className="d-block w-100"
                    alt="Non-Fiction"
                  />
                  <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
                    <h5>Non-Fiction</h5>
                    <p>Facts, wisdom & TED-talk vibes</p>
                  </div>
                </Link>
              </div>
              <div className="carousel-item">
                <Link to="/genre">
                  <img
                    src={img03}
                    className="d-block w-100"
                    alt="Poetry"
                  />
                  <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
                    <h5>Poetry</h5>
                    <p>Decode the universe with rhythm</p>
                  </div>
                </Link>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#genreCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" />
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#genreCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" />
            </button>
          </div>
          <h1 className="text-end">
           
          </h1>
        </motion.div>

        <motion.div  initial={{opacity:0,y:-100}} whileInView={{opacity:1,y:0}}  transition={{duration:1,property:easeInOut}} className="container">
          <h2 className="text-center fw-bold mb-4">🖋️ Meet the Legends</h2>
          <div className="contaiiner-fluid d-flex flex-wrap flex-direction-column" >
            {[
              {
                name: "Kabir Sahab",
                img: kabirSahab,
                bio: "Mystic poet with cosmic insights",
                link: "/author",
              },
              {
                name: "Premchand",
                img: premchand,
                bio: "Master of Desi drama and realism",
                link: "/author",
              },
              
              
            ].map((author, idx) => (
              <motion.div initial={{opacity:0,x:200}} whileInView={{opacity:1,x:0}} transition={{duration:2,property:'easeInOut'}}  className="col-md-4 mb-4 p-3" key={idx} style={{width:'330px'}}>
                <Link to={author.link}>
                  <div className="card shadow-sm">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <motion.img 
                        initial={{opacity:0,scale:0}} whileInView={{opacity:1,scale:1}} whileHover={{scale:0.9}} transition={{duration:2,property:'easeInOut'}}
                          src={author.img}
                          className="card-img-top rounded mh-3 " 
                          alt={author.name}
                         style={{height:'300px',width:'100%'}}/>
                        <div className="card-body text-center">
                          <h5 className="card-title">{author.name}</h5>
                        </div>
                      </div>
                      <div className=" d-flex align-items-center justify-content-center">
                        <p className="text p-3">{author.bio}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        </div>


        </div>
        
        
        <ReadingLetter/>
       
      <Patrika/>
      <Faq />
      <div className={styles.footer}>
        <h1>🚀 Welcome to Kitabi </h1>
        <p>
          📖 Your one-stop shop for bookish happiness, dramatic plots, and
          existential crises.
        </p>
        <p>
          🧠 Come for the books. Stay for the characters who make better life
          choices than us.
        </p>
        <p>
          💬 Not sure where to start?{" "}
          <Link to="/genre">Try a random genre</Link>, you rebel!
        </p>
        <p>
          Wanna know who’s behind the scenes? Visit our mysterious{" "}
          <Link to="/about">About Us</Link> page.
        </p>
      </div>
    </>
  );
}

export default PreHome;
