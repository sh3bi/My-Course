const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

document.getElementById("addSlideForm").addEventListener("submit", function (event) {
  event.preventDefault();
  let slideName = document.getElementById("slideName").value;
  let slideFile = document.getElementById("slideFile").files[0];

  // validation checks
  if (slideName.trim() === "") {
    alert("Please enter a slide name.");
    return;
  }

  if (!slideFile) {
    alert("Please select a slide file.");
    return;
  }

  if (slideFile.type !== "application/pdf") {
    alert("Please select a PDF file for the slide.");
    return;
  }

  let formData = new FormData();
  formData.append("course_id", id);
  formData.append("slideName", slideName);
  formData.append("slideFile", slideFile);

  fetch("/addSlide", {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      if (response.ok) {
        alert("Slide added successfully!");
        document.getElementById("slideName").value = "";
        document.getElementById("slideFile").value = "";
        getSlides();
      } else {
        alert("Failed to add slide!");
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    });
});


/*================================================================================================*/


document.getElementById("addLinkForm").addEventListener("submit", function (event) {
  event.preventDefault();
  let linkUrl = document.getElementById("linkUrl").value;
  let linkName = document.getElementById("linkName").value;

    // validation checks
    if (!linkUrl) {
      alert("Please select a slide file.");
      return;
    }
  
    if (!linkName) {
      alert("Please select a slide file.");
      return;
    }


  fetch("/addLink", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      course_id: id,
      linkUrl: linkUrl,
      linkName: linkName,
    }),
  })
    .then(function (response) {
      if (response.ok) {
        alert("Link added successfully!");
        document.getElementById("linkUrl").value = "";
        document.getElementById("linkName").value = "";
        getLinks();
      } else {
        alert("Failed to add link!");
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    });
});


/*================================================================================================*/


function getSlides() {
  const slidesList = document.getElementById("slidesList");

  while (slidesList.firstChild) {
    slidesList.removeChild(slidesList.lastChild);
  }

  fetch(`/getSlides?course_id=${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.forEach(function (slide) {
        let listItem = document.createElement("div");
        listItem.className = "slideItem";
        listItem.setAttribute("id",slide.id);
        slidesList.appendChild(listItem);

        let slideName = document.createElement("h3");
        slideName.textContent = slide.name;
        slideName.setAttribute("id",slide.id);

       
        let viewLink = document.createElement("a");
        viewLink.className = "view";
        viewLink.textContent = "View";
        viewLink.href = slide.file_path;
        viewLink.setAttribute("id",slide.id);




        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("id",slide.id);

        listItem.appendChild(slideName);
        listItem.appendChild(viewLink);
        listItem.appendChild(deleteButton);

        deleteButton.addEventListener("click", function (event) {
          event.preventDefault();
          let buttonId = deleteButton.id;
          deleteSlide(buttonId);
        });


      });
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    });
}


/*================================================================================================*/


function getLinks() {
  const linksList = document.getElementById("linksList");

  while (linksList.firstChild) {
    linksList.removeChild(linksList.lastChild);
  }

  fetch(`/getLinks?course_id=${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.forEach(function (link) {
        let listItem = document.createElement("div");
        listItem.className = "linkItem";
        listItem.setAttribute("id",link.id);
        linksList.appendChild(listItem);

        let linkName = document.createElement("h3");
        linkName.textContent = link.name;
        linkName.setAttribute("id",link.id);

        let linkUrl = document.createElement("a");
        linkUrl.href = link.link_url;
        linkUrl.textContent = link.link_url;
        linkUrl.setAttribute("id",link.id);

       /* let deleteLink = document.createElement("a");
        deleteLink.textContent = "Delete";
        deleteLink.href = "#";
        deleteLink.addEventListener("click", function (event) {
          event.preventDefault();
          deleteLinkItem(link.id);
        });*/
        

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("id",link.id);


        listItem.appendChild(linkName);
        listItem.appendChild(linkUrl);
        listItem.appendChild(deleteButton);


        deleteButton.addEventListener("click", function (event) {
          event.preventDefault();
          let buttonId = deleteButton.id;
          deleteLinkItem(buttonId);
        });
        
       
        
        


      });
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    });
}


/*================================================================================================*/


function deleteSlide(buttonId) {
  fetch("/deleteSlide", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: buttonId}),
  })
    .then(function (response) {
      if (response.ok) {
        alert("Slide deleted successfully!");
        getSlides();
      } else {
        alert("Failed to delete slide!");
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    });
}


function deleteLinkItem(buttonId) {
  fetch("/deleteLink", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: buttonId }),
  })
    .then(function (response) {
      if (response.ok) {
        alert("Link deleted successfully!");
        getLinks();
      } else {
        alert("Failed to delete link!");
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    });
}



getSlides();
getLinks();
