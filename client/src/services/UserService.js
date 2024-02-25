import axios from 'axios'

export const GetVideos=()=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'get',
                url:'https://pixabay.com/api/videos/',
                params:{
                    key:process.env.REACT_APP_API_KEY
                }
            }
            const response=await axios(config)
            return resolve(response.data)
        } catch (error) {
            return reject(error)
        }
    })
}