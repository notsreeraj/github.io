//IIFE - Immediately Invoked Functional Expression


(function () {

    /**
     * This method is to test see whether the data inside usesr.json is read properly
     * @returns {Promise<void>}
     */
    async function printUsers() {
        try {
            // Fetch the JSON file
            const response = await fetch("data/users.json");
            const data = await response.json();

            // Loop through each user and print their details
            data.users.forEach(user => {
                console.log(`Name: ${user.DisplayName}`);
                console.log(`Email: ${user.EmailAddress}`);
                console.log(`Username: ${user.UserName}`);
                console.log("--------------------");
            });
        } catch (error) {
            console.error("Error reading users.json:", error);
        }
    }




    function CheckLogin(){
        console.log("[INFO] Checking user login status....");
        const loginNav = document.getElementById('login');
        if(!loginNav){
            console.warn("[WARNING] loginNav element not found , skipping checkLogin()")
            return;
        }

        const userSession = sessionStorage.getItem("user");
        console.log("user session : ", userSession);
        if(userSession){

            loginNav.innerHTML =   `<i class="fas fas-sign-out-akt"></i>Logout`;
            loginNav.href ="#";
            loginNav.addEventListener("click",()=>{
                sessionStorage.removeItem("user");
                location.href = "login.html";
            });
        }
        else{
            console.log("Cannot Find Session ....")
        }
    }

    function updateActiveNewListener(){
        console.log("Adding custom events for navbar");
        const currentPage = document.title.trim();

        // decendants
        const navLinks = document.querySelectorAll("nav a ");
        navLinks.forEach(link => {

            if(link.textContent === currentPage){
                link.classList.add("active");
            }else{
                link.classList.remove("active");
            }

        })
    }

    async function  LoadHeader(){
        console.log('[INFO] => LoadHeader()');

       return fetch("header.html")
            .then(response => response.text())
            .then(data =>{

                document.querySelector("header").innerHTML = data;
                updateActiveNewListener();

        })
            //TODO
            .catch(error => console.log( "[ERROR] Unable to load header: ",error));
    }

    function DisplayRegisterPage(){
        console.log("Calling displayRegisterPage()");
    }

    function DisplayLoginPage(){
        console.log("Calling displayLoginPage()");
        // Call the function
        printUsers().then(r => {});
        const messageArea = document.getElementById("messageArea");
        const loginBtn = document.getElementById("loginButton");
        const cancelBtn = document.getElementById("cancelButton");

        // message
        messageArea.style.display = "none";

        if(!loginBtn){
            console.error("[ERROR] Login button not found");
            return;
        }

        loginBtn.addEventListener("click", async (event)=>{
           // event.stopPropagation();
            event.preventDefault();


            const username= document.getElementById("userName").value.trim();
            const password= document.getElementById("password").value.trim();

            try {
                console.log(username, password);

                // the await keyword tells js to pause here(thread) until the fetch request completes.
                const response = await fetch("data/users.json");
                console.log("[INFO]response is set");
                if (!response.ok) {
                    throw new Error(`[ERROR] Unable to fetch users from ${response.status}`);
                }

                const jsonData = await response.json();
                console.log("[Debug] Fetched Json Data : " , jsonData);
                const users = jsonData.users;

                if(!Array.isArray(users)){
                    throw new Error("[ERROR] Json data does not contain valid array ");
                }
                let success = false ;
                let authenticatedUser = null;

                for(const user of users){


                    if(user.UserName === username && user.Password === password){

                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }
                if(success){
                    // here the key of the session item is 'user'
                    sessionStorage.setItem("user",JSON.stringify({
                        DisplayName: authenticatedUser.displayName,
                        EmailAddress: authenticatedUser.emailAddress,
                        Username : authenticatedUser.userName
                        }));
                    messageArea.classList.remove("alert", "alert-danger");
                    messageArea.style.display = "none";
                    location.href="contact-list.html";
                }
                else {
                    messageArea.classList.add("alert","alert-danger");
                    messageArea.style.display = "block";
                    messageArea.textContent = "Invalid Username or password. Please try again";

                    document.getElementById("userName").focus();
                    document.getElementById("userEmail")?.select();
                }

            }
            catch(err){
                throw err;
               // console.error("[Error] Login failed",err);
            }
        })
        cancelBtn.addEventListener("click",  ()=>{
            document.getElementById("loginForm").reset();
            location.href = "index.html";
        })
    }


    /**
     * To Handler the cancel click
     */
    function handleCancelClick(){
        location.hash = "contact-list.html";

    }

    /**
     * Handle the process of editing an existing contact
     * @param event
     * @param contact
     * @param page
     */
    function handleEditClick(event, contact , page){
        // prevent default from submission
        try{
            event.preventDefault();
            if (!validateForm()) {
                alert("Invalid data ! Please check you inputs");
                return;
            }
            // retrieve update values from the form fields
            const fullName = document.getElementById("fullName").value;
            const contactNumber = document.getElementById("contactNumber").value;
            const emailAddress = document.getElementById("emailAddress").value;

            // update the contact information
            contact.fullName = fullName;
            contact.contactNumber = contactNumber;
            contact.emailAddress = emailAddress;

            // save the update contact back to local storage (csv format)
            localStorage.setItem(page, contact.serialize());

            location.hash = "contact-list.html";
        }
        catch (err){
            console.log("[Error] Failed to Edit the contact," , err);
        }
    }

    /**
     * Handles the process of adding a new contact
     * @param event - the event object to prevent from submission
     */
    function handleAddClick(event){
        // prevent from default submission
        event.preventDefault();
        if(!validateForm()){
            alert("Form Contains errors. please correct them before submitting")
            return;
        }
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        AddContact(fullName,emailAddress,contactNumber);
        location.href="contact-list.html";
    }

    function addEventListenerOnce(elementId, event, handler){

        // retrieve the element from the dom
        const element = document.getElementById(elementId);

        if(element){
            element.removeEventListener(event, handler);
            element.addEventListener(event, handler);
        }else{
            console.warn(`[WARN] Element with ID' ${elementId}' not found`)
        }
    }

    /**
     * Validate the entire form by checking the validity of each input field
     * @return {boolean} - return true if all fields pass validation and false otherwise
     */
    function validateForm(){
        console.log("FUllnameValidaiton : ", validateInput("fullName")  )
        console.log("contactNumber : ", validateInput("contactNumber") )
        console.log("emailAddress : ", validateInput("emailAddress")  )
        return(
            validateInput("fullName") &&
            validateInput("contactNumber") &&
            validateInput("emailAddress")
           );

    }

    /**
     * Validates an input field based on predefined validation rules
     * @param fieldId
     * @returns {boolean}
     */
    function validateInput(fieldId){
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}`);
        const rule = VALIDATION_RULES[fieldId];


        if(!field || !errorElement ||!rule) {
            console.warn(`[WARN] Validation rule not found for \`${fieldId}\``);
            return false;
        }
        // test for empty value

        if(field.value.trim() === ""){
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }

        // check if the input fails to match the regex pattern

        if(!rule.regex.test(field.value)){
            console.log("!rule.regex.test(field.value => true")
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }
        // clear the error message if validation passes
        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;

    }


    function attachValidationListener(){
        console.log("[INFO] Attaching validation listeners");
        //iterate over each defined in Validation_RULES
        Object.keys(VALIDATION_RULES).forEach((fieldId)=>{
           const field = document.getElementById(fieldId);
           if(!field){
               console.warn(`[WARNING] Field'${fieldId}' does not exist`);
               return;
           }
            // attach event listener using centralized validation (custom event function)
            addEventListenerOnce(fieldId, "input",()=> validateInput(fieldId));

        });

    }


    const VALIDATION_RULES = {
        fullName: {
            regex: /^[A-Za-z\s]+$/, // Allows only letters and spaces
            errorMessage: "Full name must contain only letters and spaces"
        },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/, // Allows exactly 10 digits (like 4376609725)
            errorMessage: "Contact Number must be exactly 10 digits"
        },
        emailAddress: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Standard email format
            errorMessage: "Enter a valid email address"
        }
    };


    function AddContact(fullName ,contactNumber,emailAddress){
        console.log("[DEBUG] AddContact triggered");

        if(!validateForm()){
            alert("[WARNING] Form contains errors. Please correct them before submitting");
        }

        let contact = new core.Contact(fullName,contactNumber,emailAddress);
        console.log(fullName);

        if(contact.serialize()){
            // we need to store the serialized string to the local storage, that would be in the browser itself
            // here we consider the date the contact was created as the primary key, stored as a string
            let key = `contact_${Date.now()}`;
            // so the storage system is based on key value pair type
            localStorage.setItem(key, contact.serialize());
            console.log("serializing in add contact method*****>" ,contact.serialize());
        }else{
            console.error("[ERROR] Contact serialization failed");
        }
        location.href="contact-list.html";

    }


    function DisplayEditPage(){
        console.log("Displaying EditPage");

        const page = location.hash.substring(1);
        console.log(page);

        const editButton = document.getElementById("editButton");
        switch (page) {
            case "add":

                document.title = "Add Contact";
                //Add contact
                const heading = document.querySelector("main>h1").textContent = "Add Contact";

                const cancelButton = document.getElementById("cancelButton");

                if(editButton){
                    editButton.innerHTML = `<i class="fa-solid fa-id-card m-2"></i>Add Contact `
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");

                }

                addEventListenerOnce("editButton","click",handleAddClick);
                addEventListenerOnce("cancelButton","click",handleCancelClick);

                break;

            default:
            {                // Edit Contact
                const contact = new core.Contact();
                const contactKey = location.hash.replace("#edit", "");
                const contactData = localStorage.getItem(contactKey);
                console.log( "contact Data  in Edit form: ", contactData);
                if (contactData) {
                    contact.deserialize(contactData);
                    document.getElementById("fullName").value = contact.fullName;
                    document.getElementById("contactNumber").value = contact.contactNumber;
                    console.log( "Contact number in edit form: ",contact.contactNumber);
                    document.getElementById("emailAddress").value = contact.emailAddress;

                }
                else {
                    console.error("[Error] Could Load contact data")
                }

                    if(editButton){
                        editButton.innerHTML = `<i class="fa-solid fa-id-card m-2"></i>Add Contact `
                        editButton.classList.remove("btn-success");
                        editButton.classList.add("btn-primary");
                    }

                addEventListenerOnce("editButton","click", (event)=>handleEditClick(event, contact , page));
                addEventListenerOnce("cancelButton","click",handleCancelClick);

            }
                break;
        }
    }


    async function DisplayWeather(){
        const apiKey = "34f7a96a46a423f91f38bd1343d83196";
        const city = "Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try{
            // here the fetch promises that it will return a json when the url responds
             const response=await fetch(url);
             //  not 200 ok status quote
             if(!response.ok){
                 throw new Error("Failed to fetch weather data from open weather.org = " + response.statusText);
             }
             const data= await response.json();
             console.log( "Weather API Response",data);

             const weatherDataElement = document.getElementById("weather-data");
             weatherDataElement.innerHTML= `
                <strong> city:</strong> ${data.name}<br>
                <strong> Temperature: </strong> ${data.main.temp}<br>
                <strong>Weather: </strong> ${data.weather[0].description}<br>`;
        }
        catch(err){
            console.log( "Error fetching weather data",err);
            document.getElementById("weather-data").textContent= "unable to fetch weather data";
        }

    }

    function DisplayHomePage() {
        console.log('Calling  Display HomePage  function...');

        // we changed the syntax of the callback function to an arrow representing a arrow function
        let aboutUsBtn = document.getElementById('AboutUsBtn');
        aboutUsBtn.addEventListener("click",()=>{
            location.href="about.html";
        });

        console.log("Api call");
        DisplayWeather();

        document.querySelector("main").insertAdjacentHTML(
            "beforeend",
            `<p id = "MainParagraph" class = "mt-3"> This is the paragraph from the query selector</p>`
        );
        document.querySelector("main").insertAdjacentHTML(
            "beforeend",
            ` <article class = "container">
                            <p id = "ArticleParagraph" class = "mt-3"> This is my article paragraph from the selector</p>\
                    </article>`

        );


    }

    function DisplayAboutUs(){
        console.log('Calling  Display AboutUs  function...');
    }

    function DisplayProducts(){
        console.log('Calling  Display AboutUs  function...');
    }

    function DisplayServices(){
        console.log('Calling  Display AboutUs  function...');
    }

    function DisplayContacts(){
        console.log('Calling  Display contact page   function...');

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckBox = document.getElementById("subscribeCheckbox");


        sendButton.addEventListener("click", function (event){

            event.preventDefault();

            if(!validateForm()){
                alert("Please fix your errors before submitting")
                return;
            }

            if (subscribeCheckBox.checked) {
                AddContact(
                    document.getElementById("fullName").value,
                    document.getElementById("contactNumber").value,
                    document.getElementById("emailAddress").value,
                )
            }

            alert("Form submitted successfully");
        })
    }

    function DisplayContactListPage(){
        console.log('Calling  Display Contact List  function...');

        // check the local storage first
        if(localStorage.length>0){
            let contactList = document.getElementById("contactList");
            let data = "";

            // here keys is an array of string
            let keys = Object.keys(localStorage)
            console.log( "keys = "+keys);

            let index = 1;

            for(const key of keys){
                if(key.startsWith("contact_")){
                    let contactData= localStorage.getItem(key);
                    try{
                        console.log( "item = " +contactData);
                        try{
                            let contact = new core.Contact();
                            console.log("New contact is instantiated >>>>")
                            // assigning properties to the contact object using deserialize method
                            contact.deserialize(contactData);
                            console.log("New contact is deserialized >>>>")
                            data +=`<tr>
                                     <th scope = "row" class = "text-center" >${index}</th>
                                     <td>${contact.fullName}</td>
                                     <td>${contact.contactNumber}</td>
                                     <td>${contact.emailAddress}</td>
                                     <td class="text-center">
                                        <button value ="${key}" class="btn btn-warning btn-sm edit">
                                                <i class="fa-solid fa-pen-to-square"></i>Edit
                                        </button>
                                     </td>
                                     <td  class="text-center">
                                        <button  value ="${key}" class = "btn btn-danger btn-sm delete"> <i class="fa-solid fa-xmark m-1"></i>Delete
                                        </button>
                                        </td>
                                </tr>`;
                            index++;
                        }
                        catch (error){
                            console.log( "unable to instantiate the contact object"+ error);
                        }


                    }
                    catch(error){
                        console.log("Error: Failed to add new contact data")
                    }
                }
                else{
                    console.warn("Skipping non-contact key");
                }
            }
            contactList.innerHTML = data;
        }
        const addButton = document.getElementById("addButton");
        addButton.addEventListener("click", ()=>{
           if(addButton){
               addButton.addEventListener("click",()=>{
                   // writing in extra #add to the href
                  location.href = "edit.html#add ";

               });
           }
        });
           // here delete buttons would be a list of buttons
           const deleteButtons = document.querySelectorAll("button.delete");
           deleteButtons.forEach(button=>{
              button.addEventListener("click", function(){
                  if(confirm("Are you sure to proceed with delete action?")){
                      localStorage.removeItem(this.value);
                      location.href = "contact-list.html";
                  }
              })
           });
        // here delete buttons would be a list of buttons
        const editButton = document.querySelectorAll("button.edit");
        editButton.forEach(button=>{
            button.addEventListener("click", function(){
                // concatenate the value from the edit link to the edit.html{key}
                location.href = "edit.html#edit" + this.value;
            })
        });

    }

    async function Start()
    {


        console.log("Displaying " + document.title);
        // load header first , then run check login after
        await LoadHeader().then(()=> {
             CheckLogin()
         });

        // getting the string value inside the title tag, which is used as the case condition
        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;
            case"About":
                DisplayAboutUs();
                break;
            case"Products":
                DisplayProducts();
                break;
            case"Services":
                DisplayServices();
                break;
            case"Contacts":
                attachValidationListener();
                DisplayContacts();
                break;
            case"Contact-List":
                DisplayContactListPage();
                break;
            case"Edit Contact":
                attachValidationListener();
                DisplayEditPage();
                break;
            case"Login Page":
                 DisplayLoginPage();
                break;
            case"Register":

                DisplayRegisterPage();
                break;

        }

    }

    window.addEventListener("DOMContentLoaded",()=>{
        console.log("Dom fully loaded and parsed");
         Start();

    });

})();