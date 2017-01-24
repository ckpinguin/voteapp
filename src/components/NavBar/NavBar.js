import React from 'react';

export default function NavBar() {
    var pages = [
        {
            id: 1,
            name: 'home'
        }, {
            id: 2,
            name: 'blog'
        }, {
            id: 3,
            name: 'pics'
        }, {
            id: 4,
            name: 'bio'
        }, {
            id: 5,
            name: 'about'
        }, {
            id: 6,
            name: 'contact'
        }
    ];
    return <nav>
        {pages.map(p => <a key={p.id} href={'/' + p.name}>{p.name}&nbsp;&nbsp;&nbsp;</a>)}
    </nav>;

}
