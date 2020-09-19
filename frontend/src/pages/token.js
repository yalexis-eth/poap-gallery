import React, { useState, useEffect } from 'react'
import PoapLogo from '../assets/images/POAP.svg'
import {
  Switch,
  Route,
  useRouteMatch,
  useParams
} from "react-router-dom";



export default function Tokens () {
  let match = useRouteMatch();
  console.log('matched route:', match)

  return (
    <Switch>
      <Route path={`${match.path}/:tokenId`}>
        <Token />
      </Route>
      <Route path={match.path}>
        <h3>No token Selected</h3>
      </Route>
    </Switch>
  )
}



export function Token() {

  const params = useParams();
  let { tokenId } = params;

  const [event, setEvent] = useState({})
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)



  useEffect(() => {
    fetch('https://api.poap.xyz/events')
      .then((res) => res.json())
      .then(
        (result) => {
          result = result.filter(event => event.id === tokenId)
          setIsLoaded(true)
          setEvent(result)
        },
        (error) => {
          setIsLoaded(true)
          setError(error)
        }
      )
  }, [])


  return (
    <main id="site-main" role="main" className="app-content">
      <div className="container" style={{
        padding: '0rem',
      }}>
      <h1>showing token {tokenId}</h1>
        <div className="gallery-grid"></div>
    
      <div  style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", margin:"0rem 0"}}>
       <div style={{flex: "3"}}> <TokenCard/> </div> 
       <div style={{display: "flex", flexDirection: "column", flex: "7", justifyContent: "center"}}> 
        <div style={{display: "flex", flexDirection: "row"}}> <div style={{width: "100px", marginLeft: "1rem"}}> <h4> Description </h4> </div>  <div style={{marginLeft: "3rem"}}> {apiInfo()} </div> </div>
        <div style={{display: "flex", flexDirection: "row"}}> <div style={{width: "100px", marginLeft: "1rem"}}> <h4> Virtual Event </h4> </div>  <div style={{marginLeft: "3rem"}}> {apiInfo()} </div> </div>
        <div style={{display: "flex", flexDirection: "row"}}> <div style={{width: "100px", marginLeft: "1rem"}}> <h4> Country  </h4> </div>  <div style={{marginLeft: "3rem"}}> {apiInfo()} </div> </div>
        <div style={{display: "flex", flexDirection: "row"}}> <div style={{width: "100px", marginLeft: "1rem"}}> <h4> Start date </h4> </div>  <div style={{marginLeft: "3rem"}}> {apiInfo()} </div> </div>
        <div style={{display: "flex", flexDirection: "row"}}> <div style={{width: "100px", marginLeft: "1rem"}}> <h4> End date </h4> </div>  <div style={{marginLeft: "3rem"}}> {apiInfo()} </div> </div>
        <div style={{display: "flex", flexDirection: "row"}}> <div style={{width: "100px", marginLeft: "1rem"}}> <h4> Website </h4> </div>  <div style={{marginLeft: "3rem"}}> {apiInfo()} </div> </div>
       </div>

 

  </div>

  <div  style={{display: "flex", alignItems: "center", margin:"2rem 0",}}>
        <table className="activityTable" style={{width: "100%" ,border: "none"}}>
            <tr>
              <th>#</th>
              <th>Owner</th>
              <th>Claim date</th>
              <th>Transfer count</th>
            </tr>
            <tr> 
              <td>1</td>
              <td>ABC </td>
              <td>0xb4367dc4d2</td>
              <td> Inan</td>
            </tr>
            <tr> 
              <td>2</td>
              <td>ABC POAP</td>
              <td>0xb4367dc4de</td>
              <td>0xb4367dc4d2</td>

            </tr>
            <tr> 
              <td>3</td>
              <td>ABC PP3</td>
              <td>0xb4367dc4de</td>
              <td>Stefan.eth</td>

            </tr>
            <tr> 
              <td>4</td>
              <td>ABC 1</td>
              <td>Max.eth</td>
              <td>Alexander.eth</td>
   
            </tr>
        </table>
    </div>

  </div>
    </main>
  )
}



  function TokenCard() {
    return (
        <div style={{
          // border: 'black solid 1px',
          borderRadius: '.5rem',
          width: '250px',
          height: '250px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          //boxShadow: '0 5px 16px rgba(100,100,100, 0.3)',
          padding: '1rem 0rem',
        }}>
          <div style={{
            // border: 'black solid 1px',
            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            width: '175px',
            height: '175px',
          }}>
            <img style={{
              width: 'auto',
              height: '100%'
            }} src={PoapLogo} alt="POAP" />
          </div>
          <div>
            <h3>Poap Token</h3>
          </div>
          <div>
          </div>
        </div>
    )
  }

  function apiInfo() {
    return ( <h4>Hello</h4> )
  }
  