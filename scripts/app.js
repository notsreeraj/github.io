//IIFE - Immediately Invoked Functional Expression
(function () {

    function DisplayHomePage() {
        console.log('Calling  Display HomePage  function...');

        let aboutUsBtn = document.getElementById('AboutUsBtn');
        aboutUsBtn.addEventListener("click",function (){
            location.href="about.html";
        });
        let mainContent = document.getElementsByTagName('main')[0];

        // creating a dynamic paragraph element in the dom and setting attributes for the paragraph tags
        let mainParagraph = document.createElement("p");
        mainParagraph.setAttribute("id", "mainParagraph");
        mainParagraph.setAttribute("class", "mt-3");

        mainParagraph.textContent = "This is the main paragraph";
        // this line connects the new 'mainparagraph' to the mainContent which is main tag inside the index.html file
        mainContent.appendChild(mainParagraph);

        let  FirstString = "This is";
        let SecondString = `${FirstString} the Main Paragraph from second string`;

        console.log("Changing the content of mainparagraph second time");
        mainParagraph.textContent = SecondString;
        mainContent.appendChild(mainParagraph);


        let DocumentBody = document.body;
        let Article = document.createElement("article");
        let ArticleParagraph = `<p id="ArticleParagraph" class="mt-3"> This is my article paragraph</p>`

        ArticleParagraph.setAttribute("class", "container");
        Article.innerHtml = ArticleParagraph;
        // appending the new created article tag to the body tag inside the document
        DocumentBody.appendChild(Article);



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
        console.log('Calling  Display AboutUs  function...');
    }


    function Start()
    {
        console.log("Starting...");
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
                DisplayContacts();
                break;

        }

    }

    window.addEventListener("load", Start);

})();