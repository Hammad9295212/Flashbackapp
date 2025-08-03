import React, {useEffect} from 'react';
import { initializeApp } from "firebase/app";
import MainStackNavigator from "./navigation/navigator";

const App = () => {

    useEffect(() => {
        console.log(`-----------------------MainStackNavigator--`);
        const firebaseConfig = {};
        const app = initializeApp(firebaseConfig);
        console.log(`-----------------------END--`);
    }, []);

    return (
        <MainStackNavigator/>
    );
}

export default App;
