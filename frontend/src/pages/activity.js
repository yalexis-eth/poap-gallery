import React from 'react'

export default function activity() {
  return (
    <main id="site-main" role="main" className="app-content">
      <div className="container" style={{
      padding: '1rem',
    }}></div>

<div  style={{display: "flex", justifyContent: "space-evenly", alignItems: "center", margin:"0rem 0",}}>
<div class="row" style={{display: "flex", justifyContent: "space-between", width: "100%" , alignItems: "center"}}>
        <div class="column">
            <h2>Column 1</h2>
            <p>Data..</p>
        </div>
        <div class="column">
            <h2>Column 2</h2>
            <p>Data..</p>
        </div>
        <div class="column">
            <h2>Column 3</h2>
            <p>Data..</p>
        </div>
    </div>

</div>
    </main>
  )
}
