const Database = require('better-sqlite3')
const db = new Database('portfolio.db')

db.exec(`
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    github_url TEXT,
    live_url TEXT
);
CREATE TABLE IF NOT EXISTS other_works (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    file_url TEXT
);
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    level TEXT,
    category TEXT,
    icon_url TEXT
);
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

// ใส่ข้อมูลตอน startup ถ้ายังไม่มี
const skillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get()
if (skillCount.count === 0) {
  const ins = db.prepare('INSERT INTO skills (name, level, category, icon_url) VALUES (?, ?, ?, ?)')
  const skills = [
    ['HTML / CSS',      'Advanced',     'Programming Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg'],
    ['JavaScript',      'Intermediate', 'Programming Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'],
    ['PHP',             'Intermediate', 'Programming Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg'],
    ['SQL',             'Intermediate', 'Programming Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'],
    ['C++ (Turbo C++)', 'Basic',        'Programming Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg'],
    ['Dart (Flutter)',  'Basic',        'Programming Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg'],
    ['Python',          'Basic',        'Programming Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'],
    ['Java',            'Basic',        'Programming Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'],
    ['Vite',            'Basic',        'Frameworks / Libraries','https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg'],
    ['React',           'Basic',        'Frameworks / Libraries','https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'],
    ['SpringBoot',      'Basic',        'Frameworks / Libraries','https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg'],
    ['Flutter',         'Intermediate', 'Frameworks / Libraries','https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg'],
    ['Node.js',         'Intermediate', 'Frameworks / Libraries','https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'],
    ['Express.js',      'Intermediate', 'Frameworks / Libraries','https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg'],
    ['Tailwind CSS',    'Intermediate', 'Frameworks / Libraries','https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg'],
    ['MySQL / phpMyAdmin','Intermediate','Database',             'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg'],
    ['SQLite',          'Intermediate', 'Database',             'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg'],
    ['Git / GitHub',    'Advanced',     'Tools',                'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'],
    ['VS Code',         'Advanced',     'Tools',                'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg'],
    ['Postman',         'Intermediate', 'Tools',                'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg'],
    ['Figma',           'Basic',        'Tools',                'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg'],
    ['Problem Solving', 'High',         'Soft Skills',          ''],
    ['Self-learning',   'High',         'Soft Skills',          ''],
    ['Teamwork',        'High',         'Soft Skills',          ''],
    ['Attention to Detail','High',      'Soft Skills',          ''],
    ['Time Management', 'High',         'Soft Skills',          ''],
  ]
  skills.forEach(s => ins.run(...s))
}

const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get()
if (projectCount.count === 0) {
  const ins = db.prepare('INSERT INTO projects (title, description, image_url, github_url, live_url) VALUES (?, ?, ?, ?, ?)')
  const projects = [
    [
      'Hotel_PMS',
      'A comprehensive Hotel Property Management System (PMS) designed to streamline hotel operations. Features include real-time room booking management, guest check-in/out workflows, and billing, built with a focus on efficiency and user experience.',
      './assets/images/HypnosHotelPMS.mp4',
      'https://github.com/MonoUmi1301/Hotel_PMS',
      'https://pmssa-production.up.railway.app/'
    ],
    [
      'BubbleBibble Vending Machine Simulator',
      'A web mockup simulating a smart vending machine for 10 beverages. Features core logic for stock management, cash/PromptPay payments, and a phone-based loyalty point system.',
      './assets/images/BubbleBibble.mp4',
      'https://github.com/MonoUmi1301/frontend_vendingmachine',
      'https://monoumi1301.github.io/frontend_vendingmachine/'
    ],
    [
      'Ghibli Universe app',
      'A Flutter web application featuring Studio Ghibli films with real-time Firebase authentication. It includes a dynamic favorites system and an interactive quiz game that stores global high scores in Firestore.',
      './assets/images/ghibliapi.mp4',
      'https://github.com/MonoUmi1301/GhhibliApi',
      'https://ghibliapi-8dcea.web.app/'
    ],
  ]
  projects.forEach(p => ins.run(...p))
}

const otherCount = db.prepare('SELECT COUNT(*) as count FROM other_works').get()
if (otherCount.count === 0) {
  const ins = db.prepare('INSERT INTO other_works (title, description, file_url) VALUES (?, ?, ?)')
  const works = [
    ['SA Project (Hypnos_PMS)',         'Systems Analysis and Design report for a Hotel Property Management System (PMS), covering requirements gathering, DFD, ER diagram, database design, UI mockups, and UML diagrams.',                                                                                            './assets/files/sa.pdf'],
    ['Design UI game (Sloth Sleuth)',    "Game design document for 'Sloth Sleuth', a puzzle/detective game for kids. Players use backward reasoning to investigate mysteries using tools like a magnifying glass and fingerprint scanner.",                                                                              './assets/files/game.pdf'],
    ['Design Chatbot',                  'Chatbot design for a Thai spa and massage business on LINE Official Account. Features rule-based auto-reply, appointment booking flow with Admin Handoff, CRM, and a Greedy Algorithm-based decision tree.',                                                                    './assets/files/chatbot.pdf'],
    ['BubbleBibble Vending Machine',    'A web-based vending machine system developed with HTML, CSS, and JS. Features a Greedy Algorithm for 10-item inventory management, supports Cash and PromptPay payments, and includes a phone-based point collection system.',                                                  './assets/files/vending.pdf'],
    ['Supporting Analysis',             'A comprehensive UX/UI analysis of the WEBTOON application, focusing on Human-Computer Interaction (HCI) principles. The study examines visual hierarchy, navigation systems, and responsive design patterns.',                                                                  './assets/files/SupportingAnalysis.pdf'],
    ['Samsung Members Redesign',        'A UI/UX redesign project focused on solving Information Overload in the Samsung Members app. By applying HCI principles, the study improves visual hierarchy and simplifies complex navigation into an intuitive grid-based support system.',                                    './assets/files/Re_design.pdf'],
  ]
  works.forEach(w => ins.run(...w))
}

module.exports = db