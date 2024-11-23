import {
    type RouteConfig,
    index,
    layout,
    route
} from '@react-router/dev/routes';

export default [
    layout('./routes/site.tsx', [
        index('routes/home.tsx'),
        route('/login', 'routes/login.tsx'),
        route('/join', 'routes/join.tsx')
    ]),
    layout('./routes/restricted.tsx', [
        route('/dashboard', 'routes/dashboard.tsx')
    ])
] satisfies RouteConfig;
