const button = document.querySelector("button");
const input = document.querySelector(".userEntry");
const display = document.querySelector(".up");
const views = document.querySelector(".view");
const themeCheck = document.querySelector('.check');
const data = { name: "default" };

const cattyApi = "https://testowy123.herokuapp.com/catty";
const catApi = "https://testowy123.herokuapp.com/cat";
const viewApi = "https://testowy123.herokuapp.com/views";

const downloadViews = () => {
  fetch(viewApi)
    .then((response) => response.json())
    .then((view) => {
      views.textContent = `View count: ${view.count}`;
    });
};
downloadViews()

const createDataContainer = (data, n, container) => {
  for (i = 0; i < n; i++) {
    const p = document.createElement("p");
    p.classList.add("data");
    container.appendChild(p);
    const t = document.createElement("pre");
    t.classList.add("time");
    container.appendChild(t);
    p.textContent = data[i].name;
    t.textContent = `Entry added at ${data[i].time}`;
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
        console.log("Success:", data);
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

themeCheck.addEventListener('click', ()=>{
  if (themeCheck.checked === true) {
    document.querySelector('body').classList.add('body__dark')
  } else {
    document.querySelector('body').classList.remove('body__dark')
  }
})
button.addEventListener("click", handleUpload);
