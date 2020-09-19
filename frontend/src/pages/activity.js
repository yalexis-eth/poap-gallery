import React from 'react'

export default function activity() {
  return (
    <main id="site-main" role="main" className="app-content">
      <div className="container" style={{
      padding: '0rem',
    }}></div>

<div  style={{display: "flex", alignItems: "center", margin:"0rem 0",}}>
        <table className="activityTable" style={{width: "100%" ,border: "none"}}>
            <tr>
              <th>#</th>
              <th>Name of POAP</th>
              <th>From</th>
              <th>To</th>
              <th>Time</th>
              <th>Transfer count</th>
              <th>POAP Image</th>
            </tr>
            <tr> 
              <td>1</td>
              <td>ABC </td>
              <td>0xb4367dc4d2</td>
              <td> Inan</td>
              <td> 10.10.10</td>
              <td> 900</td>
              <td> img</td>
            </tr>
            <tr> 
              <td>2</td>
              <td>ABC POAP</td>
              <td>0xb4367dc4de</td>
              <td>0xb4367dc4d2</td>
              <td> 10.10.10</td>
              <td> 0</td>
              <td> img</td>
            </tr>
            <tr> 
              <td>3</td>
              <td>ABC PP3</td>
              <td>0xb4367dc4de</td>
              <td>Stefan.eth</td>
              <td> 10.10.10</td>
              <td> 10,000</td>
              <td> img</td>
            </tr>
            <tr> 
              <td>4</td>
              <td>ABC 1</td>
              <td>Max.eth</td>
              <td>Alexander.eth</td>
              <td> 10.10.10</td>
              <td> 10,000</td>
              <td> img</td>
            </tr>
        </table>
  

</div>
    </main>
  )
}
