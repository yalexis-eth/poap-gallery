import React from 'react'
import PoapLogo from '../assets/images/POAP.svg'


export default function activity() {
  return (
    <main id="site-main" role="main" className="app-content">
      <div className="container" style={{
      padding: '0rem',
    }}>
        <div className="gallery-grid" style={{
        //_poapapp.scss media 
      }}></div>
    
      <div  style={{display: "flex", justifyContent: "space-between", margin:"0rem 0",}}>
       <div style={{flex: "3"}}> <TokenCard/> </div> 
       <div style={{display: "flex", flexDirection: "column", flex: "7", justifyContent: "center"}}> 
     
       <h4> Description </h4>
       <h4> Virtual Event </h4>
       <h4> Country </h4>
       <h4> Start date </h4>
       <h4> End date </h4>
       <h4> Website </h4>
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