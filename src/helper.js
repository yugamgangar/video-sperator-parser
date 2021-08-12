
export const getuid = () => '_' + Math.random().toString(36).substr(2, 9);

// export const testUrl = (url) => /^(http(s)?:\/\/|www\.).*(\.mp4|\.mkv)$/.test(url)

export const testUrl = (url) => url.includes('.mp4')

export const isNumber = (value) => value.length === 0 || /^\d+$/.test(value)
