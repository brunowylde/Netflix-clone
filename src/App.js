import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import './App.css';
import MovieRow from './components/MovieRow';
import Header from './components/Header';
import FeaturedMovie from './components/FeaturedMovie';

export default()=>{

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
    	//pegando a lista total dos filmes
    	let list = await Tmdb.getHomeList();
    	setMovieList(list);

      //pegando o featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random()* (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      
      let choseninfo = await Tmdb.getMovieInfo(chosen.id,'tv');
      setFeaturedData(choseninfo);
    }

    loadAll();
  },[]);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10){
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }
    window.addEventListener('scroll', scrollListener);
    return() => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return(
      <div className="page">
        <Header black={blackHeader}/>
        {featuredData && 
          <FeaturedMovie item={featuredData}/>
        }
      	<section className="lists">
      		{movieList.map((item, key)=>
      			<div>
      				<MovieRow key={key} title={item.title} items={item.items}/>
      			</div>
      	)}
      	</section>

        { !featuredData && 
          <div className="loading">
            <img src="./ngif.gif" alt="Carregando"/>
          </div>
        }
      </div>

    );
}