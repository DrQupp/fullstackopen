```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Execute javascript to update the notes shown on the page<br>Create a new note and add it to the notes list<br>Rerender the note list

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of server: add the note data in the notes array


```