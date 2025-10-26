document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("introForm");
  const result = document.getElementById("result");
  const addCourseBtn = document.getElementById("addCourse");
  const clearBtn = document.getElementById("clearBtn");
  const courseContainer = document.getElementById("courseContainer");

  // Display result (defined before use to satisfy no-use-before-define)
  const showResult = () => {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    if (!firstName || !lastName) {
      alert("Please fill out all required fields!");
      return;
    }

    const pictureFile = document.getElementById("pictureUpload").files[0];
    let imgSrc = document.getElementById("picture").value;
    if (pictureFile) {
      imgSrc = URL.createObjectURL(pictureFile);
    }

    const divider = document.getElementById("divider").value;
    const mascotAdj = document.getElementById("mascotAdj").value;
    const mascotAnimal = document.getElementById("mascotAnimal").value;
    const picCaption = document.getElementById("picCaption").value;
    const personalStatement = document.getElementById("personalStatement").value;
    const quote = document.getElementById("quote").value;
    const quoteAuthor = document.getElementById("quoteAuthor").value;

    const bullets = Array.from(document.querySelectorAll("#mainBullets input")).map((i) => i.value);
    const courses = Array.from(courseContainer.children).map((c) => ({
      dept: c.querySelector(".dept").value,
      num: c.querySelector(".num").value,
      name: c.querySelector(".courseName").value,
      reason: c.querySelector(".reason").value
    }));
    const links = Array.from(document.querySelectorAll("#links input")).map((i) => i.value);

    result.innerHTML = `
      <section class="introResult">
        
        <h3 class="center">${firstName} ${lastName} ${divider} ${mascotAdj} ${mascotAnimal}</h3>
        
        <figure>
        <img src="${imgSrc}" alt="Picture of ${firstName}" class="profileImg">
        <figcaption>${picCaption}</figcaption>
        </figure>
        <p class="indented">${personalStatement}</p>
        <ul>${bullets.map((b) => `<li>${b}</li>`).join("")}      <li>Courses I'm taking and why: </li>
          <ul>
          ${courses.map((c) => `<li class="indented">${c.dept} ${c.num} – ${c.name} (${c.reason})</li>`).join("")}
        </ul>
        </ul>
        
        <blockquote class="center">"${quote}"</blockquote>
        <p class="center"><em>  — ${quoteAuthor}.</em></p>
        <hr>
        
        
        <button id="resetForm">Start Over</button>
      </section>
    `;

    document.getElementById("resetForm").addEventListener("click", () => {
      result.innerHTML = "";
      form.reset();
      form.style.display = "block";
    });

    form.style.display = "none";
  };

  // Prevent default form refresh
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showResult();
  });

  // Reset restores default values (browser built-in)
  form.addEventListener("reset", () => {
    setTimeout(() => alert("Form reset to default values."), 100);
  });

  // Clear button empties all inputs
  clearBtn.addEventListener("click", () => {
    form.querySelectorAll("input, textarea").forEach((el) => {
      if (el.type !== "button" && el.type !== "submit" && el.type !== "reset")
        el.value = "";
    });
  });

  // Add new course section
  addCourseBtn.addEventListener("click", () => {
    const div = document.createElement("div");
    div.className = "course";
    div.innerHTML = `
      <label>Department: <input type="text" class="dept" required></label>
      <label>Number: <input type="text" class="num" required></label>
      <label>Name: <input type="text" class="courseName" required></label>
      <label>Reason: <input type="text" class="reason" required></label>
      <button type="button" class="deleteCourse">Delete</button>
    `;
    courseContainer.appendChild(div);
  });

  // Delegate delete course
  courseContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("deleteCourse")) {
      e.target.parentElement.remove();
    }
  });

});
// <p class="center"> ${mascotAdj} ${mascotAnimal}</p> from ln 84
// <p>${divider.repeat(30)}</p> from ln96
