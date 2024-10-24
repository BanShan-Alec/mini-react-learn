/* @jsx React.createElement */
import React from '../core/React.js';

const Counter = (props) => {
    console.log('Counter', props);

    return (
        <>
            <div>{props.children}</div>
            <p>
                count: {props.count}
            </p>
        </>
    );
};

export const App = () => {
    return (
        <div id="container">
            Hello World<span>!!!!</span>
            <p>
                <a target="#">linK </a>
                <b>react</b>
            </p>
            <Counter count={300}></Counter>
            <Counter count={10}>TEST123</Counter>
        </div>
    );
};
