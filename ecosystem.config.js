module.exports = {
    apps: [
        {
            name: 'Elite-LMS',
            exec_mode: 'cluster',
            instances: 1, // Or a number of instances
            port: '3000',
            script: 'npm',
            args: 'start'
        }
    ]
}
