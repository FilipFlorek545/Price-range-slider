import {SearchForm} from "./SearchForm";
import {fakeNames} from "./fakeNames";
import {useRef, useState} from "react";
import {PriceRange} from "./PriceRange";


function App() {

    // const [hires, setHires] = useState([])
    const [selectedPrices, setSelectedPrices] = useState([0,1])

    // const pullData = (hiredEmployees) => {
    //     setHires(hiredEmployees)
    // }
    const pullPrices = (selectedPrices) => {
        setSelectedPrices(selectedPrices)
    }

  return (
    <div className="App">
        {/*<SearchForm names={fakeNames}  func={pullData} hires={hires}/>*/}
        <PriceRange minV='899' maxV='14444' onChangePrices={pullPrices} />
        <div>{selectedPrices[0]} - {selectedPrices[1]}</div>
    </div>
  );
}

export default App;
// / <div className='hires'>
//             {
//                 hires.map((t, i) => <div key={i}>{t}</div>)
//             }
//         </div>
