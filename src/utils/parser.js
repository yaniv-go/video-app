const MAX_AMOUNT = process.env.MAX_OBJECTS_SEND ? parseInt(process.env.MAX_OBJECTS_SEND) : 1000

export const parseQuery = (query) => {
    let { q, limit, skip } = query

    limit = limit ? parseInt(limit) : MAX_AMOUNT
    skip = skip ? parseInt(skip) : 0

    if (isNaN(limit)) limit = MAX_AMOUNT
    if (isNaN(skip)) skip = 0

    let pattern = ''
    if (q) {
        q = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

        q.split(' ').forEach(element => {
            if (element) pattern += element + '|'
        })

        pattern = new RegExp(pattern.slice(0, -1))
    } 

    return { pattern, limit, skip, sort: { views: -1 } }
}