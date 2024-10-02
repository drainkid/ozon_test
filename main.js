import './style.css'
import {createProgressBar} from "./progress.js";


function start() {
    const root = document.querySelector("#root");
    if (!root) {
        return new Error("node not found");
    }
    createProgressBar(root, 'Progress',
        {value: 20, isHidden: false, isAnimated: false})
}

start()

