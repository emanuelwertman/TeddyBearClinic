# Copilot Instructions for TeddyBearClinic

## Project Overview

TeddyBearClinic is a web application built with a **Flask** backend and vanilla **HTML, CSS, and JavaScript** frontend. It serves as a website for an organization with pages for events, gallery, merchandise, donations, team information, and more.

## Project Structure

```
TeddyBearClinic/
├── app.py               # Flask application entry point with all routes
├── requirements.txt     # Python dependencies (Flask 3.0.0)
├── static/              # Static files
│   ├── css/             # CSS stylesheets
│   ├── js/              # JavaScript files
│   ├── assets/          # Images, logos, etc.
│   └── cache/           # Cached files
├── templates/           # Jinja2 HTML templates
│   ├── partials/        # Reusable template partials
│   └── *.html           # Page templates
└── README.md
```

## Setup and Development

### Environment Setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Linux/Mac
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

```bash
python app.py
```

The application runs in debug mode by default on `http://127.0.0.1:5000`.

## Code Conventions

### Flask Routes

- All routes are defined in `app.py`
- Each route returns a rendered template using `render_template()`
- Route handlers follow the pattern:
  ```python
  @app.route("/route-name")
  def route_name():
      return render_template("route-name.html", title="Page Title")
  ```

### Templates

- Templates use Jinja2 syntax
- Place new page templates in `templates/`
- Reusable components go in `templates/partials/`
- All templates receive `site_name` and `current_year` as global variables via the context processor

### Static Files

- CSS files: `static/css/`
- JavaScript files: `static/js/`
- Images and assets: `static/assets/`

### Error Handling

- Error handlers are defined in `app.py` for 404 and 500 errors
- Error templates `404.html` and `500.html` should be created in the `templates/` directory if custom error pages are needed
- The 500 error handler logs errors using Python's `logging` module

## Adding New Pages

When adding a new page:

1. Add a new route in `app.py` following the existing pattern
2. Create the corresponding template in `templates/`
3. Use URL naming convention: `/page-name` (kebab-case)
4. Use function naming convention: `page_name()` (snake_case)

## Logging

The application uses Python's `logging` module configured at INFO level. All incoming requests are logged automatically via the `@app.before_request` hook.
