const inputElement = document.querySelector("#favchap");
const buttonElement = document.querySelector("button");
const listElement = document.querySelector("#list");

buttonElement.addEventListener("click", function () {
    if (inputElement.value.trim() !== "") {
        const li = document.createElement("li");
        li.textContent = inputElement.value;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        
        deleteBtn.addEventListener("click", function () {
            listElement.removeChild(li);
            inputElement.focus();
        });
        
        li.appendChild(deleteBtn);
        listElement.appendChild(li);
        
        inputElement.value = "";
    }
    
    inputElement.focus();
});