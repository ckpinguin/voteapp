import React from 'react';
import NavBar from './components/NavBar/NavBar.js';
import Button from './components/Button/Button';
import Greeter from './components/Greeter/Greeter';
import BouncingBall from './components/BouncingBall/BouncingBall';
import selfie from './assets/selfie.jpg';

export default function ProfilePage() {
    return <div>
        <NavBar/>
        <BouncingBall />
        <h1>All About Me or so...!</h1>
        <Greeter maxLength={10}/>
        <p>I like movies and blah blah blah blah blah</p>
        <Button text="A super cool button"/>
        <div>
            <img src={selfie}/>
        </div>
    </div>;
}
