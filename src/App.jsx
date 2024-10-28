/* @jsx React.createElement */
import React from '../core/React.js';

let count = 0;
const Counter = (props) => {
    // console.log('Counter', props);
    const testArr = [1, 2, 3];
    const Even = () => (
        <div>
            even
            <div>你真棒，我是Even</div>
            <div>不是吧</div>
        </div>
    );
    const Odd = () => <div>odd</div>;

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
            {/* <p>{count % 2 ? <Odd /> : <Even />}</p> */}
            <p>
                {count % 2 ? (
                    <div>
                        foo<div>child</div><div>kid</div>
                    </div>
                ) : (
                    <div>bar</div>
                )}
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
            {/* <Counter count={300}></Counter> */}
            <Counter count={10}>TEST123</Counter>
        </div>
    );
};
