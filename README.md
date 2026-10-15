# Filmmakers' Society of Assumption College of Davao

A cinematic, static promotional website for the Filmmakers' Society Club of Assumption College of Davao. The project is built with plain HTML, CSS, and vanilla JavaScript so it can be deployed easily to GitHub Pages without a backend.

## Project structure

- `index.html` – landing page
- `about.html` – club story, mission, values, and visual overview
- `members.html` – searchable member directory with filters
- `films.html` – film portfolio with category filter and modal details
- `gallery.html` – filtered galleries with lightbox view
- `events.html` – upcoming and recent events overview
- `join.html` – membership inquiry page with validation
- `contact.html` – public contact page and placeholder note for verified backend integration
- `css/style.css` – shared cinematic black-and-gold design system
- `js/script.js` – shared page logic, filters, form validation, and page-safe initialization
- `assets/images/` – placeholder SVG assets for gallery and member visuals

## How to update content

### Images

1. Replace files in `assets/images/gallery/` and `assets/images/members/` with your verified club images.
2. Keep the same file names if you want the current page code to continue working without changes.
3. If you add new images, update the matching array entries in `js/script.js` so the correct file paths are used.

### Members

Edit the `memberData` array in `js/script.js`.

Each member entry uses:
- `name`
- `position`
- `image`
- `bio`
- `group`

The data is intentionally written as a static placeholder array so the site remains truthful until official member information is confirmed.

### Films

Edit the `filmData` array in `js/script.js`.

Each film entry uses:
- `title`
- `genre`
- `year`
- `poster`
- `synopsis`
- `description`
- `credits`
- `videoUrl`

Do not add fake credits or achievements. Replace any placeholder entries only after the club confirms the information.

### Events

Edit the `eventData` array in `js/script.js`.

Each event entry uses:
- `title`
- `type`
- `status`
- `date`
- `time`
- `location`
- `description`
- `notes`
- `poster`
- `calendarUrl`

Leave `To be confirmed` values in place until the official club details are verified.

## GitHub Pages deployment

1. Push this project folder to a GitHub repository.
2. In GitHub, open the repository settings.
3. Go to Pages.
4. Set the source to GitHub Actions or to the branch that contains the site files.
5. If the site is deployed from the repository root, use the default root structure. If the site is deployed from a project subfolder, keep the relative links as they are and make sure the Pages source points to the folder containing the HTML files.
6. For this static project, relative paths such as `css/style.css`, `js/script.js`, and `index.html` are already GitHub Pages-safe.

## Important deployment notes

- This site does not send real form submissions by default. The forms are intentionally front-end only until a verified backend or external form service is configured.
- Contact details and social links should only be published once the club confirms them.
- Keep placeholder wording until official data is approved.

## Missing real assets or information needed from the club

Use this checklist to finalize the site before publishing official club information:

- [ ] Official club email address
- [ ] Official social media links
- [ ] Full member roster with names and roles
- [ ] Officer list and leadership positions
- [ ] Verified film titles, genres, and production credits
- [ ] Real event dates, times, locations, and calendars
- [ ] Approved gallery photos from actual club activities
- [ ] Official club logo or branding assets
- [ ] Final website review by a club moderator or adviser

## Local preview

You can preview the project locally with a static server, for example:

```bash
cd famas_web
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.
