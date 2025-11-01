document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("introForm");
  var result = document.getElementById("result");
  var formButtonsContainer = document.querySelector(".formButtons");
  var courseContainer = document.getElementById("courseContainer");
  var pageHeading = document.querySelector("main h2");

  // create and insert "Generate JSON" button
  if (formButtonsContainer && !document.getElementById("generateJsonBtn")) {
    var genBtn = document.createElement("button");
    genBtn.type = "button";
    genBtn.id = "generateJsonBtn";
    genBtn.textContent = "Generate JSON";
    formButtonsContainer.insertBefore(genBtn, formButtonsContainer.firstChild);
  }

  function safeValue(selector, fallback) {
    if (fallback === undefined) fallback = "";
    var el = document.querySelector(selector);
    return el ? String(el.value).trim() : fallback;
  }

  function getMainBullets() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("#mainBullets input"));
    while (inputs.length < 4) {
      inputs.push({ value: "" });
    }
    return inputs.map(function (i) {
      return String(i.value).trim();
    });
  }
// highlight.js
  function loadHighlightJS(callback) {
    if (window.hljs) {
      callback();
      return;
    }
    var cssHref = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css";
    if (!document.querySelector('link[href="' + cssHref + '"]')) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssHref;
      document.head.appendChild(link);
    }
    var scriptSrc = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js";
    var existing = document.querySelector('script[src="' + scriptSrc + '"]');
    if (!existing) {
      var script = document.createElement("script");
      script.src = scriptSrc;
      script.defer = true;
      script.onload = callback;
      document.head.appendChild(script);
    } else {
      // If already present, try to call callback when it's loaded
      if (existing.readyState === "complete" || existing.readyState === "loaded") {
        callback();
      } else {
        existing.addEventListener("load", callback);
      }
    }
  }

  function buildJsonObject() {
    var firstName = safeValue("#firstName");
    var preferredName = safeValue("#nickname");
    var middleRaw = safeValue("#middleName");
    var middleInitial = "";
    if (middleRaw) {
      var m = middleRaw.trim().match(/[A-Za-z]/);
      middleInitial = m ? m[0] : middleRaw.trim();
    }

    var lastName = safeValue("#lastName");
    var divider = safeValue("#divider");
    var mascotAdjective = safeValue("#mascotAdj");
    var mascotAnimal = safeValue("#mascotAnimal");

    var pictureInput = document.getElementById("picture");
    var pictureUpload = document.getElementById("pictureUpload");
    var imageVal = pictureInput ? String(pictureInput.value).trim() : "";
    if ((!imageVal || imageVal === "") && pictureUpload && pictureUpload.files && pictureUpload.files[0]) {
      imageVal = URL.createObjectURL(pictureUpload.files[0]);
    }

    var imageCaption = safeValue("#picCaption");
    var personalStatement = safeValue("#personalStatement");

    var bullets = getMainBullets();
    var personalBackground = bullets[0] || "";
    var professionalBackground = bullets[1] || "";
    var academicBackground = bullets[2] || "";
    var subjectBackground = "";
    var primaryComputer = bullets[3] || "";

    var courseNodes = [];
    if (courseContainer) {
      courseNodes = Array.prototype.slice.call(courseContainer.querySelectorAll(".course"));
    }
    var courses = courseNodes.map(function (c) {
      var deptEl = c.querySelector(".dept");
      var numEl = c.querySelector(".num");
      var nameEl = c.querySelector(".courseName");
      var reasonEl = c.querySelector(".reason");
      return {
        department: deptEl ? String(deptEl.value).trim() : "",
        number: numEl ? String(numEl.value).trim() : "",
        name: nameEl ? String(nameEl.value).trim() : "",
        reason: reasonEl ? String(reasonEl.value).trim() : ""
      };
    });

    var linksContainer = document.getElementById("links");
    var links = [];
    if (linksContainer) {
      var linkRows = Array.prototype.slice.call(linksContainer.querySelectorAll(".link"));
      if (linkRows.length) {
        linkRows.forEach(function (row) {
          var nameInput = row.querySelector(".linkName");
          var hrefInput = row.querySelector(".linkHref");
          links.push({
            name: nameInput ? String(nameInput.value).trim() : "",
            href: hrefInput ? String(hrefInput.value).trim() : ""
          });
        });
      } else {
        // fallback: pair inputs
        var inps = Array.prototype.slice.call(linksContainer.querySelectorAll("input"));
        for (var i = 0; i < inps.length; i += 2) {
          links.push({
            name: inps[i] ? String(inps[i].value).trim() : "",
            href: inps[i + 1] ? String(inps[i + 1].value).trim() : ""
          });
        }
      }
    }

    return {
      firstName: firstName,
      preferredName: preferredName,
      middleInitial: middleInitial,
      lastName: lastName,
      divider: divider,
      mascotAdjective: mascotAdjective,
      mascotAnimal: mascotAnimal,
      image: imageVal,
      imageCaption: imageCaption,
      personalStatement: personalStatement,
      personalBackground: personalBackground,
      professionalBackground: professionalBackground,
      academicBackground: academicBackground,
      subjectBackground: subjectBackground,
      primaryComputer: primaryComputer,
      courses: courses
      
    };
  }

  function renderJsonOnPage(jsonString) {
    if (form) {
      form.style.display = "none";
    }
    if (pageHeading) {
      pageHeading.textContent = "Introduction JSON";
    }

    result.innerHTML = "";
    var container = document.createElement("section");
    container.className = "jsonResult";

    var h3 = document.createElement("h3");
    h3.className = "center";
    h3.textContent = "Generated JSON";
    container.appendChild(h3);

    var pre = document.createElement("pre");
    pre.style.overflowX = "auto";
    var code = document.createElement("code");
    code.className = "json";
    code.textContent = jsonString;
    pre.appendChild(code);
    container.appendChild(pre);

    var blob = new Blob([jsonString], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var dl = document.createElement("a");
    dl.href = url;
    var fname = safeValue("#firstName", "profile") || "profile";
    dl.download = fname + ".json";
    dl.textContent = "Download JSON";
    dl.style.display = "inline-block";
    dl.style.marginTop = "12px";
    dl.style.marginRight = "12px";
    container.appendChild(dl);

    var backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.textContent = "Start Over";
    backBtn.style.marginTop = "12px";
    backBtn.addEventListener("click", function () {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        // ignore
      }
      result.innerHTML = "";
      if (form) {
        form.reset();
        form.style.display = "block";
      }
      if (pageHeading) {
        pageHeading.textContent = "Introduction Form";
      }
    });
    container.appendChild(backBtn);

    result.appendChild(container);

    loadHighlightJS(function () {
      try {
        if (window.hljs && typeof window.hljs.highlightElement === "function") {
          window.hljs.highlightElement(code);
        } else if (window.hljs && typeof window.hljs.highlightBlock === "function") {
          window.hljs.highlightBlock(code);
        }
      } catch (err) {
        // ignore highlight errors
        // console.warn("Highlight error:", err);
      }
    });
  }

  function generateJson() {
    var firstName = safeValue("#firstName");
    var lastName = safeValue("#lastName");
    if (!firstName || !lastName) {
      alert("Please fill out at least First Name and Last Name before generating JSON.");
      return;
    }
    var obj = buildJsonObject();
    var jsonString = JSON.stringify(obj, null, 2);
    renderJsonOnPage(jsonString);
  }

  var genBtnEl = document.getElementById("generateJsonBtn");
  if (genBtnEl) {
    genBtnEl.addEventListener("click", generateJson);
  }
});
