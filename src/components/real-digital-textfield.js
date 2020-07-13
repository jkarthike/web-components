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

    /**
     * Gets the name property
     */
    get name() {
        return this.getAttribute("name") || "";
    }

    /**
     * Gets the label property
     */
    get label() {
        return this.getAttribute("label") || "";
    }

    /**
     * Gets the type property
     */
    get type() {
        return this.getAttribute("type") || "text";
    }

    /**
     * Gets the placeholder property
     */
    get placeholder() {
        return this.getAttribute("placeholder") || "";
    }

    /**
     * Gets the validationPattern property
     */
    get validationPattern() {
        return this.getAttribute("validation") || "";
    }

    /**
     * Gets the required property
     */
    get required() {
        return this.getAttribute("required") || false;
    }

    /**
     * shows/hides error message element
     */
    toggleErrorMessage(show) {
        show
            ? (this.errorMessage.style.display = "block")
            : (this.errorMessage.style.display = "none");
    }

    /**
     * Check the validation of input field based on patten property provided
     */
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

    /**
     * Clears the input value and hides error message element
     */
    clearValue() {
        this.inputElement.value = null;
        this.toggleErrorMessage(false);
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
        // For input element
        if (this.inputElement) {
            switch (name) {
                case "name":
                    this.inputElement.setAttribute("name", newValue);
                    break;
                case "placeholder":
                    this.inputElement.setAttribute("placeholder", newValue);
                    break;
                case "required":
                    this.inputElement.setAttribute("required", newValue);
                    break;
                case "type":
                    if (newValue !== null) {
                        this.inputElement.setAttribute("type", newValue);
                    } else {
                        this.inputElement.setAttribute("type", "text");
                    }
                    break;
                default:
                    break;
            }
        }

        // For label element
        if (name == "label" && this.labelElement) {
            this.labelElement.innerText = newValue;
        }
    }
}

customElements.define("real-digital-textfield", RealDigitalTextField);
