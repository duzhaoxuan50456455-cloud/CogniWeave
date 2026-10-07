# CogniWeave

CogniWeave is a research-driven conversation workspace exploring how different discussion interface structures affect participation, navigation, cognitive load, and idea generation.

## Research question

CogniWeave compares alternative structures for viewing the same group conversation and studies how those structures affect participants' navigation, participation, and understanding of ideas and their relationships.

## Experimental conditions

- **Condition A — Baseline:** Plain chronological chat with no reply or relation cues and no global map.
- **Condition B — Local cues:** Chronological chat with local reply context and relation cues, but no global map.
- **Condition C — Local + global structure:** The same local cues as Condition B, plus a read-only grouped relational map for navigating branches of the discussion.

## Current implementation

- React, TypeScript, and Vite application.
- Landing page, mode selection, and a three-question preference quiz for the normal product experience.
- Messaging workspace with chronological messages, reply context, reactions, keyboard-friendly composer behavior, and a conversation map in the normal product flow.
- Read-only participant experiment with participant ID setup, instructions, three discussion trials, comprehension questions, ratings, review discussion, background questions, final questionnaire, and researcher export controls.
- Three authored discussion datasets: AI in university education, mandatory attendance policies, and peer grading in group projects.
- Condition C grouped map with authored branch titles and compact message labels, parent-child structure, message previews, and Chat ↔ Map locating.
- Local experiment-session persistence and event logging in browser storage.
- Participant trial sequences counterbalanced from participant IDs.
- Researcher/demo sessions use the fixed condition order **A → B → C** while participant counterbalancing remains unchanged.

## Local setup

```bash
npm install
npm run dev
```

Vite prints the local development URL when the server starts (typically `http://localhost:5173/`).

## Experiment modes

| Mode | URL |
| --- | --- |
| Participant experiment | `http://localhost:5173/?experiment=1` |
| Researcher/demo mode | `http://localhost:5173/?experiment=1&researcher=1` |

## Screenshots

### Condition A — Baseline chronological chat

_Add Condition A screenshot here._

### Condition B — Local reply and relation cues

_Add Condition B screenshot here._

### Condition C — Global relational map

_Add Condition C / Map screenshot here._

## Status

CogniWeave is an active HCI research prototype.
