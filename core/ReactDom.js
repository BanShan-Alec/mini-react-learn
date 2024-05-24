import { render } from "./React.js";

const ReactDOM = {
  createRoot: (container) => {
    // debugger;
    return {
      render: (el) => {
        render(el, container);
      },
    };
  },
};
export default ReactDOM;
