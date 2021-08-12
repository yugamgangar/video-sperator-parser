import axios from 'axios'

const segmentVideo = async (data) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/process-interval`, data)
        return response.data
    } catch (err) {
        return err.response.data
    }
}

const combineVideo = async (data) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/combine-video`, data)
        return response.data.data
    } catch (err) {
        return err.response.data
    }
}

export { segmentVideo, combineVideo }