const button = document.querySelector("button");
const input = document.querySelector(".userEntry");
const display = document.querySelector(".up");
const views = document.querySelector(".view");
const themeCheck = document.querySelector(".check");
const data = { name: "default" };
const id = {value: "default"}

const cattyApi = "https://testowy123.herokuapp.com/catty";
const catApi = "https://testowy123.herokuapp.com/cat";
const viewApi = "https://testowy123.herokuapp.com/views";
const deleteApi = "https://testowy123.herokuapp.com/delete";

const downloadViews = () => {
  fetch(viewApi)
    .then((response) => response.json())
    .then((view) => {
      views.textContent = `View count: ${view.count}`;
    });
};
downloadViews();

const createDataContainer = (data, n, parent) => {
  for (i = 0; i < n; i++) {
    const container = document.createElement("div");
    parent.appendChild(container);
    container.setAttribute("class", "container");
    container.setAttribute("id", `${data[i]._id}`);
    const p = document.createElement("p");
    p.classList.add("data");
    container.appendChild(p);
    const del = document.createElement("div");
    del.classList.add("delete");
    container.appendChild(del);
    del.innerHTML = `<i class="material-icons">remove_circle</i>`;
    const t = document.createElement("pre");
    t.classList.add("time");
    container.appendChild(t);
    p.textContent = data[i].name;
    t.textContent = `Entry added at ${data[i].time}`;

    del.firstChild.addEventListener("click", (e) => {
      id.value = e.target.parentNode.parentNode.id
      fetch(deleteApi, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      })
      .then((response) => response.json())
      .then((data)=> {
        console.log(data);
        while (display.lastElementChild) {
          display.removeChild(display.lastElementChild);
        }
        downloadData()
      })
    });
  }
};

const handleUpload = (e) => {
  e.preventDefault();
  if (input.value !== "") {
    data.name = input.value;
    fetch(cattyApi, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        button.innerText = data.result;
        button.style.boxShadow = "inset 0px 39px 0px -24px #47d53e";
        button.style.backgroundColor = "#30c226";
        setTimeout(() => {
          button.removeAttribute("style");
          button.innerText = "Send";
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("No input!");
  }
};

const downloadData = () => {
  fetch(catApi)
    .then((response) => response.json())
    .then((data) => {
      createDataContainer(data, data.length, display);
    });
};
downloadData();

themeCheck.addEventListener("click", () => {
  if (themeCheck.checked === true) {
    document.querySelector("body").classList.add("body__dark");
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", "#1877de");
  } else {
    document.querySelector("body").classList.remove("body__dark");
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", "white");
  }
});
button.addEventListener("click", handleUpload);
