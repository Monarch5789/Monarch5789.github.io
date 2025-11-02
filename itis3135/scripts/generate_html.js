// scripts/generateHtml.js
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("introForm");
  var result = document.getElementById("result");
  var formButtonsContainer = document.querySelector(".formButtons");
  var courseContainer = document.getElementById("courseContainer");
  var pageHeading = document.querySelector("main h2");

  // Insert Generate HTML button if missing
  if (formButtonsContainer && !document.getElementById("generateHtmlBtn")) {
    var htmlBtn = document.createElement("button");
    htmlBtn.type = "button";
    htmlBtn.id = "generateHtmlBtn";
    htmlBtn.textContent = "Generate HTML";
    var jsonBtn = document.getElementById("generateJsonBtn");
    if (jsonBtn && jsonBtn.nextSibling) {
      formButtonsContainer.insertBefore(htmlBtn, jsonBtn.nextSibling);
    } else {
      formButtonsContainer.insertBefore(htmlBtn, formButtonsContainer.firstChild);
    }
  }

  // Load highlight.js (CSS + JS) if needed, then callback
  function loadHighlightJS(callback) {
    if (window.hljs) { callback(); return; }
    var cssHref = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css";
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
      if (existing.readyState === "complete" || existing.readyState === "loaded") {
        callback();
      } else {
        existing.addEventListener("load", callback);
      }
    }
  }

  // small helpers
  function safeValue(selector, fallback) {
    if (fallback === undefined) { fallback = ""; }
    var el = document.querySelector(selector);
    return el ? String(el.value).trim() : fallback;
  }

  function getMainBullets() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("#mainBullets input"));
    while (inputs.length < 4) { inputs.push({ value: "" }); }
    return inputs.map(function (i) { return String(i.value).trim(); });
  }

  function gatherCourses() {
    var nodes = [];
    if (courseContainer) {
      nodes = Array.prototype.slice.call(courseContainer.querySelectorAll(".course"));
    }
    return nodes.map(function (c) {
      var dept = c.querySelector(".dept");
      var num = c.querySelector(".num");
      var name = c.querySelector(".courseName");
      var reason = c.querySelector(".reason");
      return {
        department: dept ? String(dept.value).trim() : "",
        number: num ? String(num.value).trim() : "",
        name: name ? String(name.value).trim() : "",
        reason: reason ? String(reason.value).trim() : ""
      };
    });
  }

  // escape helpers for putting text inside attribute or content
  function escapeHtml(str) {
    if (str === undefined || str === null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Build the full HTML document string (source-only)
  function buildFullHtmlDocument() {
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
    var primaryComputer = bullets[3] || "";

    var courses = gatherCourses();

    var lines = [];
    lines.push('<section class="introResult">');
    lines.push('  <h3 class="center">' + escapeHtml(firstName + ' ' + lastName + ' ' + divider + ' ' + mascotAdjective + ' ' + mascotAnimal) + '</h3>');
    lines.push('  <figure>');
    if (imageVal) {
      lines.push('    <img src="' + escapeHtml(imageVal) + '" alt="Picture of ' + escapeHtml(firstName) + '" class="profileImg">');
    }
    lines.push('    <figcaption>' + escapeHtml(imageCaption) + '</figcaption>');
    lines.push('  </figure>');
    lines.push('  <p class="indented">' + escapeHtml(personalStatement) + '</p>');
    lines.push('  <ul>');
    lines.push('    <li>' + escapeHtml('Personal Background: ' + personalBackground) + '</li>');
    lines.push('    <li>' + escapeHtml('Professional Background: ' + professionalBackground) + '</li>');
    lines.push('    <li>' + escapeHtml('Academic Background: ' + academicBackground) + '</li>');
    lines.push('    <li>' + escapeHtml('Primary Computer: ' + primaryComputer) + '</li>');
    lines.push('  </ul>');
    lines.push('  <h4>Courses I am taking and why:</h4>');
    lines.push('  <ul>');
    for (var i = 0; i < courses.length; i++) {
      var c = courses[i];
      lines.push('    <li class="indented">' + escapeHtml(c.department + ' ' + c.number + ' – ' + c.name + ' (' + c.reason + ')') + '</li>');
    }
    lines.push('  </ul>');
    var quote = safeValue("#quote");
    var quoteAuthor = safeValue("#quoteAuthor");
    lines.push('  <blockquote class="center">' + escapeHtml(quote) + '</blockquote>');
    lines.push('  <p class="center"><em>  — ' + escapeHtml(quoteAuthor) + '.</em></p>');
    lines.push('</section>');

    // wrap into a full HTML document
    var docLines = [];
    docLines.push('<!doctype html>');
    docLines.push('<html lang="en">');
    docLines.push('<head>');
    docLines.push('  <meta charset="utf-8">');
    docLines.push('  <meta name="viewport" content="width=device-width, initial-scale=1">');
    docLines.push('  <title>' + escapeHtml(firstName || "profile") + '</title>');
    docLines.push('</head>');
    docLines.push('<body>');
    docLines = docLines.concat(lines);
    docLines.push('</body>');
    docLines.push('</html>');
    return docLines.join('\n');
  }

  // Render only the HTML source (do NOT set innerHTML to the source)
  function renderHtmlSourceOnPage(fullHtmlSource) {
    // hide form and change heading
    if (form) { form.style.display = "none"; }
    if (pageHeading) { pageHeading.textContent = "Introduction HTML"; }

    // clear result
    result.innerHTML = "";

    // heading
    var h3 = document.createElement("h3");
    h3.className = "center";
    h3.textContent = "Generated HTML Source";
    result.appendChild(h3);

    // pre/code with source (textContent, not innerHTML)
    var pre = document.createElement("pre");
    pre.style.overflowX = "auto";
    pre.style.padding = "1rem";
    pre.style.borderRadius = "8px";
    pre.style.backgroundColor = "#fbfbfb";
    pre.style.color = "#111";
    pre.style.fontFamily = "ui-monospace, Menlo, Monaco, 'Courier New', monospace";
    pre.style.whiteSpace = "pre-wrap";
    pre.style.wordBreak = "break-word";

    var code = document.createElement("code");
    code.className = "language-html hljs";
    code.textContent = fullHtmlSource; // IMPORTANT: use textContent so browser does NOT render it
    // inline styles as a fallback (ensures visibility)
    code.style.color = "#111";
    code.style.backgroundColor = "#fbfbfb";
    code.style.display = "block";
    code.style.padding = "0";
    pre.appendChild(code);
    result.appendChild(pre);

    // Download link (full html doc)
    var blob = new Blob([fullHtmlSource], { type: "text/html" });
    var url = URL.createObjectURL(blob);
    var dl = document.createElement("a");
    dl.href = url;
    dl.download = (safeValue("#firstName", "profile") || "profile") + ".html";
    dl.textContent = "Download HTML";
    dl.style.display = "inline-block";
    dl.style.margin = "12px 12px 12px 0";
    result.appendChild(dl);

    // Start Over button
    var backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.textContent = "Start Over";
    backBtn.style.marginTop = "12px";
    backBtn.addEventListener("click", function () {
      try { URL.revokeObjectURL(url); } catch (e) { /* ignore */ }
      result.innerHTML = "";
      if (form) { form.reset(); form.style.display = "block"; }
      if (pageHeading) { pageHeading.textContent = "Introduction Form"; }
    });
    result.appendChild(backBtn);

    // Highlight the code with highlight.js (load if necessary)
    loadHighlightJS(function () {
      try {
        if (window.hljs && typeof window.hljs.highlightElement === "function") {
          window.hljs.highlightElement(code);
        } else if (window.hljs && typeof window.hljs.highlight === "function") {
          code.innerHTML = window.hljs.highlight("xml", fullHtmlSource).value;
        }
      } catch (err) {
        // highlighting failed — but textContent ensures source remains visible
      }
    });
  }

  // Entry: generate HTML source and display it
  function generateHtml() {
    var firstName = safeValue("#firstName");
    var lastName = safeValue("#lastName");
    if (!firstName || !lastName) {
      alert("Please fill out at least First Name and Last Name before generating HTML.");
      return;
    }
    var fullHtmlSource = buildFullHtmlDocument();
    renderHtmlSourceOnPage(fullHtmlSource);
  }

  // Wire button
  var genHtmlBtn = document.getElementById("generateHtmlBtn");
  if (genHtmlBtn) { genHtmlBtn.addEventListener("click", generateHtml); }
});
