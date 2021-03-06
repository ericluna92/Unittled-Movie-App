import React, { Component } from 'react';
import Footer from './footer';
import Nav from './nav';
import './main.css';
import './movie.css';

class Movie extends Component {
  constructor(props) {
      super(props);
      this.state = { 
        amount:0,
        count:0,
        poster:"",
        title:"",
        release_date:"",
        overview:"",
        id:"",
        trailer:"",
        toggleContainer:"hide",
        toggleButton:"hide",
        toggleTrailer:"trailer"
      };

      this.handleClickNext = this.handleClickNext.bind(this);
      this.handleClickLast = this.handleClickLast.bind(this);
      this.request = this.request.bind(this);
      this.trailer = this.trailer.bind(this);

      window.addEventListener('keydown', e => this.enter(e));
      window.addEventListener('keydown', e => this.arrow(e));
  }

  request(){
    let movie = this;
    let search = document.getElementById('search').value;
    let xmlhttp = new XMLHttpRequest();
    let url = "http://api.themoviedb.org/3/search/movie?api_key=39124889ea92aada0703109651a543ab&query="+search;

    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        movie.setState({count:0});
        let myArr = JSON.parse(this.responseText);
        let poster_path=myArr.results[movie.state.count]['poster_path'];
        let poster = '';
        let title = myArr.results[movie.state.count]['title'];
        let overview = myArr.results[movie.state.count]['overview'];
        let release_date = myArr.results[movie.state.count]['release_date'];

        if(poster_path === null ){
          poster=require('./img/noPoster.jpg');
        }else{
          poster = 'http://image.tmdb.org/t/p/w500/'+poster_path;
        }
        movie.setState({arr:myArr});
        movie.setState({amount:myArr.results.length});
        movie.setState({poster:poster});
        movie.setState({title:title});

        if(release_date === ""){
          movie.setState({release_date:"N/A"});
        }else{
          movie.setState({release_date:release_date});
        }

        if (overview === "") {
          this.setState({overview:"No Description Available"});
        }
        // if overview is over 500 characters cut it short 
        else if (overview.length > 700) {
          let shorter = overview.slice(0,700)+"...";
          movie.setState({overview:shorter});
        }
        // add summary to page
        else {
          movie.setState({overview:overview});
        }

        if(movie.state.toggleContainer==='hide'){
          movie.toggleContainer();
        }
        movie.toggleButton();

        // Second Call
        let id = myArr.results[0]["id"];
        let url2 = "http://api.themoviedb.org/3/movie/" + id + "/videos?api_key=39124889ea92aada0703109651a543ab";
        xmlhttp.onreadystatechange = function() {
          if (this.readyState === 4 && this.status === 200) {
        
            let myArr2 = JSON.parse(this.responseText);

            if(Object.keys(myArr2.results).length === 0){
              if(movie.state.toggleTrailer === 'trailer'){
                movie.toggleTrailer();
              }
            }else{
              if(movie.state.toggleTrailer === 'hide'){
                movie.toggleTrailer();
              }

              let key = myArr2.results[0]["key"];
              let trailer = "https://www.youtube.com/watch?v=" + key;
              movie.setState({trailer:trailer});  
          
            }
          }
        }
        xmlhttp.open("GET", url2, true);
        xmlhttp.send();
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  toggleContainer(){
    let css = (this.state.toggleContainer === "hide") ? "container" : "hide";
    this.setState({toggleContainer:css});
  }

  toggleButton(){
    if(this.state.count === 0){
      this.setState({toggleButton:'hide'});
    }else{
      this.setState({toggleButton:'left-movie action-button animate'});
    }
  }

  toggleTrailer(){
    let css = (this.state.toggleTrailer === "trailer") ? "hide" : "trailer";
    this.setState({toggleTrailer:css});
  }

  handleClickLast(){
    if (this.state.count > 0) {
      this.setState({count:this.state.count-1}, this.append);
    }
    if(this.state.count===0){
      this.toggleButton();
    }
  }

  handleClickNext(){
    if(this.state.count >= this.state.amount-1){
      this.setState({count:0},this.append);
    }else{
      this.setState({count:this.state.count+1},this.append);
    }
  }

  append(){
      this.toggleButton();
      let arr=this.state.arr;
      let count=this.state.count;
      let poster="";
      let poster_path=arr.results[this.state.count]['poster_path'];
      let title = arr.results[this.state.count]['title'];
      let overview = arr.results[this.state.count]['overview'];
      let release_date = arr.results[this.state.count]['release_date'];
      let id = arr.results[this.state.count]['id'];

      if(poster_path === null ){
        poster=require('./img/noPoster.jpg');
      }else{
        poster = 'http://image.tmdb.org/t/p/w500/'+poster_path;
      }
      this.setState({poster:poster});
      this.setState({title:title});

      if(release_date === ""){
        this.setState({release_date:"N/A"});
      }else{
        this.setState({release_date:release_date});
      }
  

      if (overview === "") {
        this.setState({overview:"No Description Available"});
      }
        // if overview is over 500 characters cut it short 
      else if (overview.length > 500) {
        let shorter = overview.slice(0,500)+"...";
        this.setState({overview:shorter});
      }
         // add summary to page
      else {
        this.setState({overview:overview});
      }
      // this.setState({overview:arr.results[this.state.count]['overview']});
      this.setState({id:id},this.trailer);
  }

  trailer(){
    // Second Call
    let movie=this;
    let xmlhttp = new XMLHttpRequest();
    let id = this.state.id;
    let url2 = "http://api.themoviedb.org/3/movie/" + id + "/videos?api_key=39124889ea92aada0703109651a543ab";
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        let myArr2 = JSON.parse(this.responseText);

        if(Object.keys(myArr2.results).length === 0){
          if(movie.state.toggleTrailer === 'trailer'){
            movie.toggleTrailer();
          }
        }else{
          if(movie.state.toggleTrailer === 'hide'){
            movie.toggleTrailer();
          }
          let key = myArr2.results[0]["key"];
          let trailer = "https://www.youtube.com/watch?v=" + key;
          movie.setState({trailer:trailer}); 
        }
      }
    }
    xmlhttp.open("GET", url2, true);
    xmlhttp.send();
  }

  arrow(event){
      if(event.keyCode == 37){
        event.preventDefault();
            this.handleClickLast();
         }

         if(event.keyCode == 39){
        event.preventDefault();
            this.handleClickNext();
         }
    }

  enter(event){
      if(event.keyCode == 13){
          event.preventDefault();
          this.request();
        }
    }

  render() {
    return (
      <section className="movie">
        <Nav class="nav-bar-movie" version="TV Seeker" link="/TV"/>
        <h1 className="header-movie">Cinema Seeker</h1>
        <div className="search-bar">
           <input id='search' onClick={this.enter} placeholder="Enter a Movie..."/>
           <button onClick={this.request} className="button-search-movie">Search</button>
        </div>
        <div className={this.state.toggleContainer}>
          <div className="poster">
            <img src={this.state.poster} alt="movie poster"/>
          </div>
          <div className="movie-info">
            <div className="title"><h1>{this.state.title}</h1></div>
            <div className="release_date"><p><b>Release Date:</b> {this.state.release_date}</p></div>
            <div className="overview"><p>{this.state.overview}</p></div>
            <div className={this.state.toggleTrailer}>
              <a href={this.state.trailer} target="_blank"><p className='trailer-button-movie'>View Trailer</p></a>
            </div>
            <div className="navigation">
              <button className={this.state.toggleButton} onClick={this.handleClickLast}>Prev</button>
              <button className='right-movie action-button animate' id='right' onClick={this.handleClickNext}>Next</button>
            </div>
          </div>
        </div>
        <Footer class="footer-movie"/>
      </section>
    );
  }
}

export default Movie;
