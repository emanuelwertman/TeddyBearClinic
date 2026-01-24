# TeddyBearClinic

A web application built with Flask backend and vanilla HTML, CSS, and JavaScript frontend.

## Project Structure

```
TeddyBearClinic/
├── app.py               # Flask application entry point
├── requirements.txt     # Python dependencies
├── static/              # Static files (CSS, JS, images)
│   ├── css/             # CSS stylesheets
│   ├── assets/          # Images, logos, etc.
│   ├── js/              # JavaScript files
│   └── images/          # Image assets
├── templates/           # HTML templates
└── README.md
```

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate  # On Linux/Mac
   # or
   venv\Scripts\activate     # On Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the application:
   ```bash
   python app.py
   ```

## Development

- Place HTML files in the `templates/` directory
- Place CSS files in the `static/css/` directory
- Place JavaScript files in the `static/js/` directory
- Place images in the `static/images/` directory
