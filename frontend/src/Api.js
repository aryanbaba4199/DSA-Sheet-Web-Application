
const backend_api= 'https://dsa-sheet-web-application-39141625808.asia-south1.run.app'
// const backend_api= 'http://localhost:8080'






//--------------user api's----------------------//
export const userApi = {
    me: `${backend_api}/api/users/me`,
    login: `${backend_api}/api/users/login`,
    signup: `${backend_api}/api/users/signup`,
    update_user: `${backend_api}/api/users/update-user`,
    complete_topic: `${backend_api}/api/problems/complete-topic`,
    progress: `${backend_api}/api/problems/progress`,
    logout: `${backend_api}/api/users/logout`
}


//-------------- Topic api's----------------------//
export const topicApi = {
    get_topics: `${backend_api}/api/problems`,
    
}

