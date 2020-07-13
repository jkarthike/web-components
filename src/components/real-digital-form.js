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
        <form id="form" method="${this.method}" action="post">
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
                            .includes("real-digital-textfield") &&
                        this.slotInputElements.filter(
                            (item) =>
                                item.inputElement.name ==
                                arrayItem.inputElement.name
                        ).length == 0
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

    /**
     * Check the validation of input field based on patten property provided
     */
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

    /**
     * Submits the form, form data being request
     */
    async submit() {
        if (this.checkValidity() && this.action) {
            const data = await fetch(this.action, {
                method: "POST",
                body: this.formdata,
            });

            if (data.ok) {
                this.dispatchEvent(
                    new CustomEvent("submit", {
                        detail: {
                            data: data.json(),
                        },
                    })
                );
            } else {
                this.dispatchEvent(
                    new CustomEvent("submitionError", {
                        detail: {
                            data: data.json(),
                        },
                    })
                );
            }
        }
    }

    /**
     * Gets the form data, based on input field inside form
     */
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

    /**
     * Gets the action property
     */
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
