import { useState } from 'react'
import './App.css'

function App() {
  // a state variable to track which page or screen is active
  // 'home' is the intial value of this state (default to the 'home' page when it first loads)
  // const [state, setter fn] = initialization
  const [currentPage, setCurrentPage] = useState('home')

  // temporary local state for the input text
  const [customInput, setCustomInput] = useState('')

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

  const toggleSpecifics = (item) => {
    setResponses(prev => {
      // check if the item is alr selected
      const exists = prev.specifics.includes(item);

      // if it exists, filter it out. if it doesn't, add it to the array
      const newSpecifics = exists
        ? prev.specifics.filter(choice => choice !== item)
        : [...prev.specifics, item];

        return {
          ...prev,
          specifics: newSpecifics
        };
    });
  };

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

  const FOOD_CHOICES = ['Sushi🍣', 'Pasta🍝', 'Tacos🌮', 'Ice Cream🍦', 'Tea/Coffee🍵', 'Drinks🍸']
  const ACTIVITY_CHOICES = ['Movie🎬', 'Arcade🎮', 'Sunset Watching🌇', 'Bouldering🧗', 'Hiking🚶', 'Bowling🎳']

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
            min={new Date().toISOString().split('T')[0]}
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
              updateResponse('specifics', []);
              setCurrentPage('food-option');
            }}>Food🍽️</button>
            <button onClick={()=> {
              updateResponse('preference', 'activity');
              updateResponse('specifics', []);
              setCurrentPage('activity-option');
            }}>Activity🕺</button>
            <button onClick={() => {
              updateResponse('preference', 'food & activity');
              updateResponse('specifics', []);
              setCurrentPage('both');
            }}>🍽️Both🕺</button>
          </div>
        </main>
      )}

      {/* Page 4: food options */}
      {currentPage === 'food-option' && (
        <main className='food-option'>
          <h1>What do you want to eat?</h1>
          <button className = 'back' onClick={() => setCurrentPage('what')}>&lt;&lt; Back</button>
          
          {/* food options + others + back*/}
          <div className='food-options'>
            {FOOD_CHOICES.map(food => (
              <button 
                key={food}
                className={responses.specifics.includes(food) ? 'selected' : ''}
                onClick={() => toggleSpecifics(food)}
                >
                  {food}
              </button>
            ))}
          </div>
          
          <form id="others" onSubmit={(e) => {
            e.preventDefault();

            if (customInput.trim()) {
              toggleSpecifics(customInput.trim());
              setCustomInput('');
            }
          }}>
            <input
              type="text"
              id="input"
              placeholder='Others...'
              value={customInput} // keeps the input box synced
              required
              onChange={(e) => setCustomInput(e.target.value)}
            />
            <button type="submit">Add Choice</button>
          </form>

          {/* Next button with double validation */}
          <button className='thx' onClick={() => {
            // check if they picked at least one food
            if (responses.specifics.length == 0) {
              alert("Please pick an option or add your own choice!🍽️");
              return;
            }

            setCurrentPage('summary'); 
          }}>Next &gt;&gt;</button>

        </main>
      )}

      {/* page 5: activity optins */}
      {currentPage === 'activity-option' && (
        <main className='activity-option'>
          <h1>What do you want to do?</h1>
          <button className = 'back' onClick={() => setCurrentPage('what')}>&lt;&lt; Back</button>
          {/* activity options + others + back*/}
          <div className='activity-options'>
            {ACTIVITY_CHOICES.map(activity => (
              <button 
                key={activity}
                className={responses.specifics.includes(activity) ? 'selected' : ''}
                onClick={() => toggleSpecifics(activity)}
                >
                  {activity}
              </button>
            ))}
          </div>
          
          <form id="others" onSubmit={(e) => {
            e.preventDefault();

            if (customInput.trim()) {
              toggleSpecifics(customInput.trim());
              setCustomInput('');
            }
          }}>
            <input
              type="text"
              id="input"
              placeholder='Others...'
              value={customInput} // keeps the input box synced
              required
              onChange={(e) => setCustomInput(e.target.value)}
            />
            <button type="submit">Add Choice</button>
          </form>

          {/* Next button with double validation */}
          <button className='thx' onClick={() => {
            // check if they picked at least one food
            if (responses.specifics.length == 0) {
              alert("Please pick an option or add your own choice!🕺");
              return;
            }

            setCurrentPage('summary'); 
          }}>Next &gt;&gt;</button>
        </main>
      )}

      {/* page 6: both */}
      {currentPage === 'both' && (
        <main className='both'>
          <h1>What do you want to eat & do?</h1>
          <button className = 'back' onClick={() => setCurrentPage('what')}>&lt;&lt; Back</button>
          {/* basically both */}
          <div className='food-options'>
            <h3>Pick your foods:</h3>
            {FOOD_CHOICES.map(food => (
              <button 
                key={food}
                className={responses.specifics.includes(food) ? 'selected' : ''}
                onClick={() => toggleSpecifics(food)}
                >
                  {food}
              </button>
            ))}
          </div>

          <div className='food-options'>
            <h3>Pick your activities:</h3>
            {ACTIVITY_CHOICES.map(activity => (
              <button 
                key={activity}
                className={responses.specifics.includes(activity) ? 'selected' : ''}
                onClick={() => toggleSpecifics(activity)}
                >
                  {activity}
              </button>
            ))}
          </div>
          
          <form id="others" onSubmit={(e) => {
            e.preventDefault();

            if (customInput.trim()) {
              toggleSpecifics(customInput.trim());
              setCustomInput('');
            }
          }}>
            <input
              type="text"
              id="input"
              placeholder='Others...'
              value={customInput} // keeps the input box synced
              required
              onChange={(e) => setCustomInput(e.target.value)}
            />
            <button type="submit">Add Choice</button>
          </form>

          {/* Next button with double validation */}
          <button className='thx' onClick={() => {
            // check if they picked at least one food
            if (responses.specifics.length < 2 ) {
              alert("Please pick both options or add your own choices!🍽️🕺");
              return;
            }

            setCurrentPage('summary'); 
          }}>Next &gt;&gt;</button>
        </main>
      )}

      {/* page 7: summary */}
      {currentPage === 'summary' && (
        <main className="summary">
          <h1>Confirm Our Date Plans! 💖</h1>
          
          <div className="summary-card" style={{ padding: '20px', border: '2px dashed #ff4a73', borderRadius: '12px', margin: '20px auto', maxWidth: '300px', backgroundColor: '#fff5f7', textAlign: 'left' }}>
            <p>📅 **Date:** {responses.date}</p>
            <p>⏰ **Time:** {responses.time}</p>
            <p>✨ **Preference:** {responses.preference}</p>
            <p>🎉 **Your Choices:** {responses.specifics.join(', ')}</p>
          </div>

          <button className="back" onClick={() => {
            // back tracking for the summary screen
            if (responses.preference === 'food') {
              setCurrentPage('food-option');
            } else {
              setCurrentPage('activity-option');
            }
          }}>&lt;&lt; Change Plans</button>

          <button className="confirm" onClick={() => {
            // logs the choices to the console at submission
            console.log("Final Submitted Responses:", responses); 
            
            // TODO: send an email OR store it somewhere

            // thank you screen
            setCurrentPage('thx');
          }}>Looks Perfect! 🥰</button>
        </main>
      )}

      {/* page 8: thanks */}
      {currentPage === 'thx' && (
        <main className='thx'>
          <h1>thanks for saying yes!! lemme text u</h1>

        </main>
      )}

    </div>
  )
}


export default App
