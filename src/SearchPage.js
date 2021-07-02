import React, { useState,useEffect,useRef } from 'react';
import NewsLine from './NewsLine';
import { Pagination } from '@material-ui/lab';
import { CircularProgress } from '@material-ui/core';

export default function SearchPage() {
    const firstWord = 'React';
    const basicSearchUrl='http://hn.algolia.com/api/v1/search?query=';

    const [dataFromSrv,setDataFromSrv]=useState({query:firstWord,hits:[]});
    const [searchWord,setSearchWord]=useState(firstWord);
    const [loadingData,setLoadingData]=useState(false);
    const [errorFound,setErrorFound]=useState({err:false,errText:"No error"});
    const [timerId,setTimerId]=useState();
    const [curUrl,setCurUrl]=useState(basicSearchUrl+searchWord);
    const curUrlRef=useRef(curUrl);
    curUrlRef.current=curUrl;

    const doSearch=()=>{
        setCurUrl(basicSearchUrl+searchWord);
        getDataFromServer(basicSearchUrl+searchWord)
    }

    const changePage=(e,page)=>{
      setCurUrl(basicSearchUrl+searchWord+'&page='+ (page-1));
      getDataFromServer(basicSearchUrl+searchWord+'&page='+ (page-1));
    }

    const timer5 = () =>{
      if (timerId){
        clearTimeout(timerId);
        setTimerId(null);
      }
      setTimerId(setTimeout(()=>{
        getDataFromServer(curUrlRef.current)},300000));
    }

    const getDataFromServer=(url)=>{
      console.log('Fetching url: ',url);
      setLoadingData(true);
      fetch(url)
      .then(response=>response.ok && response.json())
      .then(data=>{
          console.log('Got data from server:',data);
        setDataFromSrv(data);
        setLoadingData(false);
        timer5();
      })
      .catch(error=>{
            setLoadingData(false);
            console.log(error);
            setErrorFound({err:true,errText:error.message});
            });
    }

    useEffect(()=>{
        doSearch()
    },[]);

    if (loadingData) return <div style={{display: "flex",justifyContent: "center",alignItems: "center",width:"100%",height:"100vh"}}><CircularProgress /></div>
    if (errorFound.err){
      return (
        <div style={{display: "flex",justifyContent: "center",alignItems: "center",width:"100%",height:"100vh"}}>
          <p>Something went wrong. {errorFound.errText} </p>
          <p> Click <a href="/">here</a> to go back to the main page.</p>
        </div>
      )
    }

    return (
      <div className="container">
        <div>
            <form onSubmit={e=>{
              e.preventDefault();
              doSearch();
            }}>
            <input type="text" name="searchInput" onChange={(e)=>{
                setSearchWord(e.target.value);
                console.log(searchWord);
            }} />
            <input type="submit" value="Search"/>
            </form>
            <div>
              <h5> Search results for "{dataFromSrv.query}" </h5>
            </div>
        </div>

            {dataFromSrv.nbHits==0 && dataFromSrv.nbPages==0 ?
          "No news match your search..." :
          dataFromSrv.hits.map(item=>(
            <NewsLine
            key={item.objectID}
            title={item.title}
            newsUrl={item.url}
            author={item.author}
            points={item.points}
            created_at={item.created_at}
            num_comments={item.num_comments}
            objectID={item.objectID}
            />
          ))
        }
        <Pagination 
        count={dataFromSrv.nbPages || 1}
        page={dataFromSrv.page+1 || 1} // API counts from 0
        onChange={changePage}
        />


      </div>
    );
  }

  //dataFromSrv
//nbHits
//nbPages
//page
//hitsPerPage


/*   
  const date1 = new Date("2020-12-10"),
        date2 = new Date("2021-10-31"),
        time_difference = difference(date1,date2)
  
  console.log(time_difference)
   */