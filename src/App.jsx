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
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>

          <p></p>
          
          {/*validation check*/}
          <button className = "Next" onClick={() => {
            if (!responses.date || !responses.time) {
              alert("Please select both a date and a time before continuing!");
              return; // halts the fn execution so they can't skip ahead
            }
            setCurrentPage('what');
            }}>Next &gt;&gt;</button>
        </main>
      )}

      {/* Page 3: what */}
      {currentPage === 'what' && (
        <main className="what">
          <h1>What do you feel like?</h1>
          <button className = 'back' onClick={() => setCurrentPage('when')}>&lt;&lt; Back</button>
          <div className='preferences'>
            <button onClick={()=>{
              updateResponse('preference', 'Food');
              updateResponse('specifics', []);
              setCurrentPage('food-option');
            }}>Food🍽️</button>
            <button onClick={()=> {
              updateResponse('preference', 'Activity');
              updateResponse('specifics', []);
              setCurrentPage('activity-option');
            }}>Activity🕺</button>
            <button onClick={() => {
              updateResponse('preference', 'Food & Activity');
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
          
          <div className="summary-card">
            <p>📅 <strong>Date:</strong> {responses.date}</p>
            <p>⏰ <strong>Time:</strong> {responses.time}</p>
            <p>✨ <strong>Preference:</strong> {responses.preference}</p>
            <p>🎉 <strong>Your Choices:</strong> {responses.specifics.join(', ')}</p>
          </div>

          <button className="back" onClick={() => {
            // back tracking for the summary screen
            if (responses.preference === 'food') {
              setCurrentPage('food-option');
            } else {
              setCurrentPage('activity-option');
            }
          }}>&lt;&lt; Change Plans</button>

          {/* <button className="confirm" onClick={() => {
            // logs the choices to the console at submission
            console.log("Final Submitted Responses:", responses); 
            
            // TODO: send an email OR store it somewhere

            // thank you screen
            setCurrentPage('thx');
          }}>Looks Perfect! 🥰</button> */}

          <button className="confirm" onClick={async () => {
  if (responses.specifics.length === 0) {
    alert("Please make sure you have picked your choices!");
    return;
  }

  // format the array into a clean string text row
  const formattedData = {
    ...responses,
    specifics: responses.specifics.join(', ')
  };

  try {
    // send data from your computer straight to the Google Script
    await fetch("https://script.google.com/macros/s/AKfycbwkzPR4iybohNSIf2Z4tHE10hE-SditI5w4Kc4jDtW2UAIRnz19-UsVKusWnX1mO2-W/exec", {
      method: "POST",
      mode: "no-cors", // bypasses local testing CORS restrictions
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formattedData)
    });

    // since 'no-cors' hides the response body status, we assume success if no error is caught
    console.log("Data pushed to Google Sheets successfully!", responses);
    setCurrentPage('thx');

  } catch (error) {
    console.error("Network error saving to Google Sheets:", error);
    alert("Something went wrong saving your choices!");
  }
}}>
  Looks Perfect! 🥰
</button>



        </main>
      )}

      {/* page 8: thanks */}
      {currentPage === 'thx' && (
        <main className='thx'>
          <h1>Thanks for saying yes!! Lemme text u</h1>

        </main>
      )}

    </div>
  )
}


export default App
