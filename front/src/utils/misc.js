export const formatVidLength = (length) => {
    let minutes = Math.floor(length / 60)

    if (minutes > 60) {
        const hours = Math.floor(minutes / 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })
        minutes = (minutes % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })

        return `${hours}:${minutes}`
    }

    const seconds = Math.floor(length % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })
    
    return `${minutes}:${seconds}`
}
