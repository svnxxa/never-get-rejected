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
    specifics: [] // specific food or activities chosen
  })

  // helper to update response data
  const updateResponse = (key, value) => {
    setResponses(prev => ({ 
      ...prev,                // keep all the other answers safe
      [key]: value }))        // update the specific answer
  }

  // state for moving no button
  const [noBtnPos, setNoBtnPos] = useState({top: 'auto', left:'auto', position: 'static'})
  
  // make the No button move when hovered
  function moveButton(e) {
    const rect = e.target.getBoundingClientRect();
    
    // find the exact center pixel of the button
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    // calculate how far away the mouse cursor is from the center
    const distanceX = e.clientX - buttonCenterX;
    const distanceY = e.clientY - buttonCenterY;
 
    // pushes it further away in the opposite direction
    const pushFactor = -1; 

    // calculate new coordinates based on current layout
    let newLeft = rect.left + (distanceX * pushFactor);
    let newTop = rect.top + (distanceY * pushFactor);

    // bounds checking so it doesn't leave the screen border
    setNoBtnPos({
      position: 'fixed', // fixed helps track direct window coordinates from e.clientX
      left: `${newLeft}px`,
      top: `${newTop}px`,
      transition: 'all 0.1s ease-out' // smooth, organic glide!
    });
}

  // TODO: send an email on final submit


  return (
    <div className="app-container">

      {/* Page 1: home*/}
      {currentPage === 'home' && (
        <main className="main">
          <h1> WILL U GO ON A DATE WITH ME?🥺</h1>
          <button className = "YES" onClick={() => setCurrentPage('when')}>YES</button>
          <button 
            className = "NO" 
            style={noBtnPos} 
            onMouseMove={(e) => moveButton(e)}>NO</button>
        </main>
      )}
      
      {/* Page 2: when*/}
      {currentPage === 'when' && (
        <main className="when">
          <h1> Yay! When are you free?</h1>
          {/* calendar & time*/}
          <input
            type = "date"
            // restricts selection to today and futre dates
            min={new Date().toISOString().split('T'[0])}
            onChange={(e) => updateResponse('date', e.target.value)}
          />

          <select onChange={(e) => updateResponse('time', e.target.value)}>
            <option value="">Select a time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>

          {/*validation check*/}
          <button className = "Next" onClick={() => {
            if (!responses.date || !responses.time) {
              alert("Please select both a date and a time before continuing!");
              return; // halts the fn execution so they can't skip ahead
            }
            setCurrentPage('what');
            }}>Next</button>
        </main>
      )}

      {/* Page 3: what */}
      {currentPage === 'what' && (
        <main className="what">
          <h1>What do you feel like?</h1>
          <button className = 'back' onClick={() => setCurrentPage('when')}>&lt;&lt; Back</button>
          <div className='preferences'>
            <button onClick={()=>{
              updateResponse('preference', 'food');
              setCurrentPage('food-option');
            }}>Food🍽️</button>
            <button onClick={()=> {
              updateResponse('preference', 'activity');
              setCurrentPage('activity-option');
            }}>Activity🕺</button>
            <button onClick={() => {
              updateResponse('preference', 'food & activity');
              setCurrentPage('both');
            }}>🍽️Both🕺</button>
          </div>
          
          <form id = "others" onSubmit={(e) => {
            e.preventDefault(); // prevent page refresh
            setCurrentPage('thx');
          }}>
            <input 
              type="text" 
              id="input" 
              placeholder='Others...' 
              required 
              onChange={(e) => updateResponse('preference', e.target.value)} // saves typing text
            />
            <button type="submit">Submit</button>
          </form>
        </main>
      )}

      {/* Page 4: food options */}
      {currentPage === 'food-option' && (
        <main className='food-option'>
          <h1>What do you want to eat?</h1>
          <button className = 'back' onClick={() => setCurrentPage('what')}>&lt;&lt; Back</button>
          {/* food options + others + back*/}
          <div className='food-options'>
            {/* TODO: MAKE SURE IT SAVES THE LAST OPTION THEY CHOOSE NOT EVERY SINGLE THING THEY CLICK and allow multiple choices and see what they chose*/}
            {/* TODO: OR THEY CAN CHOOSE MULTIPLE */}
            <button onClick={() => updateResponse('specifics', 'sushi')}>Sushi🍣</button>
            <button onClick={() => updateResponse('specifics', 'pasta')}>Pasta🍝</button>
            <button onClick={() => updateResponse('specifics', 'tacos')}>Tacos🌮</button>
            <button onClick={() => updateResponse('specifics', 'dessert')}>Ice Cream🍦</button>
            <button onClick={() => updateResponse('specifics', 'tea/coffee')}>Tea/Coffee🍵</button>
            <button onClick={() => updateResponse('specifics', 'drinks')}>Drinks🍸</button>
          </div>
          
          <form id = "others" onSubmit={(e) => {
            e.preventDefault(); // prevent page refresh
            // setCurrentPage('thx');
          }}>
            <input 
              type="text" 
              id="input" 
              placeholder='Others...' 
              required 
              onChange={(e) => updateResponse('specifics', e.target.value)} // saves typing text
            />
            <button type="submit">Submit</button>
          </form>

          {/* TODO: MAKE SURE TO UPDATE THE RESPONSES STATE WHEN THEY PICK A FOOD OPTION
          MAKE SURE TO VALIDATE THAT THEY PICKED A FOOD OPTION BEFORE LETTING THEM GO TO THE NEXT PAGE */}
          <button className='thx' onClick={() => setCurrentPage('thx')}>Next &gt;&gt;</button>
        </main>
      )}

      {/* page 5: activity optins */}
      {currentPage === 'activity-option' && (
        <main className='activity-option'>
          <h1>What do you want to do?</h1>
          <button className = 'back' onClick={() => setCurrentPage('what')}>&lt;&lt; Back</button>
          {/* activity options + others + back*/}
          <div className='activity-options'>
            {/* TODO: MAKE SURE IT SAVES THE LAST OPTION THEY CHOOSE NOT EVERY SINGLE THING THEY CLICK */}
            {/* TODO: OR THEY CAN CHOOSE MULTIPLE */}
            <button onClick={() => updateResponse('specifics', 'momvie')}>Movie🎬</button>
            <button onClick={() => updateResponse('specifics', 'arcade')}>Arcade🎮</button>
            <button onClick={() => updateResponse('specifics', 'bouldering')}>Bouldering🧗</button>
            <button onClick={() => updateResponse('specifics', 'hiking')}>Hiking🚶</button>
            <button onClick={() => updateResponse('specifics', 'bowling')}>Bowling🎳</button>
          </div>
          
          <form id = "others" onSubmit={(e) => {
            e.preventDefault(); // prevent page refresh
            // setCurrentPage('thx');
          }}>
            <input 
              type="text" 
              id="input" 
              placeholder='Others...' 
              required 
              onChange={(e) => updateResponse('specifics', e.target.value)} // saves typing text
            />
            <button type="submit">Submit</button>
          </form>


          {/* TODO: MAKE SURE TO UPDATE THE RESPONSES STATE WHEN THEY PICK AN ACTIVITY OPTION */}
          {/* TODO: MAKE SURE TO VALIDATE THAT THEY PICKED AN ACTIVITY OPTION BEFORE LETTING THEM GO TO THE NEXT PAGE */}
          <button className='thx' onClick={() => setCurrentPage('thx')}>Next &gt;&gt;</button>
        </main>
      )}

      {/* page 6: both */}
      {currentPage === 'both' && (
        <main className='both'>
          <h1>What do you want to eat & do?</h1>
          <button className = 'back' onClick={() => setCurrentPage('what')}>&lt;&lt; Back</button>
          {/* basically both */}
          <div className='food-options'>
            {/* TODO: MAKE SURE IT SAVES THE LAST OPTION THEY CHOOSE NOT EVERY SINGLE THING THEY CLICK and allow multiple choices and see what they chose*/}
            {/* TODO: OR THEY CAN CHOOSE MULTIPLE */}
            <button onClick={() => updateResponse('specifics', 'sushi')}>Sushi🍣</button>
            <button onClick={() => updateResponse('specifics', 'pasta')}>Pasta🍝</button>
            <button onClick={() => updateResponse('specifics', 'tacos')}>Tacos🌮</button>
            <button onClick={() => updateResponse('specifics', 'dessert')}>Ice Cream🍦</button>
            <button onClick={() => updateResponse('specifics', 'tea/coffee')}>Tea/Coffee🍵</button>
            <button onClick={() => updateResponse('specifics', 'drinks')}>Drinks🍸</button>
          </div>


          <div className='activity-options'>
            {/* TODO: MAKE SURE IT SAVES THE LAST OPTION THEY CHOOSE NOT EVERY SINGLE THING THEY CLICK */}
            {/* TODO: OR THEY CAN CHOOSE MULTIPLE */}
            <button onClick={() => updateResponse('specifics', 'momvie')}>Movie🎬</button>
            <button onClick={() => updateResponse('specifics', 'arcade')}>Arcade🎮</button>
            <button onClick={() => updateResponse('specifics', 'bouldering')}>Bouldering🧗</button>
            <button onClick={() => updateResponse('specifics', 'hiking')}>Hiking🚶</button>
            <button onClick={() => updateResponse('specifics', 'bowling')}>Bowling🎳</button>
          </div>
          
          <form id = "others" onSubmit={(e) => {
            e.preventDefault(); // prevent page refresh
            // setCurrentPage('thx');
          }}>
            <input 
              type="text" 
              id="input" 
              placeholder='Others...' 
              required 
              onChange={(e) => updateResponse('specifics', e.target.value)} // saves typing text
            />
            <button type="submit">Submit</button>
          </form>
          
          {/* TODO: MAKE SURE TO UPDATE THE RESPONSES STATE WHEN THEY PICK BOTH OPTIONS */}
          {/* TODO: MAKE SURE TO VALIDATE THAT THEY PICKED BOTH OPTIONS BEFORE LETTING THEM GO TO THE NEXT PAGE */}
          <button className='Thx' onClick={() => setCurrentPage('thx')}>Next &gt;&gt;</button>
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
