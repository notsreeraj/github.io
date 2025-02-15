
(function(core){


    class User{
        constructor(displayName = "", emailAddress = "",
                    userName = "",password = "") {
            this._displayName = displayName;
            this._emailAddress = emailAddress;
            this._userName = userName;
            this._password = password;
        }


        get displayName() {
            return this._displayName;
        }

        set displayName(value) {
            this._displayName = value;
        }

        get emailAddress() {
            return this._emailAddress;
        }

        set emailAddress(value) {
            this._emailAddress = value;
        }

        get userName() {
            return this._userName;
        }

        set userName(value) {
            this._userName = value;
        }

        toString(){

            return `Display Name : ${this.displayName}\n
            Email Address : ${this.emailAddress}\n Username : ${this.userName}`;
        }
        // here we will be converting  the user info in
        toJSON(){
            return {
                DisplayName : this._userName,
                EmailAddress : this._emailAddress,
                UserName : this._userName,
                Password: this._password

            }
        }
        // reading from json.
        fromJSON(data){
            this._displayName = data.DisplayName;
            this._emailAddress = data.EmailAddress;
            this._userName = data.UserName;
            this._password = data.Password;
        }
        serialize(){
            if(this._displayName !=="" && this._emailAddress !=="" && this._userName !=="" ){
                return `${this._displayName}, ${this._emailAddress},${this._userName}`
            }
            console.error("[ERROR] Failed to serialize, one or more user properties ara missing");
            return null;
        }
        deserialize(data){
            let propertyArray = data.split(',')
            this._displayName = propertyArray[0]
            this._emailAddress = propertyArray[1]
            this._userName = propertyArray[2]
        }
        isUserValid( username ="",password ="" , users){
            for(const user of users){
                console.log("Inside the foreach loop used to iterate user array in json");
                console.log(user.userName === username && user.password === password);
                if(user.userName === username && user.password === password){
                    return true;
                }
                else {return false;}
            }
        }
    }
    core.User = User;
})(core || (core = {}));