const button = document.querySelector("button");
const input = document.querySelector("input");
const display = document.querySelector(".up");
const data = { name: "default" };

const createDataContainer = (data, n, container) => {
  for (i = 0; i < n; i++) {
    const p = document.createElement("p");
    p.classList.add("data");
    container.appendChild(p);
    p.textContent = data[i].name;
  }
};

const handleUpload = (e) => {
  e.preventDefault();
  data.name = input.value;
  fetch("http://localhost:3000/catty", {
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
};

const downloadData = () => {
  fetch("http://localhost:3000/cat")
    .then((response) => response.json())
    .then((data) => {
      createDataContainer(data, data.length, display);
    });
};
downloadData();
button.addEventListener("click", handleUpload);
