class RealDigitalForm extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
            }
            form {
                display: grid;
                grid-template-columns: 200px;
                grid-gap: 20px;
                align-items: center;
                justify-items: center;
            }
        </style>
        <form id="form" method="${this.method}" action="${this.action}">
            <slot></slot>
        </form>
        `;

        this.slotInputElements = [];
        this.slotSubmitButton;
        this.submitEventAttached = false;
        this.form;

        const slots = this.shadowRoot.querySelectorAll("slot");
        slots[0].addEventListener("slotchange", (event) => {
            const slotNodes = slots[0].assignedNodes();
            slotNodes.forEach(
                function (arrayItem) {
                    // input field
                    if (
                        arrayItem.nodeName
                            .toLowerCase()
                            .includes("real-digital-textfield")
                    ) {
                        this.slotInputElements.push(arrayItem);
                    }

                    // Submit
                    if (
                        arrayItem.nodeName
                            .toLowerCase()
                            .includes("real-digital-button")
                    ) {
                        this.slotSubmitButton = arrayItem;
                    }
                }.bind(this)
            );
            if (this.slotSubmitButton && !this.submitEventAttached) {
                this.slotSubmitButton.buttonElement.addEventListener(
                    "click",
                    () => {
                        this.submit();
                    }
                );
                this.submitEventAttached = true;
            }
        });
    }

    checkValidity() {
        let validity = true;
        this.slotInputElements.forEach((el) => {
            if (!el.checkValidity()) {
                el.toggleErrorMessage(true);
                validity = false;
            } else {
                el.toggleErrorMessage(false);
            }
        });
        return validity;
    }

    async submit() {
        if (this.checkValidity() && this.action) {
            let data;
            if (this.method == "GET") {
                const formdata = new URLSearchParams(this.formdata).toString();
                data = await fetch(`${this.action}?${formdata}`);
            } else {
                data = await fetch(this.action, {
                    method: "POST",
                    body: this.formdata,
                });
            }
            this.dispatchEvent(
                new CustomEvent("submit", {
                    detail: {
                        data: data.json(),
                    },
                })
            );
        }
    }

    get formdata() {
        const formdata = new FormData();
        const jsondata = {};
        this.slotInputElements.forEach((el) => {
            formdata.set(el.inputElement.name, el.inputElement.value);
            jsondata[el.inputElement.name] = el.inputElement.value;
        });
        formdata.json = jsondata;
        return formdata;
    }

    get method() {
        const method = (this.getAttribute("method") || "get").toUpperCase();
        if (["GET", "POST"].includes(method)) {
            return method;
        }
        return "GET";
    }

    get action() {
        return this.getAttribute("action") || "";
    }

    connectedCallback() {
        this.form = this.shadowRoot.getElementById("form");
        this.form.addEventListener("keydown", (ev) => {
            switch (ev.keyCode) {
                case 13: //Enter
                    this.submit();
                    break;
                default:
                    break;
            }
        });
    }
}

if (!customElements.get("real-digital-form")) {
    customElements.define("real-digital-form", RealDigitalForm);
}
