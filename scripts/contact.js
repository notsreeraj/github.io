
/*
Represents a contact with a name, contact number and email address
 */

(function (core) {

    class Contact {

        /**
         * constructs a new instance of contact class
         * @param fullName the full name of the new made contact
         * @param contactNumber the actual contact number
         * @param emailAddress the emailAddress of the contact
         */
        constructor(fullName = "", contactNumber = "", emailAddress = "") {

            this._fullName = fullName;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;


        }

        get fullName() {
            return this._fullName;
        }

        /**
         * Gets the full name of the contact
         * @param fullName
         */
        set fullName(fullName) {
            // the double equal sign indicates the precise comparison (===) = precisely equals
            if (typeof fullName !== "string" || fullName.trim() === "") {
                throw new Error("Please enter a valid full name");
            }
            this._fullName = fullName;
        }

        /**
         * Getter for contactnumber property
         * @returns {string}
         */
        get contactNumber() {
            return this._contactNumber;
        }

        /**
         * Setter for contactNumber with validation
         * @param contactNumber
         */
        set contactNumber(contactNumber) {
            const phoneRegex = /^\d{3}-\d{3}-\d{4}$/; // 905-555-5555
            if (!phoneRegex.test(contactNumber)) {
                throw new Error("Please enter a valid phone number");
            }
            this._contactNumber = contactNumber;
        }

        /**
         *getter for the email address property
         * @returns {string}
         */
        get emailAddress() {
            return this._emailAddress;
        }

        /**
         * Setter for the emailAddress property with validation
         * @param emailAddress
         */
        set emailAddress(emailAddress) {
            const emailRegex = /^[^\s@]+@[\s@]+.[^\s] + $/
            if (!emailRegex.test(emailAddress)) {
                throw new Error("Please enter a valid email address");
            }
            this._emailAddress = emailAddress;
        }

        // instance methods

        /**
         * To string method to get the property values of an object in string format
         * @returns {string}
         */
        toString() {
            return ` Full Name :${this._fullName}\n
                Email :${this._emailAddress}\n
                Contact Number :${this._contactNumber}`;
        }

        /**
         * Serialize the contact details into a string format suitable for storage
         * @returns {string|null}
         */
        serialize() {
            console.log(this.fullName);
            console.log(this.contactNumber);
            console.log(this.emailAddress);
            if (!this.fullName || !this.contactNumber || !this.emailAddress) {
                console.error("One or more of the contact properties are missing or invalid");
                return null;
            }
            return `${this.fullName}, ${this.contactNumber}, ${this.emailAddress}`;
        }

        /**
         * Deserialize the data and constructs an object
         */
        deserialize(data) {
            // .split returns an array
            console.log("Deserialize begin");
            console.log(typeof data);
            if (typeof data !== "string" || data.split(",").length !== 3) {
                console.log("data.Split.length == " + data.split(",").length)
                console.error("Unable to deserialize the data");
            }
            const propArray = data.split(",");
            this._fullName = propArray[0];
            this._contactNumber = propArray[1];
            this._emailAddress = propArray[2];
        }


    }// class ends here
    core.Contact = Contact;
})(core || (core = {}) );

