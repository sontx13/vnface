export const ALL_PERMISSIONS = {
    COMPANIES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/companies', module: "COMPANIES" },
        CREATE: { method: "POST", apiPath: '/api/v1/companies', module: "COMPANIES" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/companies/:id', module: "COMPANIES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/companies/:id', module: "COMPANIES" },
    },
    JOBS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/jobs', module: "JOBS" },
        CREATE: { method: "POST", apiPath: '/api/v1/jobs', module: "JOBS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/jobs/:id', module: "JOBS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/jobs/:id', module: "JOBS" },
    },
    VOTES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/votes', module: "VOTES" },
        CREATE: { method: "POST", apiPath: '/api/v1/votes', module: "VOTES" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/votes/:id', module: "VOTES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/votes/:id', module: "VOTES" },
    },
    RESULTS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/results', module: "RESULTS" },
        CREATE: { method: "POST", apiPath: '/api/v1/results', module: "RESULTS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/results/:id', module: "RESULTS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/results/:id', module: "RESULTS" },
    },
    ATTENDANCE: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/attendances', module: "ATTENDANCE" },
        CREATE: { method: "POST", apiPath: '/api/v1/attendances', module: "ATTENDANCE" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/attendances/:id', module: "ATTENDANCE" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/attendances/:id', module: "ATTENDANCE" },
    },
    PERMISSIONS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        CREATE: { method: "POST", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/permissions/:id', module: "PERMISSIONS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/permissions/:id', module: "PERMISSIONS" },
    },
    RESUMES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/resumes', module: "RESUMES" },
        CREATE: { method: "POST", apiPath: '/api/v1/resumes', module: "RESUMES" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/resumes/:id', module: "RESUMES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/resumes/:id', module: "RESUMES" },
    },
    ROLES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/roles', module: "ROLES" },
        CREATE: { method: "POST", apiPath: '/api/v1/roles', module: "ROLES" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/roles/:id', module: "ROLES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/roles/:id', module: "ROLES" },
    },
    USERS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/users', module: "USERS" },
        CREATE: { method: "POST", apiPath: '/api/v1/users', module: "USERS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/users/:id', module: "USERS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/users/:id', module: "USERS" },
    },
}

export const ALL_MODULES = {
    AUTH: 'AUTH',
    COMPANIES: 'COMPANIES',
    FILES: 'FILES',
    JOBS: 'JOBS',
    PERMISSIONS: 'PERMISSIONS',
    RESUMES: 'RESUMES',
    VOTES: 'VOTES',
    RESULTS: 'RESULTS',
    ATTENDANCE: 'ATTENDANCE',
    ROLES: 'ROLES',
    USERS: 'USERS',
    SUBSCRIBERS: 'SUBSCRIBERS'
}
