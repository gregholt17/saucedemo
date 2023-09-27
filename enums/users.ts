enum USERS {
    STANDARD_USER = 'standard_user',
    LOCKED_OUT_USER = 'locked_out_user',
    PROBLEM_USER = 'problem_user',
    PERFORMANCE_GLITCH_USER = 'performance_glitch_user',
}

enum LOGIN_ERRORS {
    INVALID = (`Epic sadface: Username and password` + 
    ` do not match any user in this service`),
    LOCKED_OUT_USER = 'Epic sadface: Sorry, this user has been locked out.',
}

export { USERS, LOGIN_ERRORS };