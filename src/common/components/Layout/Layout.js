import React from 'react';
//import styles from './styles.styl';
import NavBar from '../NavBar/NavBar';

export default function Layout({children}) {
    return (
        <div className="app-Layout-background">
            <div className="app-Layout-header">
                <div className="app-Layout-title">
                    Vote as a Service (VaaS)
                </div>
            </div>
            <NavBar />
            <div className="app-Layout-main">
                <div className="app-Layout-container">
                    {children}
                </div>
            </div>
        </div>
    );
}
Layout.propTypes = {
    children: React.PropTypes.element.isRequired
};
