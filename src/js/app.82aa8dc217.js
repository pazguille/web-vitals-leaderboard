import store from"./store.907c985ceb.js";import LeaderboardResults from"./Leaderboard.e7dadd24fb.js";import Loading from"./Loading.f2333c941d.js";import LeaderboardControl from"./LeaderboardControl.e34a7181a7.js";import Filter from"./Filter.7d1ed309d8.js";import ErrorMessage from"./ErrorMessage.66813c20a4.js";const demoUrls=["https://www.cnn.com","https://www.nytimes.com","https://www.foxnews.com","https://www.theguardian.com/international","https://www.washingtonpost.com"];export default function bootApp(){(new LeaderboardResults).init(),(new Loading).init(),requestIdleCallback((()=>{(new LeaderboardControl).init(),(new Filter).init(),(new ErrorMessage).init()}));const e=new URL(window.location.href),t=new URLSearchParams(e.search);if(t.has("competitors")){store.dispatch({type:"LEADERBOARD_UPDATE",urls:t.get("competitors").split(","),from:t.get("from")});const{urls:e}=store.getState();requestIdleCallback((()=>{ga("send",{hitType:"event",eventCategory:"Leaderboard",eventAction:"share",eventLabel:e.join(",")})}))}else store.dispatch({type:"LEADERBOARD_UPDATE",urls:demoUrls})}