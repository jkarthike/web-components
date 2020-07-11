class RealDigitalButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                .button {
                    height: 30px;
                    font-size: 16px;
                    border: 1px solid var(--color-primary, #06a7f5);
                    min-width: 120px;
                    border-radius: 5px;
                    background: var(--color-primary, #06a7f5);
                    color: var(--color-button-label, #fff);
                }
            </style>
            <button class="button"><slot></slot></button>
        `;
        this.buttonElement;
    }

    get type() {
        return this.getAttribute("type") || "button";
    }

    connectedCallback() {
        this.buttonElement = this.shadowRoot.querySelector("button");
        if (this.hasAttribute("type")) {
            this.buttonElement.setAttribute("type", this.getAttribute("type"));
        } else {
            this.buttonElement.setAttribute("type", "button");
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "type" && this.buttonElement) {
            if (newValue !== null) {
                this.buttonElement.setAttribute("type", newValue);
            } else {
                this.buttonElement.setAttribute("type", "button");
            }
        }
    }
}

customElements.define("real-digital-button", RealDigitalButton);
