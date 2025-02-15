(function(){
    // t
   if(!sessionStorage.getItem("user")){
     console.log("[AUTHGUARD] Unauthorized access detectec. Redirecting to login page.]")  ;
     location.href = "login.html";
   }
})();