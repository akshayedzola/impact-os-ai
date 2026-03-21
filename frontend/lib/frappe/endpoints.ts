export const ENDPOINTS = {
  auth: {
    login: 'auth.login',
    register: 'auth.register',
    me: 'auth.me',
  },
  projects: {
    list: 'projects.list_projects',
    create: 'projects.create_project',
    get: 'projects.get_project',
    update: 'projects.update_project',
    delete: 'projects.delete_project',
    getPublic: 'projects.get_public_project',
  },
  generate: {
    start: 'generate.start',
    status: 'generate.get_status',
  },
  chat: {
    save: 'chat.save_message',
    history: 'chat.get_history',
    updateSection: 'chat.update_project_section',
  },
  export: {
    docx: 'export.generate_docx',
    xlsx: 'export.generate_xlsx',
    list: 'export.list_exports',
  },
  templates: {
    list: 'templates.list_templates',
    apply: 'templates.apply_template',
  },
} as const;
