Photo filenames are mapped exactly in components/Team.js (the `img` field per member).
Square images work best — they're cropped to a circle.

Currently wired:
  Vamshikrishna.jpeg  -> Vamshi Krishna
  siri.jpeg           -> Siri Goud
  Praneet.jpeg        -> Praneet Yadav
  kaushik.jpeg        -> Kaushik Varma
  Mounika.jpeg        -> Mounika

Missing (showing initials until added) — add the file then set its name in the
`img` field of components/Team.js:
  Akshith Devaraya  (e.g. akshith.jpeg)
  Mohana Sai        (e.g. mohanasai.jpeg)

If a photo is missing, the card automatically falls back to the member's initials.
