import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';


import {GetOSData} from "../wailsjs/go/main/App";
import Charts from "./Components/Charts/Charts.jsx";
function App() {

    const [data, setData] = useState('');

    const getOSDataHandler = () => {
        const hardwareData = GetOSData()
            .then( data => {
                console.log(data)
                setData(JSON.stringify(data))
            })
            .catch(err => console.log(err))

    }

    return (
        <div id="App">
            <div className="result">
                <h1>Hardware Monitor</h1>
                Erick José André Villatoro Revolorio
                201900907
            </div>
            <Charts></Charts>
        </div>
    )
}

export default App
