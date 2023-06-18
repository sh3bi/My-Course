document.getElementById("addC").addEventListener("submit", function (event) {
  event.preventDefault();
  let name = document.getElementById("name").value;


  // validation checks
  if (!name) {
    alert("Please enter a Course Name.");
    return;
  }
  
  fetch("/insert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name }),
  })
    .then(function (response) {
      if (response.ok) {
        alert("Data inserted successfully!");
        document.getElementById("name").value = "";
        getData();
      } else {
        alert("Failed to insert data!");
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    });
});


/*================================================================================================*/


function getData() {
  //clear any existing data
  const dataList = document.getElementById("dataList");

  while (dataList.firstChild) {
    dataList.removeChild(dataList.lastChild);
  }
  fetch("/view")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.forEach(function (item) {
        let listItem = document.createElement("div");
        listItem.className = "container_Course";
        dataList.appendChild(listItem);

        let h1 = document.createElement("h1");
        h1.textContent = item.name;

        let form = document.createElement("form");
        form.setAttribute("action", "display.html");
        form.setAttribute("id", item.id);

        let aitem = document.createElement("button");
        aitem.textContent = "Show more";
        aitem.setAttribute("id", item.id);
        aitem.setAttribute("type", "submit");

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("id", item.id);
        deleteButton.setAttribute("type", "button");

        listItem.appendChild(h1);
        listItem.appendChild(form);
        form.appendChild(aitem);
        form.appendChild(deleteButton);

        aitem.addEventListener("click", function (event) {
          event.preventDefault();
          let buttonId = form.id; 
          sendButtonId(buttonId);
        });

        deleteButton.addEventListener("click", function (event) {
          event.preventDefault();
          let buttonId = deleteButton.id; 
          deleteCourse(buttonId);
        });
      });
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    });
}


/*================================================================================================*/



getData();

function sendButtonId(buttonId) {
  fetch("/id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: buttonId }),
  })
    .then(function (response) {
      if (response.ok) {
  
        window.location.href = `display.html?id=${buttonId}`;
      } else {
        alert("Failed to send button ID!");
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    });
}

function deleteCourse(buttonId) {
  fetch("/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: buttonId }),
  })
    .then(function (response) {
      if (response.ok) {
        alert("Course deleted successfully!");
        getData();
      } else {
        alert("Failed to delete course!");
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    });
}


