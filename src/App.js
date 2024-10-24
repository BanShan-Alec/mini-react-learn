import React from '../core/React.js';
const Counter = (props) => {
    console.log('Counter', props);
    React.createElement('p', null, 'count: ', props.count, React.createElement('div', null, props.children));
};
export const App = () => {
    React.createElement(
        'div',
        {
            id: 'container',
        },
        'Hello World',
        React.createElement('span', null, '!!!!'),
        React.createElement(
            'p',
            null,
            React.createElement(
                'a',
                {
                    target: '#',
                },
                'linK '
            ),
            React.createElement('b', null, 'react')
        ),
        React.createElement(Counter, {
            count: 300,
        }),
        React.createElement(
            Counter,
            {
                count: 10,
            },
            'TEST'
        )
    );
};
