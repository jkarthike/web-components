class RealDigitalTextField extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                .input-field {
                    height: 30px;
                    font-size: 16px;
                    border: 1px solid darkgrey;
                    min-width: 300px;
                }

                .label {
                    display: flex;
                    color: var(--color-label, #000);
                    min-width: 100px;
                    justify-content: flex-start;
                }

                .error-message {
                    margin: 0;
                    color: #f30657;
                    font-size: 14px;
                    font-weight: 600;
                    text-align: left;
                    display: none;
                }
            </style>
            <label class="label"></label>
            <input class="input-field"></input>
            <p class="error-message">Invalid input!</p>
        `;
        this.inputElement;
        this.labelElement;
    }

    get name() {
        return this.getAttribute("name") || "";
    }

    get label() {
        return this.getAttribute("label") || "";
    }

    get type() {
        return this.getAttribute("type") || "text";
    }

    get placeholder() {
        return this.getAttribute("placeholder") || "";
    }

    get validationPattern() {
        return this.getAttribute("validation") || "";
    }

    get required() {
        return this.getAttribute("required") || false;
    }

    connectedCallback() {
        this.labelElement = this.shadowRoot.querySelector("label");
        this.inputElement = this.shadowRoot.querySelector("input");
        this.errorMessage = this.shadowRoot.querySelector("p");

        this.labelElement.innerText = this.label;
        this.inputElement.setAttribute("type", this.type);
        this.inputElement.setAttribute("placeholder", this.placeholder);
        this.inputElement.setAttribute("name", this.name);
        this.inputElement.setAttribute("required", this.required);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "name" && this.inputElement) {
            this.inputElement.setAttribute("name", newValue);
        }

        if (name == "placeholder" && this.inputElement) {
            this.inputElement.setAttribute("placeholder", newValue);
        }

        if (name == "required" && this.inputElement) {
            this.inputElement.setAttribute("required", newValue);
        }

        if (name == "type" && this.inputElement) {
            if (newValue !== null) {
                this.inputElement.setAttribute("type", newValue);
            } else {
                this.inputElement.setAttribute("type", "text");
            }
        }

        if (name == "label" && this.labelElement) {
            this.labelElement.innerText = newValue;
        }
    }

    toggleErrorMessage(show) {
        show
            ? (this.errorMessage.style.display = "block")
            : (this.errorMessage.style.display = "none");
    }

    checkValidity() {
        if (!this.inputElement.value && this.required) {
            return false;
        }
        if (this.inputElement.value && this.validationPattern) {
            const regex = new RegExp(this.validationPattern);
            return regex.test(this.inputElement.value);
        }
        return true;
    }

    clearValue() {
        this.inputElement.value = null;
        this.toggleErrorMessage(false);
    }
}

customElements.define("real-digital-textfield", RealDigitalTextField);
