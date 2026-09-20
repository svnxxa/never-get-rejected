import { useState, useRef } from 'react'
import './App.css'

function App() {
  // a state variable to track which page or screen is active
  // 'home' is the intial value of this state (default to the 'home' page when it first loads)
  // const [state, setter fn] = initialization
  const [currentPage, setCurrentPage] = useState('home')

  // state to store responses
  const [responses, setResponses] = useState({
    date: '',
    time: '',
    preference: '', // food, activity. both, or custom text
    specifics: '' // specific food or activities chosen
  })

  // state for moving no button
  const [noBtnPos, setNoBtnPos] = useState({top: 'auto', left:'auto', position: 'static'})
  
  return (
    <div className="app-container">

      {/* Page 1: home*/}
      {currentPage === 'home' && (
        <main className="main">
          <h1> WILL U GO ON A DATE WITH ME?</h1>
          <button className = "YES" onClick={() => setCurrentPage('when')}>YES</button>
          <button className = "NO" onClick={() => Move()}>NO</button>
        </main>
      )}
      
      {/* Page 2: when*/}
      {currentPage === 'when' && (
        <main className="when">
          <h1> Yay! When are you free?</h1>
          {/* calendar & time*/}
          <button className = "Next" onClick={() => setCurrentPage('what')}>Next</button>
        </main>
      )}

      {/* Page 3: what */}
      {currentPage === 'what' && (
        <main className="what">
          <h1>What do you feel like?</h1>
          <button className = 'food' onClick={() => setCurrentPage('food-option')}>Food</button>
          <button className = 'activity' onClick={()=> setCurrentPage('activity-option')}>Activity</button>
          <button className = 'both' onClick={() => setCurrentPage('food-activity')}>Both</button>
          <form id = "others">
            <input type="text" id="input" placeholder='Others...' required />
            <button type="submit" onClick={() => setCurrentPage('thx')}>Submit</button>
          </form>
        </main>
      )}

      {/* Page 4: food options */}
      {currentPage === 'food-option' && (
        <main className='food-option'>
          <h1>What do you want to eat?</h1>
          {/* food options + others + back*/}
          <button className='thx' onClick={() => setCurrentPage('thx')}>Next</button>
        </main>
      )}

      {/* page 5: activity optins */}
      {currentPage === 'activity-option' && (
        <main className='activity-opton'>
          <h1>What do you want to do?</h1>
          {/* activity options + others + back*/}
          <button className='thx' onClick={() => setCurrentPage('thx')}>Next</button>
        </main>
      )}

      {/* page 6: both */}
      {currentPage === 'both' && (
        <main className='both'>
          {/* basically both */}
          <button className='Thx' onClick={() => setCurrentPage('thx')}>Next</button>
        </main>
      )}

      {/* page 7: thx */}
      {currentPage === 'thx' && (
        <h1>Thank you for saying yes! Lemme text you hehe</h1>
      )} 
      

      
    </div>
  )
}

export default App



function Move() {
  // const hover
}