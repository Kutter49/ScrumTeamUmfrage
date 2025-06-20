let currentPage = 0;
  const pages = document.querySelectorAll(".page");

  function nextPage() {
    pages[currentPage].classList.remove("active");
    currentPage = Math.min(pages.length - 1, currentPage + 1);
    pages[currentPage].classList.add("active");
    console.log("Aktuelle Seite:", currentPage);
  } //Funktion für nächste Seite

  function prevPage() {
    pages[currentPage].classList.remove("active");
    currentPage = Math.max(0, currentPage - 1);
    pages[currentPage].classList.add("active");
  } // Funktion für eine Seite zurück


  document.getElementById("surveyForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const worker = document.getElementById("worker").value;
    const sprint = parseInt(document.getElementById("sprint").value); //Sprintnummer
    const hours = parseFloat(document.getElementById("officehours").value); //Stunden pro Woche im Office
    const worklocations = parseInt(document.getElementById("worklocations").value); //Anzahl Standorte im Team
    const cross_team_meetings = parseInt(document.getElementById("cross_team_meetings").value);
    const fun_level = parseInt(document.querySelector('input[name="fun_level"]:checked').value);
    const team_events = parseInt(document.getElementById("team_events").value);
    const customer_contact = parseInt(document.getElementById("customer_contact").value);
    const refactoring_hours = parseFloat(document.getElementById("refactoring_hours").value);
    const team_size = parseInt(document.getElementById("team_size").value);
    const customer_feedback_subjectiv = document.getElementById("customer_feedback_subjectiv").value;
    const team_motivation = parseInt(document.querySelector('input[name="team_motivation"]:checked').value);
    const mental_wellbeing = parseInt(document.querySelector('input[name="mental_wellbeing"]:checked').value);
    const mental_comments = document.getElementById("mental_comments").value;
    const agile_experience = parseInt(document.querySelector('input[name="agile_experience"]:checked').value);
    const trust_in_team = parseInt(document.querySelector('input[name="trust_in_team"]:checked').value);
    const focusLevelInput = document.querySelector('input[name="focus_level"]:checked');
    const focus_level = focusLevelInput ? parseInt(focusLevelInput.value) : null;
    const team_name = document.getElementById("teamSelect").value;
    const reviewStyleInput = document.querySelector('input[name="review_style"]:checked');
    const review_style = reviewStyleInput ? reviewStyleInput.value : null;
    const shared_vision = parseInt(document.getElementById("shared_vision_slider").value);
    
    const retro_result = {
        good: parseInt(document.getElementById("retro_good").value) || 0,
        bad: parseInt(document.getElementById("retro_bad").value) || 0,
        issues: parseInt(document.getElementById("retro_issues").value) || 0,
        action_items: parseInt(document.getElementById("retro_action_items").value) || 0
    };

    const s = hours / 80;
    const l = 1 - ((worklocations - 1) / 4);
    const colocationIndex = Math.round((s * 0.6 + l * 0.4) * 1000) / 10;
    const checkedBoxes = document.querySelectorAll('input[name="channelcount"]:checked');
    const communication_channels = Array.from(checkedBoxes).map(cb => cb.value);


    const result = {
      sprint,
      worker,
      timestamp: new Date().toISOString(),
      hours_in_office_per_week: hours,
      number_of_team_locations: worklocations,
      colocation_index: colocationIndex,
      communication_channels,
      fun_level,
      cross_team_meetings,
      team_events,
      customer_contact: customer_contact,
      refactoring_hours,
      team_size,
      customer_feedback_subjectiv,
      team_motivation,
      mental_wellbeing,
      mental_comments,
      agile_experience,
      trust_in_team,
      focus_level,
      review_style,
      retro_result,
      team_name,
      shared_vision
    };


    try {
      console.log("Abgesendete Daten:", result);

      const response = await fetch("https://25f6-141-37-128-1.ngrok-free.app/api/survey/submit", {
                         method: "POST",
                         headers: {
                           "Content-Type": "application/json"
                         },
                         body: JSON.stringify(result)
                       });

      const responseText = await response.text();
    if (response.ok) {
    alert("✅ Erfolgreich gesendet!");
    location.reload();
  } else {
    // Bekannten Elasticsearch-Client-Bug abfangen (kommt oft bei Status 201 mit Parsing-Fehler)
    if (response.status === 201 && responseText.includes("Unable to parse response body for Response")) {
      console.warn("⚠️ Bekannter Elasticsearch-Parse-Fehler ignoriert.");
      alert("✅ Daten gespeichert (trotz technischer Meldung).");
      location.reload();
    } else {
      console.error("❌ Fehler vom Server:", responseText);
      alert("✅  Serverfehler:\n" + responseText);
    }
  }
} catch (err) {
  console.error("❌ Netzwerkfehler:", err);
  alert("❌ Netzwerkfehler:\n" + err.message);
  }
});