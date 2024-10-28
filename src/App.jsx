/* @jsx React.createElement */
import React from '../core/React.js';

let count = 0;
const Counter = (props) => {
    console.log('Counter', props);
    const testArr = [1, 2, 3];

    return (
        <>
            <div>{props.children}</div>
            <div>
                {testArr.map((item) => {
                    return <div key={item}>{item}</div>;
                })}
            </div>
            <button
                onClick={() => {
                    console.log('click');
                    count++;
                    React.update();
                }}
            >
                +1
            </button>
            {/* <p>count: {props.count}</p> */}
            <p>count: {count}</p>
            {count % 2 ? (
                <p
                    style={{
                        color: 'red',
                    }}
                >
                    {'odd'}
                </p>
            ) : (
                <p>even</p>
            )}
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
            {/* <Counter count={300}></Counter> */}
            <Counter count={10}>TEST123</Counter>
        </div>
    );
};
