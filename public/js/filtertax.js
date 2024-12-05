let taxswitch = document.getElementById("flexSwitchCheckDefault");
let taxinfo = document.getElementsByClassName("taxinfo");
let displayprice = document.getElementsByClassName("displayprice");
let changetext = document.querySelector(".changetext");
  taxswitch.addEventListener("click", () => {
    for (info of taxinfo) {
      if (info.style.display != "inline") {
        info.style.display = "inline";
        changetext.innerHTML = "Display total after taxes";
        for(dp of displayprice){
          dp.style.display = "none";
        }

      } else {
        changetext.innerHTML = "Display total before taxes";
        info.style.display = "none";
        for(dp of displayprice){
          dp.style.display = "block";
        }
      }
    }
  });

