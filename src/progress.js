export function createProgressBar(parentNode, progressBarTitle = "Progress", initialState =
    {value: 0, isAnimated: false, isHidden: false}

) {
    if (!parentNode || !(parentNode instanceof HTMLElement)) {
        return;
    }

    let state = {...initialState}; // Локальное состояние прогресс-бара

    const container = createDivWithClassAndText("container");
    container.appendChild(createDivWithClassAndText("title", progressBarTitle));

    const progressBar = createDivWithClassAndText("progressBar");
    let progressCircleClasses = ["progressBar__circle"];
    state.isHidden ? progressCircleClasses.push("progressBar__circle_hidden") : progressCircleClasses;
    state.isAnimated ? progressCircleClasses.push("progressBar__circle_animated") : progressCircleClasses;
    const progressCircle = createDivWithClassAndText(progressCircleClasses);

    progressBar.appendChild(progressCircle);
    progressBar.appendChild(createSettingsSection(state.value, state.isAnimated, state.isHidden));
    container.appendChild(progressBar);

    parentNode.appendChild(container);

    addProgressHandler(state.value);

    if (state.value) {
        setProgress(state.value);
    }

    addClickHandler("#animate", () => state.isAnimated ? turnAnimationOff() : turnAnimationOn());
    addClickHandler("#hide", () => state.isHidden ? show() : hide());

    // Функции для управления состоянием
    function setProgress(newValue) {
        const valueInputField = document.querySelector("#value");
        if (!valueInputField) {
            return new Error("node not found");
        }
        valueInputField.value = newValue;
        state.value = newValue;
        valueInputField.dispatchEvent(new Event('input', {bubbles: true}));
    }

    function turnAnimationOn() {
        if (state.isAnimated) {
            return;
        }
        changeClassPresence(".progressBar__circle", "progressBar__circle_animated");
        state.isAnimated = true;
        const animateToggle = document.querySelector("#animate");
        if (animateToggle) {
            animateToggle.checked = state.isAnimated;
        }
    }

    function turnAnimationOff() {
        if (!state.isAnimated) {
            return;
        }
        changeClassPresence(".progressBar__circle", "progressBar__circle_animated");
        state.isAnimated = false;
        const animateToggle = document.querySelector("#animate");
        if (animateToggle) {
            animateToggle.checked = state.isAnimated;
        }
    }

    function hide() {
        if (state.isHidden) {
            return;
        }
        changeClassPresence(".progressBar__circle", "progressBar__circle_hidden");
        state.isHidden = true;
        const hideToggle = document.querySelector("#hide");
        if (hideToggle) {
            hideToggle.checked = true;
        }
    }

    function show() {
        if (!state.isHidden) {
            return;
        }
        changeClassPresence(".progressBar__circle", "progressBar__circle_hidden");
        state.isHidden = false;
        const hideToggle = document.querySelector("#hide");
        if (hideToggle) {
            hideToggle.checked = false;
        }
    }
}

/**
 * Биндит значение инпута к изменению процента прогресса.
 * @param {number} [growingSpeed] - Скорость изменения прогресса.
 */
function addProgressHandler(growingSpeed = 20) {
    const valueInputField = document.querySelector("#value");
    if (!valueInputField) {
        return new Error("node not found");
    }
    const progressCircle = document.querySelector(".progressBar__circle");
    if (!progressCircle) {
        return new Error("node not found");
    }
    let inter;
    valueInputField.addEventListener('input', (e) => {
        const newInputValue = validateInput(e.target.value)
        e.target.value = newInputValue;
        let currentValue = getComputedStyle(progressCircle).getPropertyValue("--progress");
        clearInterval(inter);
        inter = setInterval(() => {
            currentValue < newInputValue
                ? currentValue++
                : currentValue--;

            progressCircle.style.setProperty('--progress', String(currentValue));
            if (+newInputValue === +currentValue) {
                clearInterval(inter);
            }
        }, growingSpeed);
    });
}

/**
 * Валидирует значение инпута (только от 0 до 100).
 * @param {string} inputString - Строка для валидации.
 * @return {string} Число от 0 до 100.
 */
function validateInput(inputString) {
    if (inputString.length === 0) {
        return "0";
    }
    if (inputString[0] === '0') {
        return inputString.slice(1);
    }
    if (inputString > 100) {
        return "100";
    }
    return inputString.replace(/[^0-9]/g, "");
}

/**
 * Добавляет обработчик события клика для узла.
 * @param {string} selector - Селектор для поиска элемента.
 * @param {function} handler - Функция-обработчик.
 */
function addClickHandler(selector, handler) {
    const clickedNode = document.querySelector(selector);
    if (!clickedNode) {
        return new Error("node not found");
    }
    clickedNode.addEventListener('click', handler);
}

/**
 * Добавляет или удаляет класс у элемента.
 * @param {string} selector - Селектор для поиска элемента.
 * @param {string} className - Класс для добавления/удаления.
 */
function changeClassPresence(selector, className) {
    const searchingNode = document.querySelector(selector);
    if (!searchingNode) {
        return new Error("node not found");
    }
    if (searchingNode.classList.contains(className)) {
        searchingNode.classList.remove(className);
    } else {
        searchingNode.classList.add(className);
    }
}

/**
 * Создает секцию настроек для прогресс-бара.
 * @param {number} value - Начальное значение прогресса.
 * @param {boolean} isAnimated - Состояние анимации.
 * @param {boolean} isHidden - Состояние скрытия.
 * @return {HTMLElement} Созданный элемент настроек.
 */
function createSettingsSection(value, isAnimated, isHidden) {
    const settings = createDivWithClassAndText(["progressBar__settings", "settings"]);
    settings.appendChild(createInputWithText("settings__property", "settings__input", "Value", value, "input", "value"));
    settings.appendChild(createInputWithText("settings__property", "settings__checkbox", "Animate", isAnimated, "checkbox", "animate"));
    settings.appendChild(createInputWithText("settings__property", "settings__checkbox", "Hide", isHidden, "checkbox", "hide"));
    return settings;
}

/**
 * Создает инпут с текстом на основе переданных параметров.
 * @param {string} className - Класс для контейнера инпута.
 * @param {string} inputClassName - Класс для инпута.
 * @param {string} inputText - Текст рядом с инпутом.
 * @param {number|boolean} inputValue - Начальное значение инпута.
 * @param {string} inputType - Тип инпута.
 * @param {string|number} id - ID инпута.
 * @return {HTMLElement} - Контейнер с инпутом и текстом.
 */
function createInputWithText(className = "", inputClassName = "",
                             inputText = "", inputValue = 0,
                             inputType = "",
                             id = String(Date.now())) {

    const inputContainer = createDivWithClassAndText(className);
    const input = document.createElement("input");
    input.type = inputType;
    input.id = id;
    input.classList.add(inputClassName);

    const text = document.createElement("span");
    text.innerHTML = inputText;

    inputContainer.appendChild(input);
    if (inputType === "checkbox") {
        input.checked = inputValue;
        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.classList.add("toggle");
        inputContainer.appendChild(label);
    } else {
        input.value = inputValue;
    }
    inputContainer.appendChild(text)
    return inputContainer;

}

/**
 * Создает простой div с классом и текстом.
 * @param {string|string[]} className - Класс или массив классов для div.
 * @param {string} text - Текст внутри div.
 * @return {HTMLElement} Созданный div элемент.
 */
function createDivWithClassAndText(className = "", text = "") {
    const divElem = document.createElement("div");
    Array.isArray(className) ? className.forEach(name => divElem.classList.add(name)) : divElem.classList.add(className);
    divElem.innerHTML = text;
    return divElem;
}
