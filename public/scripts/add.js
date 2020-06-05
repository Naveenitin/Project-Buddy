function addtype() {
    document.getElementById("project[url]").value="";
    document.getElementById("project[idea]").value="";
    var select = document.getElementById("project[type]");
    if(select.value=='article')
    {
        document.getElementById("1").classList.add("hidden");
        document.getElementById("2").classList.add("hidden");
        console.log("article");
    }
    else{
        document.getElementById("1").classList.remove("hidden");
        document.getElementById("2").classList.remove("hidden");
        console.log("article");
    }
    
}