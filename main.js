import './styles/style.css'
import {createProgressBar} from "./src/progress.js";


// функция создания Progress бара и инициализация его параметров
function start() {
    const root = document.querySelector("#root");
    if (!root) {
        return new Error("node not found");
    }
    createProgressBar(root, 'Progress',
        {value: 20, isHidden: false, isAnimated: false})
}

start()

