const noteInput = document.getElementById("noteInput");
const postBtn = document.getElementById("postBtn");
const notesDiv = document.getElementById("notes");

async function loadNotes() {
  const res = await fetch("/api/notes");
  const notes = await res.json();

  notesDiv.innerHTML = "";

  notes.forEach(note => {
    const div = document.createElement("div");
    div.className = "note";

    div.innerHTML = `
      <div class="note-text">${note.text}</div>

      <div class="actions">
        <button class="copy-btn">Copy</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    div.querySelector(".copy-btn").onclick = () => {
      navigator.clipboard.writeText(note.text);
      alert("Copied");
    };

    div.querySelector(".delete-btn").onclick = async () => {
      await fetch(`/api/notes/${note._id}`, {
        method: "DELETE"
      });

      loadNotes();
    };

    notesDiv.appendChild(div);
  });
}

postBtn.onclick = async () => {
  const text = noteInput.value.trim();

  if (!text) return;

  await fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  noteInput.value = "";
  loadNotes();
};

loadNotes();

setInterval(loadNotes, 3000);